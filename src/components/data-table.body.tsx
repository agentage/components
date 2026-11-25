'use client';

import * as React from 'react';
import type { SortableValue } from '../lib/table-sort';
import { cn } from '../lib/utils';
import { type DataTableDensity, type DataTableGroupSlice, isDense } from './data-table.group';
import { GroupHeadRow } from './data-table.group-head';
import { RowActivator } from './data-table.parts';
import { Disclosure } from './disclosure';
import { SelectBox, type SelectionState } from './data-table.selection';
import { RowMenu } from './data-table.menu';
import {
  dataTableCellInnerVariants,
  dataTableCellVariants,
  dataTableRowVariants,
} from './data-table.variants';
import { TableCell, TableRow } from './table';
import type { DataTableColumn } from './data-table';

export interface BodyOptions<T> {
  columns: DataTableColumn<T>[];
  density: DataTableDensity;
  rowLines: 1 | 2;
  rowKey?: (row: T, index: number) => string;
  rowHref?: (row: T) => string | undefined;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
  rowMenu?: (row: T) => React.ReactNode;
  rowMenuLabel?: (row: T) => string;
  isRowSelected?: (row: T) => boolean;
  selection?: SelectionState;
  /** Accessible name of a row, for its select checkbox. */
  rowLabel?: (row: T) => string;
}

const fieldValue = <T,>(row: T, key: string): SortableValue =>
  (row as Record<string, SortableValue>)[key];

const renderValue = (value: SortableValue): React.ReactNode =>
  value === null || value === undefined ? null : String(value);

// Controls in other cells sit above the stretched row activator.
const LIFT =
  '[&_:is(a,button,input,select,textarea,[role=switch],[tabindex])]:relative [&_:is(a,button,input,select,textarea,[role=switch],[tabindex])]:z-10';

interface RowProps<T> extends BodyOptions<T> {
  row: T;
  rowId: string;
  shut: boolean;
}

const BodyRow = <T,>({ row, rowId, shut, ...o }: RowProps<T>): React.JSX.Element => {
  const dense = isDense(o.density);
  const href = o.rowHref?.(row);
  const sel = o.selection;
  const single = sel?.mode === 'single';
  const picked = sel?.selected.includes(rowId) ?? false;
  const open = o.onRowClick;
  const onClick =
    open || single
      ? () => {
          if (single) sel?.setCurrent(rowId);
          open?.(row);
        }
      : undefined;
  const interactive = href !== undefined || onClick !== undefined;
  // A column hidden by a container query would take the row's only link with it.
  const activatorColumn = o.columns.find((c) => c.hideBelow === undefined) ?? o.columns[0];
  const cellClass = (column?: DataTableColumn<T>) =>
    cn(
      dataTableCellVariants({
        density: o.density,
        align: column?.align,
        nowrap: column?.nowrap,
      }),
      // A shut row folds to its animated content; the 36 px cell height would keep a blank row.
      shut &&
        'h-0 py-0 group-data-[look=comfortable]/table:h-0 group-data-[look=comfortable]/table:py-0',
      column?.grow && 'w-full max-w-0',
      column?.className
    );
  const inner = (align?: 'left' | 'center' | 'right') =>
    dense ? dataTableCellInnerVariants({ lines: o.rowLines, align }) : undefined;

  return (
    <TableRow
      className={dataTableRowVariants({ dense, interactive, shut, current: single && picked })}
      data-slot="data-table-row"
      data-state={
        o.isRowSelected?.(row) || (sel?.mode === 'multi' && picked) ? 'selected' : undefined
      }
      aria-current={single && picked ? 'true' : undefined}
      inert={shut}
    >
      {sel?.mode === 'multi' && (
        <TableCell className={cellClass()} data-slot="data-table-select-cell">
          <Disclosure open={!shut} fade className={inner()}>
            <SelectBox
              checked={picked}
              label={`Select ${o.rowLabel?.(row) ?? 'row'}`}
              onToggle={(range) => sel.toggle(rowId, range)}
            />
          </Disclosure>
        </TableCell>
      )}
      {o.columns.map((column) => {
        const content = column.cell ? column.cell(row) : renderValue(fieldValue(row, column.key));
        const activator = column === activatorColumn && interactive;
        return (
          <TableCell
            key={column.key}
            className={cn(cellClass(column), !activator && interactive && LIFT)}
            data-col={column.key}
            data-slot="data-table-cell"
          >
            <Disclosure open={!shut} fade shrink={column.grow} className={inner(column.align)}>
              {activator ? (
                <RowActivator href={href} onClick={onClick}>
                  {content}
                </RowActivator>
              ) : (
                content
              )}
            </Disclosure>
          </TableCell>
        );
      })}
      {(o.rowActions || o.rowMenu) && (
        <TableCell
          className={cn(cellClass(), 'relative z-10 text-right')}
          data-slot="data-table-actions"
        >
          <Disclosure open={!shut} fade className={inner('right')}>
            {o.rowActions?.(row)}
            {o.rowMenu && (
              <RowMenu label={o.rowMenuLabel?.(row) ?? 'Row actions'}>{o.rowMenu(row)}</RowMenu>
            )}
          </Disclosure>
        </TableCell>
      )}
    </TableRow>
  );
};

export interface GroupedBodyProps<T> extends BodyOptions<T> {
  /** `null` renders the rows without group headers. */
  groups: DataTableGroupSlice<T>[] | null;
  rows: T[];
  collapsed: string[];
  onToggleGroup: (key: string) => void;
  columnCount: number;
  groupIcon?: (key: string) => React.ReactNode;
  onAddToGroup?: (key: string) => void;
  addToGroupLabel?: (label: string) => string;
}

/**
 * One flat list of sibling rows with group headers between them: a regroup or a sort moves the
 * existing row nodes instead of re-creating them.
 */
export const DataTableRows = <T,>({
  groups,
  rows,
  collapsed,
  onToggleGroup,
  columnCount,
  groupIcon,
  onAddToGroup,
  addToGroupLabel,
  ...o
}: GroupedBodyProps<T>): React.JSX.Element[] => {
  const keyOf = (row: T, index: number) => (o.rowKey ? o.rowKey(row, index) : String(index));
  const bodyRow = (row: T, i: number, shut: boolean) => {
    const id = keyOf(row, i);
    return <BodyRow key={id} row={row} rowId={id} shut={shut} {...o} />;
  };
  if (!groups) return rows.map((row, i) => bodyRow(row, i, false));
  let index = 0;
  return groups.flatMap((group) => {
    const shut = collapsed.includes(group.key);
    const text = typeof group.label === 'string' ? group.label : group.key;
    const head = (
      <GroupHeadRow
        key={`group:${group.key}`}
        groupKey={group.key}
        columnCount={columnCount}
        expanded={!shut}
        count={group.rows.length}
        icon={groupIcon?.(group.key)}
        onToggle={() => onToggleGroup(group.key)}
        onAdd={onAddToGroup ? () => onAddToGroup(group.key) : undefined}
        addLabel={addToGroupLabel ? addToGroupLabel(text) : `Add to ${text}`}
      >
        {group.label}
      </GroupHeadRow>
    );
    return [head, ...group.rows.map((row) => bodyRow(row, index++, shut))];
  });
};
