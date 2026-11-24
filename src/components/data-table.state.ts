'use client';

import { compareValues, type SortableValue, type SortState } from '../lib/table-sort';
import type { DataTableColumn } from './data-table';
import type { DataTableProps } from './data-table.types';

const EMPTY: never[] = [];

/** A stable empty array keeps the memos warm. */
export const tableRows = <T>(props: Pick<DataTableProps<T>, 'rows'>): T[] => props.rows ?? EMPTY;

const fieldValue = <T>(row: T, key: string): SortableValue =>
  (row as Record<string, SortableValue>)[key];

export const sortRows = <T>(
  data: T[],
  columns: DataTableColumn<T>[],
  active: SortState | null
): T[] => {
  const column = active && columns.find((c) => c.key === active.key);
  if (!active || !column) return data;
  const sign = active.direction === 'asc' ? 1 : -1;
  const { compare } = column;
  const valueOf = (row: T): SortableValue =>
    column.sortValue ? column.sortValue(row) : fieldValue(row, column.key);
  return [...data].sort((a, b) =>
    compare ? sign * compare(a, b) : compareValues(valueOf(a), valueOf(b), active.direction)
  );
};

export { useControlled } from '../lib/use-controlled';
