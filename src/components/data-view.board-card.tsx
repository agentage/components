'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { RowMenu } from './data-table.menu';
import { valueOf, type DataViewColumn } from './data-view.config';

export interface BoardCardProps<T> {
  row: T;
  /** Visible columns; their `cardSlot` places them on the card. */
  columns: DataViewColumn<T>[];
  onOpen?: () => void;
  /** DropdownMenu items; the trigger shows on hover and focus. */
  menu?: React.ReactNode;
  menuLabel?: string;
}

const cellOf = <T,>(column: DataViewColumn<T>, row: T): React.ReactNode => {
  if (column.cell) return column.cell(row);
  const v = valueOf(column, row);
  return v === null || v === undefined ? null : String(v);
};

/** Plain text beats a cell here: a cell may truncate to one line, the title clamps to two. */
const titleOf = <T,>(column: DataViewColumn<T>, row: T): React.ReactNode => {
  const v = valueOf(column, row);
  return typeof v === 'string' || typeof v === 'number' ? String(v) : cellOf(column, row);
};

/**
 * Compact board card from column slots. Line 1: `id` (mono), `meta` glyphs and `end` at the
 * right; line 2: `title`, up to two lines; line 3: `chip` cells. Without slots the first
 * growing (or first) column is the title.
 */
export const BoardCard = <T,>({ row, columns, onOpen, menu, menuLabel }: BoardCardProps<T>) => {
  const slot = (s: DataViewColumn<T>['cardSlot']) => columns.filter((c) => c.cardSlot === s);
  const titleCol = slot('title')[0] ?? columns.find((c) => c.grow) ?? columns[0];
  const ids = slot('id');
  const head = [...ids, ...slot('meta'), ...slot('end')];
  const chips = slot('chip');
  const title = titleCol ? titleOf(titleCol, row) : null;
  return (
    <div
      className={cn(
        'group/card relative flex min-w-0 flex-col gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 text-ui text-foreground',
        onOpen &&
          'cursor-pointer transition-colors duration-fast hover:bg-accent has-[[data-card-activator]:focus-visible]:outline-2 has-[[data-card-activator]:focus-visible]:-outline-offset-2 has-[[data-card-activator]:focus-visible]:outline-ring'
      )}
      data-slot="board-card-body"
    >
      {head.length > 0 && (
        <div className="flex h-[18px] min-w-0 items-center gap-1.5" data-slot="board-card-head">
          {ids.map((c) => (
            <span key={c.key} className="shrink-0 font-mono text-xs text-muted-foreground">
              {cellOf(c, row)}
            </span>
          ))}
          {slot('meta').map((c) => (
            <span key={c.key} className="flex shrink-0 items-center [&_svg]:size-3.5">
              {cellOf(c, row)}
            </span>
          ))}
          <span className="flex-1" />
          {slot('end').map((c) => (
            <span key={c.key} className="flex shrink-0 items-center">
              {cellOf(c, row)}
            </span>
          ))}
        </div>
      )}
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          className="block min-w-0 text-left leading-[1.4] outline-none after:absolute after:inset-0"
          data-card-activator=""
          data-slot="board-card-title"
        >
          <span className="line-clamp-2">{title}</span>
        </button>
      ) : (
        <span className="line-clamp-2 leading-[1.4]" data-slot="board-card-title">
          {title}
        </span>
      )}
      {chips.length > 0 && (
        <div
          className="relative flex min-w-0 flex-wrap items-center gap-1 text-xs text-muted-foreground"
          data-slot="board-card-chips"
        >
          {chips.map((c) => (
            <React.Fragment key={c.key}>{cellOf(c, row)}</React.Fragment>
          ))}
        </div>
      )}
      {menu && (
        <span className="absolute right-2 top-2 rounded-md bg-accent opacity-0 group-hover/card:opacity-100 group-focus-within/card:opacity-100 has-[[aria-expanded=true]]:opacity-100">
          <RowMenu label={menuLabel ?? 'Actions'}>{menu}</RowMenu>
        </span>
      )}
    </div>
  );
};
