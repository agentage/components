import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DataView, type DataViewColumn } from './data-view';

interface Entry {
  id: string;
  title: string;
  status: string;
}

const ROWS: Entry[] = [
  { id: 't1', title: 'Write docs', status: 'todo' },
  { id: 't2', title: 'Fix login', status: 'doing' },
  { id: 't3', title: 'Ship release', status: 'todo' },
];
const COLUMNS: DataViewColumn<Entry>[] = [
  { key: 'title', header: 'Title' },
  {
    key: 'status',
    header: 'Status',
    groupable: true,
    filter: 'multi',
    valueIcon: (v) => <svg data-testid={`glyph-${v}`} />,
  },
];

const base = { rows: ROWS, columns: COLUMNS, getRowId: (t: Entry) => t.id };

afterEach(() => localStorage.clear());

describe('DataView selection and groups', () => {
  it('multi: the bulk bar replaces the count, fires actions and clears', () => {
    const archive = vi.fn();
    render(
      <DataView
        {...base}
        selection="multi"
        bulkActions={(rows) => (
          <button onClick={() => archive(rows.map((r) => r.id))}>Archive</button>
        )}
      />
    );
    expect(screen.getByText('3 items')).toBeTruthy();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select Write docs' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select Ship release' }));
    expect(screen.getByText('2 selected')).toBeTruthy();
    expect(screen.queryByText('3 items')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Archive' }));
    expect(archive).toHaveBeenCalledWith(['t1', 't3']);
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByText('3 items')).toBeTruthy();
  });

  it('single: the opened row becomes current', () => {
    const open = vi.fn();
    render(<DataView {...base} selection="single" onRowOpen={open} />);
    fireEvent.click(screen.getByRole('button', { name: 'Fix login' }));
    expect(open).toHaveBeenCalledWith(ROWS[1]);
    expect(
      screen.getByRole('button', { name: 'Fix login' }).closest('tr')?.getAttribute('aria-current')
    ).toBe('true');
  });

  it('group headers take the value glyph, a "+" and persist collapse', () => {
    const add = vi.fn();
    const { unmount } = render(
      <DataView {...base} defaultGroupBy="status" storageKey="dv-test" onAddToGroup={add} />
    );
    expect(screen.getByTestId('glyph-todo')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Add to doing' }));
    expect(add).toHaveBeenCalledWith('doing');
    const toggles = () =>
      Array.from(document.querySelectorAll('[data-slot="group-header-toggle"]'));
    fireEvent.click(toggles()[0]);
    expect(localStorage.getItem('dv-test.collapsed.status')).toBe('["todo"]');
    unmount();
    render(<DataView {...base} defaultGroupBy="status" storageKey="dv-test" />);
    expect(toggles().map((t) => t.getAttribute('aria-expanded'))).toEqual(['false', 'true']);
  });
});
