import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableColumn } from './data-table';
import { DropdownMenuItem } from './dropdown-menu';
import { groupRows, hideBelowCss } from './data-table.group';

interface Report {
  id: string;
  service: string;
  day: string;
}

const REPORTS: Report[] = [
  { id: 'r1', service: 'alpha', day: 'Today' },
  { id: 'r2', service: 'beta', day: 'Yesterday' },
  { id: 'r3', service: 'alpha', day: 'Today' },
];

const COLUMNS: DataTableColumn<Report>[] = [
  { key: 'id', header: 'Report' },
  { key: 'service', header: 'Service', hideBelow: 600 },
];

const rowIds = (): string[] =>
  Array.from(document.querySelectorAll('[data-slot="data-table-row"]')).map(
    (r) => r.querySelector('td')?.textContent ?? ''
  );

describe('DataTable dense default', () => {
  it('uses the dense density with 36 px rows and a 32 px quiet header', () => {
    render(<DataTable columns={COLUMNS} data={REPORTS} rowKey={(r) => r.id} />);
    expect(document.querySelector('table')?.dataset.density).toBe('dense');
    const head = screen.getByRole('columnheader', { name: 'Report' });
    expect(head.className).toContain('h-8');
    expect(head.className).toContain('normal-case');
    const inner = document.querySelector(
      '[data-slot="data-table-cell"] [data-slot="disclosure"] > div > div'
    );
    expect(inner?.className).toContain('min-h-[35px]');
    expect(screen.getAllByRole('row')[1].className).toContain('hover:bg-accent');
  });

  it('gives two-line rows 52 px and keeps the older densities', () => {
    const { unmount } = render(<DataTable columns={COLUMNS} data={REPORTS} rowLines={2} />);
    expect(document.querySelector('[data-slot="disclosure"] > div > div')?.className).toContain(
      'min-h-[51px]'
    );
    unmount();
    render(<DataTable columns={COLUMNS} data={REPORTS} density="comfortable" />);
    expect(screen.getByRole('columnheader', { name: 'Report' }).className).toContain('h-10');
  });

  it('writes one container query per hideBelow column', () => {
    expect(hideBelowCss('x', COLUMNS)).toBe(
      '@container (max-width: 599.98px){[data-dt="x"] [data-col="service"]{display:none}}'
    );
    render(<DataTable columns={COLUMNS} data={REPORTS} />);
    expect(
      document.querySelector('[data-slot="data-table-container"] style')?.textContent
    ).toContain('[data-col="service"]');
  });

  it('renders a 24 px row menu with an accessible name', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={REPORTS}
        rowMenu={() => <DropdownMenuItem>Refresh now</DropdownMenuItem>}
        rowMenuLabel={(r) => `Actions for ${r.id}`}
      />
    );
    const trigger = screen.getByRole('button', { name: 'Actions for r1' });
    expect(trigger.className).toContain('size-6');
    fireEvent.click(trigger);
    expect(screen.getByRole('menuitem', { name: 'Refresh now' })).toBeTruthy();
  });
});

describe('DataTable grouping', () => {
  it('groups in first-seen order with a count, or in groupOrder', () => {
    expect(groupRows(REPORTS, 'day').map((g) => [g.key, g.rows.length])).toEqual([
      ['Today', 2],
      ['Yesterday', 1],
    ]);
    expect(groupRows(REPORTS, 'day', ['Yesterday']).map((g) => g.key)).toEqual([
      'Yesterday',
      'Today',
    ]);
    render(<DataTable columns={COLUMNS} data={REPORTS} groupBy="day" rowKey={(r) => r.id} />);
    const toggle = screen.getByRole('button', { name: /Today/ });
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(within(toggle).getByText('2')).toBeTruthy();
  });

  it('collapses a group: rows go inert and the toggle reports it', () => {
    const onChange = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={REPORTS}
        groupBy="day"
        rowKey={(r) => r.id}
        defaultCollapsedGroups={['Yesterday']}
        onCollapsedGroupsChange={onChange}
      />
    );
    const rows = document.querySelectorAll('[data-slot="data-table-row"]');
    expect(rows[2].hasAttribute('inert')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Today/ }));
    expect(onChange).toHaveBeenCalledWith(['Yesterday', 'Today']);
    expect(rows[0].hasAttribute('inert')).toBe(true);
    expect(screen.getByRole('button', { name: /Today/ }).getAttribute('aria-expanded')).toBe(
      'false'
    );
  });

  it('accepts a group function and keeps row nodes across regrouping', () => {
    const { rerender } = render(
      <DataTable columns={COLUMNS} data={REPORTS} rowKey={(r) => r.id} />
    );
    const before = document.querySelector('[data-slot="data-table-row"]');
    rerender(
      <DataTable
        columns={COLUMNS}
        data={REPORTS}
        rowKey={(r) => r.id}
        groupBy={(r) => ({ key: r.service, label: `Service ${r.service}` })}
      />
    );
    expect(screen.getByRole('button', { name: /Service beta/ })).toBeTruthy();
    expect(rowIds()).toEqual(['r1', 'r3', 'r2']);
    expect(document.querySelector('[data-slot="data-table-row"]')).toBe(before);
  });
});

describe('DataTable roving focus', () => {
  it('moves between row activators and group toggles with Up and Down', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={REPORTS}
        groupBy="day"
        rowKey={(r) => r.id}
        onRowClick={() => {}}
      />
    );
    const today = screen.getByRole('button', { name: /Today/ });
    today.focus();
    fireEvent.keyDown(today, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'r1' }));
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(today);
  });
});

describe('DataTable grow column', () => {
  it('lets only the grow column shrink and truncate', () => {
    render(
      <DataTable
        columns={[
          { key: 'id', header: 'Report', grow: true },
          { key: 'service', header: 'Service', nowrap: true },
        ]}
        data={REPORTS}
      />
    );
    const [grow, fixed] = Array.from(
      document.querySelectorAll('[data-slot="data-table-row"]')[0].querySelectorAll('td')
    );
    expect(grow.className).toContain('max-w-0');
    expect(grow.querySelector('[data-slot="disclosure"]')?.className).toContain(
      'grid-cols-[minmax(0,1fr)]'
    );
    expect(fixed.querySelector('[data-slot="disclosure"]')?.className).not.toContain('minmax');
  });
});
