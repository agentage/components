'use client';
import { useState } from 'react';
import { Button, DataView, useAnnounce } from '../../../src';
import { Block } from '../../components/demo';
import { itemColumns, itemMenu } from '../../lib/item-columns';
import { ITEMS, PEOPLE, STATUS_LABEL, type DemoItem, type ItemStatus } from '../../lib/items-data';

const COLUMNS = itemColumns();
const QUICK = [
  { key: 'mine', label: 'Mine', predicate: (t: DemoItem) => t.assignee === 'al' },
  {
    key: 'teams',
    label: 'Teams',
    predicate: (t: DemoItem) => PEOPLE.some((p) => p.team && p.k === t.assignee),
  },
];

export const Example = () => {
  const [rows, setRows] = useState(ITEMS);
  const [selected, setSelected] = useState<string[]>([]);
  const announce = useAnnounce();
  const add = (status: string) => {
    const id = `ITM-${String(100 + rows.length)}`;
    const item: DemoItem = {
      id,
      title: 'New item',
      status: status as ItemStatus,
      group: 'web',
      priority: 'none',
      assignee: null,
      labels: [],
      due: null,
    };
    setRows((l) => [...l, item]);
    announce(`Added ${id} to ${STATUS_LABEL[status as ItemStatus] ?? status}`);
  };
  const move = (picked: DemoItem[], status: ItemStatus) => {
    const ids = picked.map((r) => r.id);
    setRows((l) => l.map((t) => (ids.includes(t.id) ? { ...t, status } : t)));
    setSelected([]);
    announce(`Moved ${String(ids.length)} items to ${STATUS_LABEL[status]}`);
  };
  return (
    <Block caption="Grouped by status: tick rows, and the bulk bar replaces the count without moving them.">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <DataView
          aria-label="Items"
          className="h-[560px]"
          rows={rows}
          columns={COLUMNS}
          getRowId={(t) => t.id}
          rowLabel={(t) => `${t.id} ${t.title}`}
          searchKeys={['title', 'id']}
          searchPlaceholder="Search items"
          defaultGroupBy="status"
          defaultSort={{ key: 'priority', dir: 'asc' }}
          quickToggles={QUICK}
          storageKey="ds-docs-grouped-table"
          onAddToGroup={add}
          selection="multi"
          selectedIds={selected}
          onSelectionChange={setSelected}
          bulkActions={(picked) => (
            <>
              <Button size="sm" variant="outline" onClick={() => move(picked, 'done')}>
                Mark done
              </Button>
              <Button size="sm" variant="outline" onClick={() => move(picked, 'canceled')}>
                Cancel
              </Button>
            </>
          )}
          rowMenu={itemMenu}
          rowMenuLabel={(t) => `Actions for ${t.id}`}
          emptyState={<p className="m-0 p-6 text-ui text-muted-foreground">No items match.</p>}
        />
      </div>
    </Block>
  );
};
