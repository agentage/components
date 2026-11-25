import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTree } from './data-tree';
import { childPath, matchPaths } from './data-tree.model';

const VALUE = {
  id: 'evt_42',
  status: 200,
  ok: true,
  error: null,
  user: { name: 'Ada', roles: ['admin', 'viewer'] },
  note: 'x'.repeat(120),
};

const row = (path: string) => document.querySelector(`[data-path="${path}"]`) as HTMLElement;

describe('DataTree', () => {
  it('builds readable paths', () => {
    expect(childPath('$', 'user')).toBe('user');
    expect(childPath('user', 'roles')).toBe('user.roles');
    expect(childPath('user.roles', 0)).toBe('user.roles[0]');
    expect(childPath('$', 'a-b')).toBe('$["a-b"]');
  });

  it('shows the first level and colours values by type', () => {
    render(<DataTree value={VALUE} aria-label="Event" />);
    expect(screen.getByRole('tree', { name: 'Event' })).toBeTruthy();
    expect(row('id').dataset.kind).toBe('string');
    expect(row('status').querySelector('.text-info')?.textContent).toBe('200');
    expect(row('ok').querySelector('.text-warning')?.textContent).toBe('true');
    expect(row('error').textContent).toContain('null');
    expect(row('user').getAttribute('aria-expanded')).toBe('false');
    expect(row('user.name')).toBeNull();
  });

  it('expands and collapses a branch', () => {
    render(<DataTree value={VALUE} />);
    fireEvent.click(row('user'));
    expect(row('user').getAttribute('aria-expanded')).toBe('true');
    expect(row('user.name')).toBeTruthy();
    fireEvent.keyDown(row('user'), { key: 'ArrowLeft' });
    expect(row('user.name')).toBeNull();
  });

  it('opens the branches that hold a search hit and marks it', () => {
    expect(matchPaths(VALUE, 'viewer')).toEqual(new Set(['user.roles[1]']));
    render(<DataTree value={VALUE} highlight="viewer" />);
    const hit = row('user.roles[1]');
    expect(hit.dataset.match).toBe('true');
    expect(hit.querySelector('mark')?.textContent).toBe('viewer');
    fireEvent.click(row('user'));
    expect(row('user.roles[1]')).toBeNull();
  });

  it('cuts long strings with a toggle', () => {
    render(<DataTree value={VALUE} maxStringLength={20} />);
    const toggle = row('note').querySelector('button[aria-expanded]') as HTMLElement;
    expect(toggle.textContent).toMatch(/^\+\d+ more characters$/);
    fireEvent.click(toggle);
    expect(document.querySelector('[data-slot="data-tree-full"]')?.textContent).toBe(VALUE.note);
  });

  it('shows a large array in pages', () => {
    render(
      <DataTree
        value={{ list: Array.from({ length: 250 }, (_, i) => i) }}
        defaultExpandDepth={2}
        itemLimit={100}
      />
    );
    expect(row('list[99]')).toBeTruthy();
    expect(row('list[100]')).toBeNull();
    fireEvent.click(screen.getByText('Show 100 more of 150'));
    expect(row('list[199]')).toBeTruthy();
    expect(screen.getByText('Show 50 more of 50')).toBeTruthy();
  });
});
