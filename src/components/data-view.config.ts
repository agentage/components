import type * as React from 'react';
import type { SortableValue } from '../lib/table-sort';
import {
  applyListControls,
  type ListApplyConfig,
  type ListControlsState,
  type ListGroup,
} from '../lib/list-controls';
import type { DataTableColumn } from './data-table';
import type { ListFilterGroup } from './list-toolbar';

export type DataViewValue = string | number | boolean | null | undefined;

export interface DataViewColumn<T> extends DataTableColumn<T> {
  /** `multi`: a multi-select group in the Filter menu; `toggle`: a quick toggle (truthy rows). */
  filter?: 'multi' | 'toggle' | false;
  /** Matched by the search box; when no column sets it, every column is searched. */
  searchable?: boolean;
  /** `optional`: hidden until switched on in Display; `none`: only filters, sorts, groups or searches. */
  visibility?: 'shown' | 'optional' | 'none';
  /** The cell renders two lines (a name over a muted description); rows grow to 52 px. */
  twoLine?: boolean;
  /** Offered in Display, Group by. */
  groupable?: boolean;
  /** Group order by value when grouped by this column; unknown values follow. */
  groupOrder?: string[];
  /** Value used to filter, group, sort and search; defaults to `row[key]`. */
  value?: (row: T) => DataViewValue;
  /** Label of one value in filter menus, chips and group headers. */
  formatValue?: (value: string) => string;
  /** Leading glyph of one value in the Filter menu, for example a StatusGlyph. */
  valueIcon?: (value: string) => React.ReactNode;
  /** Plain-text header for menus when `header` is not a string. */
  label?: string;
  /**
   * Place on a board card: `id` (mono) and `meta` glyphs lead line 1, `end` closes it;
   * `title` is line 2 (two lines at most); `chip` cells fill line 3. Unset: not on the card.
   */
  cardSlot?: 'id' | 'meta' | 'end' | 'title' | 'chip';
}

export const SHOW_EMPTY = 'emptyGroups';
export const toggleFlag = (key: string): string => `toggle:${key}`;
export const columnFlag = (key: string): string => `show:${key}`;

export const valueOf = <T>(column: DataViewColumn<T>, row: T): DataViewValue =>
  column.value ? column.value(row) : (row as Record<string, DataViewValue>)[column.key];

const keyOf = (v: DataViewValue): string => (v === null || v === undefined ? '' : String(v));

export const labelOf = <T>(column: DataViewColumn<T>): string =>
  column.label ?? (typeof column.header === 'string' ? column.header : column.key);

export const formatOf = <T>(column: DataViewColumn<T>, key: string): string =>
  column.formatValue ? column.formatValue(key) : key || 'None';

/** Distinct values of a column over all rows, in first-seen order. */
export const domainOf = <T>(column: DataViewColumn<T>, rows: T[]): string[] => [
  ...new Set(rows.map((r) => keyOf(valueOf(column, r)))),
];

export const isShown = <T>(column: DataViewColumn<T>, flags: Record<string, boolean>): boolean =>
  column.visibility !== 'none' &&
  (flags[columnFlag(column.key)] ?? column.visibility !== 'optional');

export const buildConfig = <T>(columns: DataViewColumn<T>[]): ListApplyConfig<T> => {
  const marked = columns.filter((c) => c.searchable);
  const searchCols = marked.length > 0 ? marked : columns;
  const config: Required<ListApplyConfig<T>> = {
    search: (row) => searchCols.map((c) => keyOf(valueOf(c, row))).join(' '),
    filters: {},
    flags: {},
    sorts: {},
    groups: {},
    groupOrder: {},
  };
  for (const c of columns) {
    if (c.filter === 'multi') config.filters[c.key] = (row) => keyOf(valueOf(c, row));
    if (c.filter === 'toggle') config.flags[toggleFlag(c.key)] = (row) => Boolean(valueOf(c, row));
    if (c.sortable)
      config.sorts[c.key] = c.compare
        ? { compare: c.compare }
        : (row) => (c.sortValue ? c.sortValue(row) : (valueOf(c, row) as SortableValue));
    if (c.groupOrder) config.groupOrder[c.key] = c.groupOrder;
    if (c.groupable)
      config.groups[c.key] = (row): ListGroup => {
        const key = keyOf(valueOf(c, row));
        return { key, label: formatOf(c, key) };
      };
  }
  return config;
};

/** Filter groups with faceted counts: each value counts rows that pass every other control. */
export const filterGroups = <T>(
  columns: DataViewColumn<T>[],
  rows: T[],
  state: ListControlsState,
  config: ListApplyConfig<T>
): ListFilterGroup[] =>
  columns
    .filter((c) => c.filter === 'multi')
    .map((c) => {
      const others = { ...state, groupBy: null, filters: { ...state.filters, [c.key]: [] } };
      const kept = applyListControls(rows, others, config).rows;
      const counts = new Map<string, number>();
      for (const r of kept) {
        const k = keyOf(valueOf(c, r));
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      return {
        id: c.key,
        label: labelOf(c),
        // Selected values missing from the data still get a chip and a checkbox to clear them.
        options: [...new Set([...domainOf(c, rows), ...(state.filters[c.key] ?? [])])].map((v) => ({
          value: v,
          label: formatOf(c, v),
          icon: c.valueIcon?.(v),
          count: counts.get(v) ?? 0,
        })),
      };
    });

/** Every group of the active Group by column, so empty ones can still show a header. */
export const allGroups = <T>(
  column: DataViewColumn<T> | undefined,
  rows: T[]
): { key: string; label: React.ReactNode }[] =>
  column
    ? [...new Set([...(column.groupOrder ?? []), ...domainOf(column, rows)])].map((key) => ({
        key,
        label: formatOf(column, key),
      }))
    : [];

/** Board columns from the Group by column (one "All" column without it) and optional lanes. */
export const boardAxes = <T>(
  groupCol: DataViewColumn<T> | undefined,
  laneCol: DataViewColumn<T> | undefined,
  all: T[],
  shown: T[]
) => {
  const axis = (c: DataViewColumn<T>, rows: T[]) =>
    allGroups(c, rows).map((g) => ({ ...g, icon: c.valueIcon?.(g.key) }));
  return {
    columns: groupCol ? axis(groupCol, all) : [{ key: 'all', label: 'All' }],
    columnOf: (row: T) => (groupCol ? keyOf(valueOf(groupCol, row)) : 'all'),
    lanes: laneCol ? axis(laneCol, shown) : undefined,
    laneOf: laneCol ? (row: T) => keyOf(valueOf(laneCol, row)) : undefined,
  };
};

/** A table column that shows and sorts by `value` when it has no `cell` or `sortValue`. */
export const tableColumn = <T>(col: DataViewColumn<T>): DataViewColumn<T> => {
  const value = col.value;
  if (!value) return col;
  return {
    ...col,
    cell: col.cell ?? ((row) => String(value(row) ?? '')),
    sortValue: col.sortValue ?? ((row) => value(row) as SortableValue),
  };
};
