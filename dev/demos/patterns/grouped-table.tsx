'use client';
import { useState } from 'react';
import { Button, DataView, useAnnounce, type DataViewColumn } from '../../../src';
import { Block } from '../../components/demo';
import { itemColumns, itemMenu } from '../../lib/item-columns';
import { ITEMS, PEOPLE, STATUS_LABEL, type DemoItem, type ItemStatus } from '../../lib/items-data';

// Quick toggles are toggle columns that never show as a table column.
const toggle = (key: string, header: string, value: (t: DemoItem) => boolean) =>
  ({ key, header, filter: 'toggle', visibility: 'none', value }) satisfies DataViewColumn<DemoItem>;
const COLUMNS: DataViewColumn<DemoItem>[] = [
  ...itemColumns(),
  toggle('mine', 'Mine', (t) => t.assignee === 'al'),
  toggle('teams', 'Teams', (t) => PEOPLE.some((p) => p.team && p.k === t.assignee)),
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
          defaultState={{
            groupBy: 'status',
            sort: { key: 'priority', dir: 'asc' },
            storageKey: 'ds-docs-grouped-table',
          }}
          state={{ selection: selected }}
          onStateChange={(st) => setSelected(st.selection)}
          actions={{
            add,
            menu: itemMenu,
            bulk: (picked) => (
              <>
                <Button size="sm" variant="outline" onClick={() => move(picked, 'done')}>
                  Mark done
                </Button>
                <Button size="sm" variant="outline" onClick={() => move(picked, 'canceled')}>
                  Cancel
                </Button>
              </>
            ),
          }}
          empty={<p className="m-0 p-6 text-ui text-muted-foreground">No items match.</p>}
        />
      </div>
    </Block>
  );
};
