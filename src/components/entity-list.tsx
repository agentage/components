'use client';

import * as React from 'react';
import { useControlled } from '../lib/use-controlled';
import { useRovingFocus } from '../lib/use-roving-focus';
import { cn } from '../lib/utils';
import { groupRows, type DataTableGroup, type DataTableGroupOrder } from './data-table.group';
import { ItemGroup, ItemRows } from './entity-list.items';
import type { ListItem, ListRowVariant } from './entity-list.parts';

export { ListRow } from './entity-list.row';
export type { ListRowProps } from './entity-list.row';
export type { ListItem, ListRowVariant } from './entity-list.parts';

export interface ListProps<T extends ListItem = ListItem> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue'
> {
  /** Data mode: rows rendered from items, with selection and keyboard navigation. */
  items?: T[];
  /** Row layout of data-mode rows. */
  variant?: ListRowVariant;
  /** Group of an item; omit for a flat list. */
  groupBy?: (item: T) => DataTableGroup;
  groupOrder?: DataTableGroupOrder;
  /** Id of the selected item. */
  value?: string | null;
  onValueChange?: (id: string) => void;
  /** Enter or a double click on a row. */
  onOpen?: (id: string) => void;
  defaultCollapsedGroups?: string[];
  /** Keeps the collapsed groups in localStorage under this key. */
  storageKey?: string;
}

const isStrings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((s) => typeof s === 'string');

const ITEMS = '[data-slot="list-item"], [data-slot="group-header-toggle"]';

const DataListImpl = <T extends ListItem>(
  {
    items = [],
    variant = 'default',
    groupBy,
    groupOrder,
    value,
    onValueChange,
    onOpen,
    defaultCollapsedGroups = [],
    storageKey,
    className,
    'aria-label': label = 'List',
    ...props
  }: ListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const inner = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => inner.current as HTMLDivElement);
  const uid = React.useId();
  useRovingFocus(inner, { selector: ITEMS, loop: false });
  const [selected, setSelected] = useControlled(value, null, onValueChange as never);
  const [collapsed, setCollapsed, restoring] = useControlled(
    undefined,
    defaultCollapsedGroups,
    undefined,
    storageKey,
    isStrings
  );
  const rows = { variant, selected, onSelect: setSelected, onOpen };
  return (
    <div
      ref={inner}
      role="region"
      aria-label={label}
      className={cn(
        'min-h-0 bg-background text-foreground',
        restoring && '[&_*]:transition-none!',
        className
      )}
      data-slot="entity-list"
      {...props}
    >
      {groupBy ? (
        groupRows(items, groupBy, groupOrder).map((g, gi) => {
          const open = !collapsed.includes(g.key);
          return (
            <ItemGroup
              key={g.key}
              group={g}
              open={open}
              bodyId={`${uid}-group-${String(gi)}`}
              onOpenChange={(next) =>
                setCollapsed(next ? collapsed.filter((k) => k !== g.key) : [...collapsed, g.key])
              }
              {...rows}
            />
          );
        })
      ) : (
        <ItemRows rows={items} {...rows} />
      )}
    </div>
  );
};

const DataList = React.forwardRef(DataListImpl);

const ListImpl = React.forwardRef<HTMLDivElement, ListProps>((props, ref) => {
  if (props.items !== undefined) return <DataList ref={ref} {...props} />;
  const {
    className,
    variant: _v,
    groupBy: _g,
    groupOrder: _go,
    value: _val,
    onValueChange: _ov,
    onOpen: _o,
    defaultCollapsedGroups: _dc,
    storageKey: _s,
    ...rest
  } = props;
  return (
    <div
      ref={ref}
      className={cn(
        'divide-y divide-border overflow-hidden rounded-lg border border-border bg-background',
        className
      )}
      data-slot="entity-list"
      {...rest}
    />
  );
});
ListImpl.displayName = 'List';

/**
 * A list of rows. With children it is a bordered frame for `ListRow`s; with `items` it renders
 * the rows itself, grouped under collapsible counted headers, with selection, Up, Down, j and k
 * to move and Enter to open.
 */
export const List = ListImpl as <T extends ListItem = ListItem>(
  props: ListProps<T> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement | null;
