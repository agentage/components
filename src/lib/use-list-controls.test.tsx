import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { activeFilterCount, applyListControls, useListControls } from './use-list-controls';

interface Service {
  name: string;
  status: string;
  tags: string[];
  needs: boolean;
}

const SERVICES: Service[] = [
  { name: 'beta', status: 'paused', tags: ['ops'], needs: false },
  { name: 'alpha', status: 'enabled', tags: ['ops', 'docs'], needs: true },
  { name: 'gamma', status: 'enabled', tags: ['docs'], needs: false },
];

const CONFIG = {
  search: (a: Service) => a.name,
  filters: { status: (a: Service) => a.status, tag: (a: Service) => a.tags },
  flags: { needs: (a: Service) => a.needs },
  sorts: { name: (a: Service) => a.name },
  groups: { status: (a: Service) => ({ key: a.status, label: a.status }) },
  groupOrder: { status: ['paused', 'enabled'] },
};

const base = { query: '', filters: {}, view: 'list', sort: null, groupBy: null, flags: {} };
const names = (rows: Service[]) => rows.map((a) => a.name);

describe('applyListControls', () => {
  it('filters by query, multi-select groups and flags', () => {
    expect(names(applyListControls(SERVICES, { ...base, query: 'AL' }, CONFIG).rows)).toEqual([
      'alpha',
    ]);
    const tagged = applyListControls(SERVICES, { ...base, filters: { tag: ['docs'] } }, CONFIG);
    expect(names(tagged.rows)).toEqual(['alpha', 'gamma']);
    const flagged = applyListControls(SERVICES, { ...base, flags: { needs: true } }, CONFIG);
    expect(names(flagged.rows)).toEqual(['alpha']);
  });

  it('sorts both ways and groups in the configured order', () => {
    const desc = applyListControls(
      SERVICES,
      { ...base, sort: { key: 'name', dir: 'desc' } },
      CONFIG
    );
    expect(names(desc.rows)).toEqual(['gamma', 'beta', 'alpha']);
    const grouped = applyListControls(
      SERVICES,
      { ...base, sort: { key: 'name', dir: 'asc' }, groupBy: 'status' },
      CONFIG
    );
    expect(grouped.groups?.map((g) => [g.key, names(g.rows)])).toEqual([
      ['paused', ['beta']],
      ['enabled', ['alpha', 'gamma']],
    ]);
    expect(grouped.groupOf?.(SERVICES[0]).key).toBe('paused');
  });

  it('counts active filter values', () => {
    expect(activeFilterCount({ a: ['x', 'y'], b: [], c: ['z'] })).toBe(3);
  });
});

describe('useListControls', () => {
  it('updates one state object through its setters', () => {
    const { result } = renderHook(() => useListControls({ view: 'cards' }));
    act(() => result.current.toggleFilter('status', 'paused'));
    act(() => result.current.setQuery('be'));
    act(() => result.current.setSort({ key: 'name', dir: 'asc' }));
    act(() => result.current.setGroupBy('status'));
    act(() => result.current.setFlag('needs', true));
    expect(result.current.state).toEqual({
      query: 'be',
      filters: { status: ['paused'] },
      view: 'cards',
      sort: { key: 'name', dir: 'asc' },
      groupBy: 'status',
      flags: { needs: true },
    });
    act(() => result.current.toggleFilter('status', 'paused'));
    expect(result.current.state.filters.status).toEqual([]);
    act(() => result.current.clearFilters());
    act(() => result.current.setFlag('needs', false));
    expect(names(result.current.apply(SERVICES, CONFIG).rows)).toEqual(['beta']);
  });
});
