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

export interface EntityListProps<T extends ListItem = ListItem> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue'
> {
  /** Data mode: rows rendered from items, with selection and keyboard navigation. */
  items?: T[];
  /** Row layout of data-mode rows. */
  variant?: ListRowVariant;
  /** Custom row body for data mode; the row surface, selection and keys stay. */
  renderItem?: (item: T) => React.ReactNode;
  /** Group of an item; omit for a flat list. */
  groupBy?: (item: T) => DataTableGroup;
  groupOrder?: DataTableGroupOrder;
  /** Id of the selected item. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (id: string) => void;
  /** Enter or a double click on a row. */
  onOpen?: (id: string) => void;
  collapsedGroups?: string[];
  defaultCollapsedGroups?: string[];
  onCollapsedGroupsChange?: (keys: string[]) => void;
  /** Keeps the collapsed groups in localStorage under this key. */
  storageKey?: string;
  /** Accessible name of a data-mode list. */
  label?: string;
}

const isStrings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((s) => typeof s === 'string');

const ITEMS = '[data-slot="list-item"], [data-slot="group-header-toggle"]';

const DataListImpl = <T extends ListItem>(
  {
    items = [],
    variant = 'default',
    renderItem,
    groupBy,
    groupOrder,
    value,
    defaultValue = null,
    onValueChange,
    onOpen,
    collapsedGroups,
    defaultCollapsedGroups = [],
    onCollapsedGroupsChange,
    storageKey,
    label = 'List',
    className,
    ...props
  }: EntityListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const inner = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => inner.current as HTMLDivElement);
  const uid = React.useId();
  useRovingFocus(inner, { selector: ITEMS, loop: false });
  const [selected, setSelected] = useControlled(value, defaultValue, onValueChange as never);
  const [collapsed, setCollapsed, restoring] = useControlled(
    collapsedGroups,
    defaultCollapsedGroups,
    onCollapsedGroupsChange,
    storageKey,
    isStrings
  );
  const rows = { variant, selected, onSelect: setSelected, onOpen, renderItem };
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

const EntityListImpl = React.forwardRef<HTMLDivElement, EntityListProps>((props, ref) => {
  if (props.items !== undefined) return <DataList ref={ref} {...props} />;
  const {
    className,
    variant: _v,
    renderItem: _r,
    groupBy: _g,
    groupOrder: _go,
    value: _val,
    defaultValue: _dv,
    onValueChange: _ov,
    onOpen: _o,
    collapsedGroups: _c,
    defaultCollapsedGroups: _dc,
    onCollapsedGroupsChange: _oc,
    storageKey: _s,
    label: _l,
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
EntityListImpl.displayName = 'EntityList';

/**
 * A list of rows. With children it is a bordered frame for `ListRow`s; with `items` it renders
 * the rows itself, grouped under collapsible counted headers, with selection, Up, Down, j and k
 * to move and Enter to open.
 */
export const EntityList = EntityListImpl as <T extends ListItem = ListItem>(
  props: EntityListProps<T> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement | null;

/** Preferred name of `EntityList`. */
export const List = EntityList;
export type ListProps<T extends ListItem = ListItem> = EntityListProps<T>;
