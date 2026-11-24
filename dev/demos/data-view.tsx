'use client';
import { useState } from 'react';
import { Badge, Button, DataView, DropdownMenuItem, type DataViewColumn } from '../../src';
import { Block } from '../components/demo';

interface Doc {
  id: string;
  title: string;
  state: 'draft' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  owner: string;
  due: string;
  mine: boolean;
}

const STATE = { draft: 'Draft', review: 'In review', done: 'Done' };
const PRIORITY = { high: 'High', medium: 'Medium', low: 'Low' };
const TONE = {
  high: 'outline-destructive',
  medium: 'outline-primary',
  low: 'outline-muted',
} as const;

const DOCS: Doc[] = [
  {
    id: 'D-101',
    title: 'Quarterly report',
    state: 'review',
    priority: 'high',
    owner: 'Ada',
    due: '2026-11-24',
    mine: true,
  },
  {
    id: 'D-102',
    title: 'Budget draft',
    state: 'draft',
    priority: 'medium',
    owner: 'Grace',
    due: '2026-11-28',
    mine: false,
  },
  {
    id: 'D-103',
    title: 'Server inventory',
    state: 'review',
    priority: 'high',
    owner: 'Ada',
    due: '2026-11-23',
    mine: true,
  },
  {
    id: 'D-104',
    title: 'Team handbook',
    state: 'draft',
    priority: 'high',
    owner: 'Alan',
    due: '2026-11-26',
    mine: false,
  },
  {
    id: 'D-105',
    title: 'Vendor contract',
    state: 'done',
    priority: 'low',
    owner: 'Grace',
    due: '2026-11-20',
    mine: false,
  },
  {
    id: 'D-106',
    title: 'Office floor plan',
    state: 'done',
    priority: 'medium',
    owner: 'Ada',
    due: '2026-11-21',
    mine: true,
  },
  {
    id: 'D-107',
    title: 'Hiring plan',
    state: 'review',
    priority: 'medium',
    owner: 'Alan',
    due: '2026-11-25',
    mine: false,
  },
  {
    id: 'D-108',
    title: 'Safety checklist',
    state: 'draft',
    priority: 'low',
    owner: 'Grace',
    due: '2026-11-29',
    mine: false,
  },
];

const COLUMNS: DataViewColumn<Doc>[] = [
  {
    key: 'title',
    header: 'Title',
    sortable: true,
    grow: true,
    cell: (d) => <span className="truncate font-medium">{d.title}</span>,
  },
  {
    key: 'id',
    header: 'ID',
    nowrap: true,
    hideBelow: 640,
    cell: (d) => <span className="font-mono text-xs text-muted-foreground">{d.id}</span>,
  },
  {
    key: 'state',
    header: 'State',
    filter: 'multi',
    groupable: true,
    sortable: true,
    nowrap: true,
    groupOrder: ['draft', 'review', 'done'],
    formatValue: (v) => STATE[v as Doc['state']],
    cell: (d) => STATE[d.state],
  },
  {
    key: 'priority',
    header: 'Priority',
    filter: 'multi',
    groupable: true,
    nowrap: true,
    formatValue: (v) => PRIORITY[v as Doc['priority']],
    cell: (d) => <Badge variant={TONE[d.priority]}>{PRIORITY[d.priority]}</Badge>,
  },
  { key: 'owner', header: 'Owner', filter: 'multi', groupable: true, hideBelow: 560 },
  {
    key: 'due',
    header: 'Due',
    sortable: true,
    nowrap: true,
    align: 'right',
    defaultHidden: true,
    cell: (d) => <span className="text-xs text-muted-foreground">{d.due}</span>,
  },
];

const FRAME = 'overflow-hidden rounded-lg border border-border';

const menu = (d: Doc) => (
  <>
    <DropdownMenuItem>Open {d.id}</DropdownMenuItem>
    <DropdownMenuItem>Assign to me</DropdownMenuItem>
  </>
);

const empty = <p className="p-6 text-ui text-muted-foreground">No documents match.</p>;

export const Example = () => (
  <Block
    caption="One DataView, no wiring: search, the Filter menu with counts, chips, group by and the Display menu all come from the column definitions."
    className={FRAME}
  >
    <DataView
      aria-label="Documents"
      className="h-[360px]"
      rows={DOCS}
      columns={COLUMNS}
      getRowId={(d) => d.id}
      searchKeys={['title', 'id']}
      searchPlaceholder="Search documents"
      defaultSort={{ key: 'title', dir: 'asc' }}
      rowMenu={menu}
      emptyState={empty}
    />
  </Block>
);

export const Variants = () => (
  <Block
    caption="Views add a switch between table, cards and board; the choice persists in this browser."
    className={FRAME}
  >
    <DataView
      aria-label="Documents in three views"
      className="h-[400px]"
      rows={DOCS}
      columns={COLUMNS}
      getRowId={(d) => d.id}
      views={['table', 'cards', 'board']}
      defaultGroupBy="state"
      storageKey="ds-docs-data-view"
      rowMenu={menu}
      emptyState={empty}
    />
  </Block>
);

export const States = () => {
  const [ids, setIds] = useState<string[]>(['D-102']);
  return (
    <Block
      caption="Multi selection adds checkboxes, and a bulk bar replaces the result count."
      className={FRAME}
    >
      <DataView
        aria-label="Selectable documents"
        className="h-[340px]"
        rows={DOCS}
        columns={COLUMNS}
        getRowId={(d) => d.id}
        selection="multi"
        selectedIds={ids}
        onSelectionChange={setIds}
        bulkActions={(rows) => (
          <Button size="sm" variant="outline">
            Archive {rows.length}
          </Button>
        )}
        emptyState={empty}
      />
    </Block>
  );
};

export const Composition = () => (
  <Block
    caption="Quick toggles, two-line rows and a grouped list together: the Mine toggle filters rows, and each group header keeps its count."
    className={FRAME}
  >
    <DataView
      aria-label="Grouped documents"
      className="h-[400px]"
      rows={DOCS}
      columns={COLUMNS}
      getRowId={(d) => d.id}
      defaultGroupBy="priority"
      quickToggles={[{ key: 'mine', label: 'Mine', predicate: (d) => d.mine }]}
      rowLines={2}
      rowMenu={menu}
      emptyState={empty}
    />
  </Block>
);
