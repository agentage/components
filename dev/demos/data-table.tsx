'use client';
import { useState } from 'react';
import {
  DataTable,
  DropdownMenuItem,
  DropdownMenuSeparator,
  EmptyState,
  StatusGlyph,
  type DataTableColumn,
} from '../../src';
import { Block } from '../components/demo';

interface Doc {
  id: string;
  name: string;
  note: string;
  owner: string;
  state: 'Active' | 'Paused' | 'Failed';
  size: string;
}

const DOCS: Doc[] = [
  {
    id: 'd1',
    name: 'Quarterly report',
    note: 'Finance, final copy',
    owner: 'Ada Lovelace',
    state: 'Active',
    size: '2.4 MB',
  },
  {
    id: 'd2',
    name: 'Budget draft',
    note: 'Waiting for numbers',
    owner: 'Grace Hopper',
    state: 'Paused',
    size: '640 KB',
  },
  {
    id: 'd3',
    name: 'Server inventory',
    note: 'Export from the console',
    owner: 'Alan Turing',
    state: 'Failed',
    size: '88 KB',
  },
  {
    id: 'd4',
    name: 'Team handbook',
    note: 'Updated each month',
    owner: 'Ada Lovelace',
    state: 'Active',
    size: '1.1 MB',
  },
  {
    id: 'd5',
    name: 'Hiring plan',
    note: 'Draft for review',
    owner: 'Grace Hopper',
    state: 'Active',
    size: '310 KB',
  },
];

const TONE = { Active: 'success', Paused: 'muted', Failed: 'destructive' } as const;

const columns = (twoLine = false): DataTableColumn<Doc>[] => [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    grow: true,
    cell: (d) =>
      twoLine ? (
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{d.name}</span>
          <span className="truncate text-xs text-muted-foreground">{d.note}</span>
        </span>
      ) : (
        <span className="truncate font-medium">{d.name}</span>
      ),
  },
  { key: 'owner', header: 'Owner', sortable: true, hideBelow: 480 },
  {
    key: 'state',
    header: 'State',
    sortable: true,
    nowrap: true,
    cell: (d) => (
      <span className="flex items-center gap-1.5">
        <StatusGlyph shape="dot" tone={TONE[d.state]} label={d.state} />
        {d.state}
      </span>
    ),
  },
  { key: 'size', header: 'Size', align: 'right', nowrap: true },
];

const menu = (d: Doc) => (
  <>
    <DropdownMenuItem>Open {d.name}</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </>
);

const COMMON = { rows: DOCS, rowKey: (d: Doc) => d.id, rowLabel: (d: Doc) => d.name } as const;

export const Example = () => (
  <Block caption="Typed columns with click-to-sort headers and a 24 px row menu. Dense 36 px rows are the only look.">
    <DataTable
      {...COMMON}
      columns={columns()}
      defaultSort={{ key: 'name', direction: 'asc' }}
      rowMenu={menu}
      rowMenuLabel={(d) => `Actions for ${d.name}`}
    />
  </Block>
);

export const Variants = () => (
  <Block caption="Two row lines give 52 px rows with a muted second line under the name.">
    <DataTable {...COMMON} columns={columns(true)} rowLines={2} rowMenu={menu} />
  </Block>
);

export const States = () => {
  const [multi, setMulti] = useState<string[]>(['d2']);
  const [current, setCurrent] = useState<string | null>('d1');
  return (
    <div className="space-y-5">
      <Block caption="Single selection: a click makes the row current, with an accent tint and a bar.">
        <DataTable
          {...COMMON}
          columns={columns()}
          selection="single"
          selectedKeys={current ? [current] : []}
          onSelectedKeysChange={(k) => setCurrent(k[0] ?? null)}
        />
      </Block>
      <Block caption="Multi selection: a checkbox column, select all with mixed, and Shift-click ranges.">
        <DataTable
          {...COMMON}
          columns={columns()}
          selection="multi"
          selectedKeys={multi}
          onSelectedKeysChange={setMulti}
        />
      </Block>
      <Block caption="The empty slot shows when there are no rows.">
        <DataTable
          rows={[]}
          columns={columns()}
          empty={<EmptyState title="No documents" description="Add one to get started." />}
        />
      </Block>
    </div>
  );
};

export const Composition = () => (
  <Block caption="Grouping by a column: sticky collapsible group headers with counts, rows sorted inside each group, and a row menu.">
    <DataTable
      {...COMMON}
      columns={columns()}
      groupBy="owner"
      defaultSort={{ key: 'name', direction: 'asc' }}
      rowMenu={menu}
    />
  </Block>
);
