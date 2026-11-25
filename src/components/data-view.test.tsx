import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DataView, type DataViewColumn, type DataViewState } from './data-view';

interface Entry {
  id: string;
  title: string;
  status: string;
  owner: string;
  urgent: boolean;
}

const ROWS: Entry[] = [
  { id: 't1', title: 'Write docs', status: 'todo', owner: 'ana', urgent: true },
  { id: 't2', title: 'Fix login', status: 'doing', owner: 'ben', urgent: false },
  { id: 't3', title: 'Ship release', status: 'todo', owner: 'ben', urgent: false },
  { id: 't4', title: 'Review docs', status: 'done', owner: 'ana', urgent: true },
];

const COLUMNS: DataViewColumn<Entry>[] = [
  { key: 'title', header: 'Title', sortable: true, searchable: true },
  { key: 'status', header: 'Status', filter: 'multi', groupable: true, sortable: true },
  {
    key: 'owner',
    header: 'Owner',
    filter: 'multi',
    groupable: true,
    visibility: 'optional',
  },
  {
    key: 'urgent',
    header: 'Urgent',
    filter: 'toggle',
    visibility: 'none',
    value: (t) => t.urgent,
  },
];

const titles = () =>
  Array.from(document.querySelectorAll('[data-slot="data-table-row"]:not([inert])')).map(
    (r) => r.querySelector('td')?.textContent
  );

const view = (props: Partial<React.ComponentProps<typeof DataView<Entry>>> = {}) =>
  render(
    <DataView
      rows={ROWS}
      columns={COLUMNS}
      getRowId={(t) => t.id}
      views={['table', 'cards']}
      {...props}
    />
  );

const openDisplay = () => fireEvent.click(screen.getByRole('button', { name: 'Display options' }));

afterEach(() => localStorage.clear());

describe('DataView', () => {
  it('filters by text and shows the result count', () => {
    view();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'docs' } });
    expect(titles()).toEqual(['Write docs', 'Review docs']);
    expect(screen.getByText('2 of 4')).toBeTruthy();
  });

  it('builds a multi-select filter with value counts', () => {
    view();
    fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
    const todo = screen.getByRole('menuitemcheckbox', { name: /todo/ });
    expect(within(todo).getByText('2')).toBeTruthy();
    fireEvent.click(todo);
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: /done/ }));
    expect(titles()).toEqual(['Write docs', 'Ship release', 'Review docs']);
    expect(screen.getByText('Status: todo')).toBeTruthy();
  });

  it('applies a quick toggle', () => {
    view();
    fireEvent.click(screen.getByRole('button', { name: 'Urgent' }));
    expect(titles()).toEqual(['Write docs', 'Review docs']);
  });

  it('sorts from the Display menu and the header', () => {
    view();
    openDisplay();
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Title' }));
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Descending' }));
    expect(titles()[0]).toBe('Write docs');
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: /^Title/ }));
    fireEvent.click(screen.getByRole('button', { name: /^Title/ }));
    expect(titles()).toEqual(['Fix login', 'Review docs', 'Ship release', 'Write docs']);
  });

  it('groups by each groupable column, collapses, and shows empty groups', () => {
    view();
    openDisplay();
    const groupBy = screen.getByRole('group', { name: 'Group by' });
    fireEvent.click(within(groupBy).getByRole('menuitemradio', { name: 'Status' }));
    expect(document.querySelectorAll('[data-slot="group-header-toggle"]')).toHaveLength(3);
    fireEvent.click(within(groupBy).getByRole('menuitemradio', { name: 'Owner' }));
    expect(screen.getByRole('button', { name: /ben/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Show empty groups' }));
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'login' } });
    expect(screen.getByRole('button', { name: /ana/ }).textContent).toContain('0');
    fireEvent.click(screen.getByRole('button', { name: /ben/ }));
    expect(screen.getByRole('button', { name: /ben/ }).getAttribute('aria-expanded')).toBe('false');
  });

  it('switches to cards and hides or shows columns', () => {
    view();
    expect(screen.queryByRole('columnheader', { name: 'Owner' })).toBeNull();
    openDisplay();
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Owner' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Status' }));
    expect(screen.getByRole('columnheader', { name: 'Owner' })).toBeTruthy();
    expect(screen.queryByRole('columnheader', { name: /Status/ })).toBeNull();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    fireEvent.click(screen.getByRole('radio', { name: 'Cards view' }));
    expect(document.querySelectorAll('[data-slot="entity-card"]')).toHaveLength(4);
  });

  it('works controlled', () => {
    const onStateChange = vi.fn();
    const Controlled = () => {
      const [state, setState] = useState<DataViewState>({
        query: 'fix',
        filters: {},
        view: 'table',
        sort: null,
        groupBy: null,
        flags: {},
        selection: [],
        collapsed: [],
        rowsBy: null,
      });
      return (
        <DataView
          rows={ROWS}
          columns={COLUMNS}
          getRowId={(t) => t.id}
          state={state}
          onStateChange={(s) => {
            onStateChange(s);
            setState(s);
          }}
        />
      );
    };
    render(<Controlled />);
    expect(titles()).toEqual(['Fix login']);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    expect(onStateChange).toHaveBeenLastCalledWith(expect.objectContaining({ query: '' }));
    expect(titles()).toHaveLength(4);
  });

  it('keeps empty group headers when no row matches and empty groups are on', () => {
    view({ defaultState: { groupBy: 'status' } });
    openDisplay();
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Show empty groups' }));
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz' } });
    expect(document.querySelectorAll('[data-slot="group-header-toggle"]')).toHaveLength(3);
  });
});

describe('DataView group order', () => {
  interface Row {
    id: string;
    s: string;
  }
  const cols: DataViewColumn<Row>[] = [
    { key: 'id', header: 'Id' },
    { key: 's', header: 'S', groupable: true, groupOrder: ['todo', 'doing', 'done'] },
  ];
  const rows = [
    { id: '1', s: 'done' },
    { id: '2', s: 'todo' },
  ];
  const groups = (): Array<string | null> =>
    Array.from(document.querySelectorAll('[data-slot="data-table-group"]')).map((g) =>
      g.getAttribute('data-group')
    );

  it('orders groups by the column groupOrder', () => {
    render(
      <DataView rows={rows} columns={cols} getRowId={(r) => r.id} defaultState={{ groupBy: 's' }} />
    );
    expect(groups()).toEqual(['todo', 'done']);
  });

  it('includes empty groups when the flag is on', () => {
    render(
      <DataView
        rows={rows}
        columns={cols}
        getRowId={(r) => r.id}
        state={{
          query: '',
          filters: {},
          view: 'table',
          sort: null,
          groupBy: 's',
          flags: { emptyGroups: true },
        }}
      />
    );
    expect(groups()).toEqual(['todo', 'doing', 'done']);
  });
});

describe('DataView search over a secondary line', () => {
  interface Doc {
    id: string;
    name: string;
    note: string;
  }
  const docs: Doc[] = [
    { id: 'a', name: 'Alpha', note: 'weekly export of invoices' },
    { id: 'b', name: 'Beta', note: 'checks for broken links' },
  ];
  const find = (columns: DataViewColumn<Doc>[], query: string): (string | null | undefined)[] => {
    render(<DataView rows={docs} columns={columns} getRowId={(d) => d.id} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: query } });
    return titles();
  };

  it('finds a row by the text of a two-line cell kept in a hidden searchable column', () => {
    const columns: DataViewColumn<Doc>[] = [
      {
        key: 'name',
        header: 'Name',
        searchable: true,
        twoLine: true,
        cell: (d) => (
          <span>
            {d.name}
            <small>{d.note}</small>
          </span>
        ),
      },
      { key: 'note', header: 'Note', visibility: 'none', searchable: true },
    ];
    expect(find(columns, 'invoices')).toEqual(['Alphaweekly export of invoices']);
  });

  it('does not find the secondary text when only the first line is searchable', () => {
    const columns: DataViewColumn<Doc>[] = [
      { key: 'name', header: 'Name', searchable: true, cell: (d) => d.name },
      { key: 'note', header: 'Note', visibility: 'none' },
    ];
    expect(find(columns, 'invoices')).toEqual([]);
  });
});
