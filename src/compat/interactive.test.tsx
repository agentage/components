import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, EmptyState, EntityList, ListRow, StatusDot } from '../index';
import { failOnConsole } from './quiet';

failOnConsole();

const ROWS = [
  { name: 'beta', agents: 2 },
  { name: 'alpha', agents: 9 },
  { name: 'gamma', agents: 5 },
];

const names = (): string[] =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((r) => within(r).getAllByRole('cell')[0].textContent ?? '');

describe('0.20.2 DataTable and lists', () => {
  it('sorts by header click, honours defaultSort and rowActions', () => {
    const onSortChange = vi.fn();
    render(
      <DataTable
        data={ROWS}
        defaultSort={{ key: 'name', direction: 'asc' }}
        onSortChange={onSortChange}
        rowKey={(r) => r.name}
        columns={[
          {
            key: 'name',
            header: 'Name',
            sortable: true,
            nowrap: true,
            cell: (r) => <b>{r.name}</b>,
          },
          { key: 'agents', header: 'Agents', sortable: true, align: 'right' },
        ]}
        rowActions={(r) => <button type="button">Act {r.name}</button>}
        empty={<EmptyState title="None" />}
      />
    );
    expect(names()).toEqual(['alpha', 'beta', 'gamma']);
    fireEvent.click(screen.getByRole('button', { name: /Agents/ }));
    expect(names()).toEqual(['beta', 'gamma', 'alpha']);
    expect(onSortChange).toHaveBeenCalledWith({ key: 'agents', direction: 'asc' });
    expect(screen.getByRole('button', { name: 'Act beta' })).toBeTruthy();
  });

  it('shows the empty slot and fires onRowClick', () => {
    const { rerender } = render(
      <DataTable
        data={[]}
        columns={[{ key: 'name', header: 'Name' }]}
        empty={<EmptyState title="None" />}
      />
    );
    expect(screen.getByText('None')).toBeTruthy();
    const onRowClick = vi.fn();
    rerender(
      <DataTable
        data={ROWS}
        density="compact"
        onRowClick={onRowClick}
        columns={[{ key: 'name', header: 'Name' }]}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'beta' }));
    expect(onRowClick).toHaveBeenCalledWith(ROWS[0]);
  });

  it('EntityList and ListRow render title, meta and link', () => {
    render(
      <EntityList>
        <ListRow
          href="#x"
          leading={<StatusDot variant="online" />}
          title="Deploy 1"
          description="ok"
          meta="2m"
          actions={<button type="button">More</button>}
        />
      </EntityList>
    );
    expect(screen.getByRole('link', { name: /Deploy 1/ }).getAttribute('href')).toBe('#x');
    expect(screen.getByText('2m')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'More' })).toBeTruthy();
  });
});
