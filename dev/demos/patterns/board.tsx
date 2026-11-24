'use client';
import { useState } from 'react';
import { DataView, ToggleGroup, useAnnounce, type DragMove } from '../../../src';
import { Block } from '../../components/demo';
import { itemColumns, itemMenu } from '../../lib/item-columns';
import { ITEMS, STATUS_LABEL, type DemoItem, type ItemStatus } from '../../lib/items-data';

const COLUMNS = itemColumns();
type Lanes = 'none' | 'assignee' | 'group';

/** Puts the moved item before the item now at `toIndex` among its new peers. */
const applyMove = (list: DemoItem[], m: DragMove, lanes: Lanes): DemoItem[] => {
  const item = list.find((r) => r.id === m.id);
  if (!item) return list;
  const rest = list.filter((r) => r.id !== m.id);
  const moved: DemoItem = { ...item, status: m.toGroup as ItemStatus };
  if (lanes === 'assignee') moved.assignee = m.toRow || null;
  if (lanes === 'group' && m.toRow) moved.group = m.toRow;
  const lane = (r: DemoItem) =>
    lanes === 'assignee' ? (r.assignee ?? '') : lanes === 'group' ? r.group : '';
  const peers = rest.filter((r) => r.status === moved.status && lane(r) === lane(moved));
  const before = peers[m.toIndex];
  const last = peers[peers.length - 1];
  const at = before ? rest.indexOf(before) : last ? rest.indexOf(last) + 1 : rest.length;
  return [...rest.slice(0, at), moved, ...rest.slice(at)];
};

export const Example = () => {
  const [rows, setRows] = useState(ITEMS);
  const [lanes, setLanes] = useState<Lanes>('none');
  const [opened, setOpened] = useState<string | null>(null);
  const announce = useAnnounce();
  const current = rows.find((r) => r.id === opened);
  return (
    <Block caption="Drag a card to another column; Alt with an arrow key moves the focused card.">
      <div className="space-y-2">
        <div className="flex h-7 items-center gap-3 text-xs text-muted-foreground">
          <span>Swimlanes</span>
          <ToggleGroup
            variant="segmented"
            value={lanes}
            onValueChange={setLanes}
            aria-label="Swimlanes"
            options={[
              { value: 'none', label: 'None' },
              { value: 'assignee', label: 'Assignee' },
              { value: 'group', label: 'Group' },
            ]}
          />
          <span className="ml-auto" aria-live="polite">
            {current ? `Opened ${current.id}` : 'Click a card to open it'}
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <DataView
            aria-label="Items board"
            className="h-[600px]"
            rows={rows}
            columns={COLUMNS}
            getRowId={(t) => t.id}
            searchKeys={['title', 'id']}
            searchPlaceholder="Search items"
            views={['board', 'table']}
            defaultGroupBy="status"
            rowsBy={lanes === 'none' ? null : lanes}
            onMove={(m) => {
              setRows((l) => applyMove(l, m, lanes));
              announce(`${m.id} moved to ${STATUS_LABEL[m.toGroup as ItemStatus] ?? m.toGroup}`);
            }}
            onAddToGroup={(status) =>
              setRows((l) => [
                ...l,
                {
                  id: `ITM-${String(200 + l.length)}`,
                  title: 'New item',
                  status: status as ItemStatus,
                  group: 'web',
                  priority: 'none',
                  assignee: null,
                  labels: [],
                  due: null,
                },
              ])
            }
            rowMenu={itemMenu}
            rowMenuLabel={(t) => `Actions for ${t.id}`}
            onRowOpen={(t) => setOpened(t.id)}
          />
        </div>
      </div>
    </Block>
  );
};
