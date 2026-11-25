import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DataView, type DataViewColumn } from './data-view';

interface Entry {
  id: string;
  title: string;
  status: string;
}

const ROWS: Entry[] = [
  { id: 't1', title: 'Write docs', status: 'todo' },
  { id: 't2', title: 'Fix login', status: 'doing' },
];

const COLUMNS: DataViewColumn<Entry>[] = [
  { key: 'title', header: 'Title', sortable: true },
  { key: 'status', header: 'Status', groupable: true },
];

const ui = () => (
  <DataView
    rows={ROWS}
    columns={COLUMNS}
    getRowId={(t) => t.id}
    defaultState={{ groupBy: 'status', storageKey: 'dvr' }}
  />
);

const groups = () =>
  Array.from(document.querySelectorAll('[data-slot="group-header-toggle"]')).map(
    (el) => el.textContent
  );

afterEach(() => localStorage.clear());

describe('DataView restore of removed columns', () => {
  it('a stored group column that no longer exists falls back to the default grouping', () => {
    localStorage.setItem('dvr', JSON.stringify({ groupBy: 'owner' }));
    render(ui());
    expect(groups().join(' ')).toMatch(/todo/);
    expect(groups().join(' ')).toMatch(/doing/);
    expect(JSON.parse(localStorage.getItem('dvr') ?? '{}')).toMatchObject({ groupBy: 'status' });
  });

  it('a stored sort column that no longer exists falls back to no sort', () => {
    localStorage.setItem('dvr', JSON.stringify({ sort: { key: 'gone', dir: 'asc' } }));
    render(ui());
    expect(JSON.parse(localStorage.getItem('dvr') ?? '{}')).toMatchObject({ sort: null });
    expect(screen.getByText('Write docs')).toBeTruthy();
  });

  it('a stored group column that exists is kept', () => {
    localStorage.setItem('dvr', JSON.stringify({ groupBy: null }));
    render(ui());
    expect(groups()).toEqual([]);
  });
});
