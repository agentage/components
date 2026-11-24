import { act, fireEvent, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DataView, type DataViewColumn } from './data-view';

interface Entry {
  id: string;
  title: string;
  status: string;
  rank: number;
}

const ROWS: Entry[] = [
  { id: 't1', title: 'Write docs', status: 'todo', rank: 2 },
  { id: 't2', title: 'Fix login', status: 'doing', rank: 3 },
  { id: 't3', title: 'Ship release', status: 'todo', rank: 1 },
];

const COLUMNS: DataViewColumn<Entry>[] = [
  { key: 'title', header: 'Title', sortable: true },
  { key: 'status', header: 'Status', filter: 'multi', groupable: true },
];

const titles = () =>
  Array.from(document.querySelectorAll('[data-slot="data-table-row"]:not([inert])')).map(
    (r) => r.querySelector('td')?.textContent
  );

const ui = (props: Partial<React.ComponentProps<typeof DataView<Entry>>> = {}) => (
  <DataView
    rows={ROWS}
    columns={COLUMNS}
    getRowId={(t) => t.id}
    views={['table', 'cards']}
    storageKey="dv"
    {...props}
  />
);

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('DataView storage', () => {
  it('restores sort and filters but never the search query', () => {
    const first = render(ui());
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ship' } });
    first.unmount();
    const stored = JSON.parse(localStorage.getItem('dv') ?? '{}') as Record<string, unknown>;
    expect(stored.query).toBeUndefined();
    localStorage.setItem(
      'dv',
      JSON.stringify({ sort: { key: 'title', dir: 'desc' }, filters: { status: ['todo'] } })
    );
    render(ui());
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('');
    expect(titles()).toEqual(['Write docs', 'Ship release']);
  });

  it.each([
    ['bad JSON', '{oops'],
    ['null filters', '{"filters":null}'],
    ['wrong types', '{"flags":"x","sort":{"key":1},"view":7,"filters":{"status":"todo"}}'],
    ['an array', '[1]'],
  ])('falls back to defaults on %s', (_name, raw) => {
    localStorage.setItem('dv', raw);
    render(ui());
    expect(titles()).toHaveLength(3);
  });

  it('a stored filter value missing from the data still shows a chip to clear it', () => {
    localStorage.setItem('dv', JSON.stringify({ filters: { status: ['archived'] } }));
    render(ui());
    expect(titles()).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: /Remove.*archived|archived/i }));
    expect(titles()).toHaveLength(3);
  });

  it('hydrates with the stored view and no hydration error', () => {
    localStorage.setItem('dv', JSON.stringify({ view: 'cards' }));
    const host = document.createElement('div');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('no storage on the server');
    });
    host.innerHTML = renderToString(ui());
    vi.restoreAllMocks();
    document.body.appendChild(host);
    expect(host.querySelector('[data-slot="data-table"]')).toBeTruthy();
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const recoverable = vi.fn();
    act(() => {
      hydrateRoot(host, ui(), { onRecoverableError: recoverable });
    });
    expect(host.querySelector('[data-slot="data-view-cards"]')).toBeTruthy();
    expect(recoverable).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
  });

  it('a column with only `value` shows and sorts by it in the table', () => {
    const cols: DataViewColumn<Entry>[] = [
      { key: 'title', header: 'Title' },
      { key: 'rank', header: 'Rank', sortable: true, value: (r) => r.rank * 10 },
    ];
    render(ui({ columns: cols, storageKey: undefined, defaultSort: { key: 'rank', dir: 'asc' } }));
    expect(titles()).toEqual(['Ship release', 'Write docs', 'Fix login']);
    expect(screen.getByText('30')).toBeTruthy();
  });

  it('bulk actions get only the selected rows a search leaves visible', () => {
    const bulk = vi.fn(() => null);
    render(ui({ storageKey: undefined, selection: 'multi', bulkActions: bulk }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select Write docs' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select Fix login' }));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'docs' } });
    expect(screen.getByText('1 selected')).toBeTruthy();
    expect(bulk).toHaveBeenLastCalledWith([ROWS[0]]);
  });
});
