'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Disclosure } from './disclosure';
import { DefaultRowBody, listRowSize, StackedRowBody, type ListItem } from './entity-list.parts';
import type { ListRowVariant } from './entity-list.parts';
import { GroupHeader } from './group-header';
import { rowVariants } from './row.variants';
import type { DataTableGroupSlice } from './data-table.group';

export interface ItemRowsProps<T extends ListItem> {
  rows: T[];
  variant: ListRowVariant;
  selected: string | null;
  onSelect: (id: string) => void;
  onOpen?: (id: string) => void;
  renderItem?: (item: T) => React.ReactNode;
}

/** j and k move between rows, skipping group headers and shut groups. */
const stepRow = (from: HTMLElement, down: boolean): HTMLElement | undefined => {
  const root = from.closest('[data-slot="entity-list"]');
  const rows = Array.from(
    root?.querySelectorAll<HTMLElement>('[data-slot="list-item"]') ?? []
  ).filter((r) => !r.closest('[inert]'));
  return rows[rows.indexOf(from) + (down ? 1 : -1)];
};

export const ItemRows = <T extends ListItem>({
  rows,
  variant,
  selected,
  onSelect,
  onOpen,
  renderItem,
}: ItemRowsProps<T>) => {
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, id: string): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onOpen?.(id);
    } else if ((e.key === 'j' || e.key === 'k') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      stepRow(e.currentTarget, e.key === 'j')?.focus();
    }
  };
  return (
    <ul className="m-0 list-none divide-y divide-border p-0">
      {rows.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            aria-current={item.id === selected ? 'true' : undefined}
            className={rowVariants({
              size: listRowSize(variant, item.description !== undefined),
              selected: item.id === selected,
            })}
            data-slot="list-item"
            data-id={item.id}
            data-emphasized={item.emphasized || undefined}
            onClick={() => onSelect(item.id)}
            onFocus={() => item.id !== selected && onSelect(item.id)}
            onDoubleClick={() => onOpen?.(item.id)}
            onKeyDown={(e) => onKeyDown(e, item.id)}
          >
            {renderItem ? (
              renderItem(item)
            ) : variant === 'stacked' ? (
              <StackedRowBody item={item} />
            ) : (
              <DefaultRowBody item={item} />
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};

export interface ItemGroupProps<T extends ListItem> extends Omit<ItemRowsProps<T>, 'rows'> {
  group: DataTableGroupSlice<T>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bodyId: string;
}

/** One group: a sticky 32 px header with a count over an animated body. */
export const ItemGroup = <T extends ListItem>({
  group,
  open,
  onOpenChange,
  bodyId,
  ...rows
}: ItemGroupProps<T>) => (
  <section
    aria-label={typeof group.label === 'string' ? group.label : group.key}
    data-group={group.key}
    className={cn(!open && 'border-b border-border')}
  >
    <GroupHeader
      level={3}
      sticky
      label={group.label}
      icon={group.icon}
      count={group.rows.length}
      open={open}
      onOpenChange={onOpenChange}
      controls={bodyId}
    />
    <Disclosure id={bodyId} open={open} className="border-b border-border">
      <ItemRows rows={group.rows} {...rows} />
    </Disclosure>
  </section>
);
