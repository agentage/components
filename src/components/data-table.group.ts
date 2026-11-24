import type * as React from 'react';

/** @deprecated `dense` is the only look; `compact`, `comfortable` and `default` are older sizes. */
export type DataTableDensity = 'dense' | 'compact' | 'comfortable' | 'default';

export interface DataTableGroup {
  key: string;
  label: React.ReactNode;
  /** Leading 14 px glyph in the group header, for example a StatusGlyph. */
  icon?: React.ReactNode;
}

/** A column key (grouped by its value) or a function returning the group of a row. */
export type DataTableGroupBy<T> = string | ((row: T) => DataTableGroup);

/** Explicit key order (unknown keys follow in first-seen order) or a comparator. */
export type DataTableGroupOrder = string[] | ((a: DataTableGroup, b: DataTableGroup) => number);

export interface DataTableGroupSlice<T> extends DataTableGroup {
  rows: T[];
}

const groupOf = <T>(row: T, groupBy: DataTableGroupBy<T>): DataTableGroup => {
  if (typeof groupBy === 'function') return groupBy(row);
  const value = (row as Record<string, unknown>)[groupBy];
  const key = value === null || value === undefined ? '' : String(value);
  return { key, label: key };
};

const orderGroups = <T>(groups: DataTableGroupSlice<T>[], order?: DataTableGroupOrder) => {
  if (!order) return groups;
  if (typeof order === 'function') return [...groups].sort(order);
  const rank = (key: string): number => {
    const index = order.indexOf(key);
    return index < 0 ? order.length : index;
  };
  return [...groups].sort((a, b) => rank(a.key) - rank(b.key));
};

/** Splits sorted rows into groups, first-seen order unless `order` is given; empty only via `keep`. */
export const groupRows = <T>(
  rows: T[],
  groupBy: DataTableGroupBy<T>,
  order?: DataTableGroupOrder,
  /** Groups that keep a header with a 0 count when no row falls in them, in this order. */
  keep?: DataTableGroup[]
): DataTableGroupSlice<T>[] => {
  const map = new Map<string, DataTableGroupSlice<T>>();
  for (const g of keep ?? []) map.set(g.key, { ...g, rows: [] });
  for (const row of rows) {
    const group = groupOf(row, groupBy);
    const slice = map.get(group.key);
    if (slice) slice.rows.push(row);
    else map.set(group.key, { ...group, rows: [row] });
  }
  return orderGroups([...map.values()], order);
};

const attr = (value: string): string => value.replace(/["\\]/g, '\\$&');

/** One container query per `hideBelow` width: the column hides when the table is narrower. */
export const hideBelowCss = (
  scope: string,
  columns: { key: string; hideBelow?: number }[]
): string =>
  columns
    .filter((c) => c.hideBelow !== undefined)
    .map(
      (c) =>
        `@container (max-width: ${String((c.hideBelow ?? 0) - 0.02)}px){[data-dt="${scope}"] [data-col="${attr(c.key)}"]{display:none}}`
    )
    .join('');

export const isDense = (density: DataTableDensity): boolean => density === 'dense';
