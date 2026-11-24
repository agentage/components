'use client';

import * as React from 'react';
import { useDragReorder, type DragGroup, type DragMove } from '../lib/use-drag-reorder';
import { useCellStack } from '../lib/use-cell-stack';
import { useFlip } from '../lib/use-flip';
import { useKeepFocus } from '../lib/use-keep-focus';
import { cn } from '../lib/utils';
import { BoardColumnHead } from './data-view.board-head';

export interface BoardGroup {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface BoardViewProps<T> {
  rows: T[];
  getRowId: (row: T) => string;
  renderCard: (row: T) => React.ReactNode;
  /** Columns in order, empty ones included. */
  columns: BoardGroup[];
  columnOf: (row: T) => string;
  /** Swimlanes in order; one lane without a header when absent. */
  lanes?: BoardGroup[];
  laneOf?: (row: T) => string;
  collapsed: string[];
  onCollapsedChange: (keys: string[]) => void;
  /** Empty columns stay open; otherwise they collapse to a strip. */
  showEmpty?: boolean;
  onMove?: (move: DragMove) => void;
  onAdd?: (columnKey: string) => void;
}

const COL = 280;
const STRIP = 40;
const GAP = 8;
const INSET = 6;
const EST = 98;
const NO_LANE: BoardGroup = { key: '', label: '' };
const HINT = 'Alt with an arrow key moves the card.';

/**
 * Columns by the Group by field; every card is a child of one grid, so a move between
 * columns only changes its grid cell and the card keeps its DOM node. Cards of a cell share it
 * and stack by their top margin.
 */
export const BoardView = <T,>(p: BoardViewProps<T>) => {
  const root = React.useRef<HTMLDivElement>(null);
  const scroller = React.useRef<HTMLDivElement>(null);
  const hintId = `${React.useId()}-hint`;
  // Empty columns fold by default; opening one is local, so a drop into it never folds it.
  const [opened, setOpened] = React.useState<string[]>([]);
  const lanes = p.lanes && p.laneOf ? p.lanes : [NO_LANE];
  const laneOf = p.lanes && p.laneOf ? p.laneOf : () => '';
  const cells = new Map<string, T[]>();
  for (const row of p.rows) {
    const k = `${p.columnOf(row)}\u0000${laneOf(row)}`;
    cells.set(k, [...(cells.get(k) ?? []), row]);
  }
  const at = (c: string, l: string) => cells.get(`${c}\u0000${l}`) ?? [];
  const count = (c: string) => lanes.reduce((n, l) => n + at(c, l.key).length, 0);
  const folds = (c: string) => !p.showEmpty && count(c) === 0;
  const shut = (c: string) => (folds(c) ? !opened.includes(c) : p.collapsed.includes(c));
  const layout = (): DragGroup[] =>
    lanes.flatMap((l) =>
      p.columns.map((c) => ({
        key: c.key,
        row: l.key || undefined,
        ids: at(c.key, l.key).map(p.getRowId),
      }))
    );
  const label = (key: string) => {
    const c = p.columns.find((x) => x.key === key);
    return typeof c?.label === 'string' ? c.label : key;
  };
  const drag = useDragReorder({
    rootRef: root,
    scrollRef: scroller,
    layout,
    onMove: p.onMove,
    describe: (m, total) =>
      `Moved to ${label(m.toGroup)}, position ${String(m.toIndex + 1)} of ${String(total)}`,
  });
  // Before useFlip: FLIP must read the stacked places.
  useCellStack(root, GAP, INSET);
  useKeepFocus(root);
  const order = p.rows.map((r) => `${p.getRowId(r)}:${p.columnOf(r)}:${laneOf(r)}`).join('|');
  const shape = p.columns.map((c) => (shut(c.key) ? '0' : '1')).join('');
  useFlip(root, '[data-drag-id]', 'data-drag-id', 180, `${order}#${shape}`);

  // Row 1 holds the headers; each lane takes an optional head row and one card row.
  const placed = lanes.reduce<{ lane: BoardGroup; head: number | null; start: number }[]>(
    (out, l) => {
      const prev = out[out.length - 1];
      const next = prev ? prev.start + 1 : 2;
      const head = l === NO_LANE ? null : next;
      return [...out, { lane: l, head, start: head === null ? next : next + 1 }];
    },
    []
  );
  const flip = (list: string[], c: string) =>
    list.includes(c) ? list.filter((x) => x !== c) : [...list, c];
  const toggle = (c: string) =>
    folds(c) ? setOpened((o) => flip(o, c)) : p.onCollapsedChange(flip(p.collapsed, c));
  const last = placed[placed.length - 1];
  const rowEnd = last ? last.start + 1 : 2;

  return (
    <div ref={scroller} className="h-full overflow-auto p-4" data-slot="data-view-board">
      <div
        ref={root}
        className="relative grid w-max auto-rows-min gap-x-2 gap-y-2"
        style={{
          gridTemplateColumns: p.columns
            .map((c) => `${String(shut(c.key) ? STRIP : COL)}px`)
            .join(' '),
        }}
      >
        {p.columns.map((c, ci) => (
          <BoardColumnHead
            key={c.key}
            column={c}
            index={ci}
            count={count(c.key)}
            collapsed={shut(c.key)}
            rowEnd={rowEnd}
            onToggle={() => toggle(c.key)}
            onAdd={p.onAdd}
          />
        ))}
        {placed.map(({ lane, head, start }) => (
          <React.Fragment key={`lane:${lane.key}`}>
            {head !== null && (
              <div
                className="sticky left-0 flex h-8 w-max items-center gap-2 pt-2 text-ui font-semibold"
                style={{ gridColumn: '1 / -1', gridRow: head }}
                data-slot="board-lane"
              >
                {lane.icon}
                {lane.label}
                <span className="text-xs font-normal tabular-nums text-muted-foreground">
                  {p.columns.reduce((n, c) => n + at(c.key, lane.key).length, 0)}
                </span>
              </div>
            )}
            {p.columns.map((c, ci) => (
              <div
                key={c.key}
                className="rounded-lg bg-muted/40"
                style={{ gridColumn: ci + 1, gridRow: start }}
                data-drop-group={c.key}
                data-drop-row={lane.key}
                aria-hidden="true"
              />
            ))}
          </React.Fragment>
        ))}
        {/* DOM order is lane, column, position, so Tab follows the board, not the data. */}
        {placed
          .flatMap(({ lane: l }) => p.columns.flatMap((c) => at(c.key, l.key)))
          .map((row) => {
            const id = p.getRowId(row);
            const c = p.columnOf(row);
            const ci = p.columns.findIndex((x) => x.key === c);
            const lane = placed.find((x) => x.lane.key === laneOf(row));
            const peers = at(c, laneOf(row));
            const index = peers.indexOf(row);
            if (ci < 0 || !lane) return null;
            return (
              <div
                key={id}
                {...drag.itemProps(id)}
                role="group"
                aria-label={`${label(c)}, ${String(index + 1)} of ${String(peers.length)}`}
                aria-describedby={p.onMove ? hintId : undefined}
                className={cn(
                  'relative z-10 mx-1.5 mb-1.5 min-w-0 self-start data-[dragging]:opacity-40',
                  shut(c) && 'hidden'
                )}
                // A first guess for the server render; useCellStack sets the measured margin.
                style={{ gridColumn: ci + 1, gridRow: lane.start, marginTop: INSET + index * EST }}
                data-stack-cell={JSON.stringify([c, laneOf(row)])}
                data-slot="board-card"
              >
                {p.renderCard(row)}
              </div>
            );
          })}
        {p.onMove && (
          <span id={hintId} hidden>
            {HINT}
          </span>
        )}
        {drag.target && (
          <div
            className="pointer-events-none absolute z-20 h-0.5 rounded-full bg-primary"
            style={drag.target.line}
            data-slot="board-drop-line"
          />
        )}
      </div>
    </div>
  );
};
