import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableColumn } from './data-table';

interface Machine {
  name: string;
  members: number;
  lastSeen: Date;
  status?: string;
}

const DATA: Machine[] = [
  { name: 'ci-runner', members: 7, lastSeen: new Date('2026-01-03'), status: 'online' },
  { name: 'Alpha', members: 12, lastSeen: new Date('2026-01-01') },
  { name: 'beta', members: 2, lastSeen: new Date('2026-01-02'), status: 'offline' },
];

const COLUMNS: DataTableColumn<Machine>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'members', header: 'Members', sortable: true, align: 'right' },
  {
    key: 'lastSeen',
    header: 'Last seen',
    sortable: true,
    nowrap: true,
    cell: (row) => row.lastSeen.toISOString().slice(0, 10),
  },
  { key: 'status', header: 'Status' },
];

const names = (): string[] =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.querySelectorAll('td')[0].textContent ?? '');

const header = (name: string): HTMLElement => screen.getByRole('columnheader', { name });

describe('DataTable', () => {
  it('renders column headers and field values without a cell renderer', () => {
    render(<DataTable columns={COLUMNS} rows={DATA} />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(4);
    expect(names()).toEqual(['ci-runner', 'Alpha', 'beta']);
    expect(screen.getByText('online')).not.toBeNull();
  });

  it('sorts strings case-insensitively through the asc / desc / none cycle', () => {
    render(<DataTable columns={COLUMNS} rows={DATA} />);
    const button = screen.getByRole('button', { name: /Name/ });

    expect(header('Name').getAttribute('aria-sort')).toBe('none');
    fireEvent.click(button);
    expect(header('Name').getAttribute('aria-sort')).toBe('ascending');
    expect(names()).toEqual(['Alpha', 'beta', 'ci-runner']);

    fireEvent.click(button);
    expect(header('Name').getAttribute('aria-sort')).toBe('descending');
    expect(names()).toEqual(['ci-runner', 'beta', 'Alpha']);

    fireEvent.click(button);
    expect(header('Name').getAttribute('aria-sort')).toBe('none');
    expect(names()).toEqual(['ci-runner', 'Alpha', 'beta']);
  });

  it('sorts numbers numerically and dates chronologically', () => {
    render(<DataTable columns={COLUMNS} rows={DATA} />);
    fireEvent.click(screen.getByRole('button', { name: /Members/ }));
    expect(names()).toEqual(['beta', 'ci-runner', 'Alpha']);

    fireEvent.click(screen.getByRole('button', { name: /Last seen/ }));
    expect(names()).toEqual(['Alpha', 'beta', 'ci-runner']);
  });

  it('is keyboard operable from the header button', () => {
    render(<DataTable columns={COLUMNS} rows={DATA} />);
    const button = screen.getByRole('button', { name: /Name/ });
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.click(button); // jsdom does not synthesize the click Enter would fire
    expect(header('Name').getAttribute('aria-sort')).toBe('ascending');
    expect(document.activeElement).toBe(button);
  });

  it('honours a custom comparator and sortValue', () => {
    const columns: DataTableColumn<Machine>[] = [
      { key: 'name', header: 'Name', sortable: true, compare: (a, b) => a.members - b.members },
      { key: 'status', header: 'Status', sortable: true, sortValue: (row) => row.status ?? null },
    ];
    render(<DataTable columns={columns} rows={DATA} />);

    fireEvent.click(screen.getByRole('button', { name: /Name/ }));
    expect(names()).toEqual(['beta', 'ci-runner', 'Alpha']);

    fireEvent.click(screen.getByRole('button', { name: /Status/ }));
    expect(names()).toEqual(['beta', 'ci-runner', 'Alpha']); // missing status sorts last
  });

  it('stays controlled when sort + onSortChange are supplied', () => {
    const onSortChange = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        rows={DATA}
        sort={{ key: 'members', direction: 'desc' }}
        onSortChange={onSortChange}
      />
    );
    expect(names()).toEqual(['Alpha', 'ci-runner', 'beta']);

    fireEvent.click(screen.getByRole('button', { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
    expect(names()).toEqual(['Alpha', 'ci-runner', 'beta']);
  });

  it('seeds the uncontrolled state from defaultSort', () => {
    render(
      <DataTable columns={COLUMNS} rows={DATA} defaultSort={{ key: 'name', direction: 'desc' }} />
    );
    expect(names()).toEqual(['ci-runner', 'beta', 'Alpha']);
  });

  it('applies per-column align and nowrap', () => {
    render(<DataTable columns={COLUMNS} rows={DATA} />);
    expect(header('Members').className).toContain('text-right');
    const [, , lastSeen] = Array.from(screen.getAllByRole('row')[1].querySelectorAll('td'));
    expect(lastSeen.className).toContain('whitespace-nowrap');
  });

  it('renders the empty slot spanning every column', () => {
    render(
      <DataTable columns={COLUMNS} rows={[]} rowActions={() => null} empty={<p>No machines</p>} />
    );
    expect(screen.getByText('No machines')).not.toBeNull();
    expect(screen.getByRole('cell').getAttribute('colspan')).toBe('5');
  });

  it('renders row actions above the row activator', () => {
    render(
      <DataTable
        columns={COLUMNS}
        rows={DATA}
        rowKey={(row) => row.name}
        rowActions={(row) => <button type="button">Actions for {row.name}</button>}
      />
    );
    const actionsCell = screen.getAllByRole('row')[1].querySelectorAll('td')[4];
    expect(actionsCell.className).toContain('z-10');
    expect(screen.getByRole('button', { name: 'Actions for ci-runner' })).not.toBeNull();
  });

  it('activates onRowClick through a real button', () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={COLUMNS} rows={DATA} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Alpha' }));
    expect(onRowClick).toHaveBeenCalledWith(DATA[1]);
  });

  it('drops the sticky header when sticky is false', () => {
    const { rerender } = render(<DataTable columns={COLUMNS} rows={DATA} />);
    expect(header('Status').className).toContain('sticky');
    rerender(<DataTable columns={COLUMNS} rows={DATA} sticky={false} />);
    expect(header('Status').className).not.toContain('sticky');
  });

  it('forwards the table ref', () => {
    const ref = { current: null } as React.RefObject<HTMLTableElement | null>;
    render(<DataTable columns={COLUMNS} rows={DATA} ref={ref} />);
    expect(ref.current?.tagName).toBe('TABLE');
  });
});
