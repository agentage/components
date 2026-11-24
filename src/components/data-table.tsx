'use client';

import * as React from 'react';
import { nextSortState } from '../lib/table-sort';
import { useRovingFocus } from '../lib/use-roving-focus';
import { cn } from '../lib/utils';
import { DataTableRows } from './data-table.body';
import { groupRows, hideBelowCss } from './data-table.group';
import { DataTableHeadCell } from './data-table.parts';
import { SELECT_COLUMN_WIDTH, SelectBox, useSelection } from './data-table.selection';
import { sortRows, tableRows, useControlled } from './data-table.state';
import type { DataTableProps } from './data-table.types';
import { TableBody, TableCaption, TableCell, TableHeader, TableRow } from './table';

export type { SortDirection, SortState } from '../lib/table-sort';
export type {
  DataTableDensity,
  DataTableGroup,
  DataTableGroupBy,
  DataTableGroupOrder,
} from './data-table.group';
export { dataTableCellVariants, dataTableHeadVariants } from './data-table.variants';
export type { DataTableColumn, DataTableProps } from './data-table.types';
export type { DataTableSelection } from './data-table.selection';

const ROVING = '[data-slot="data-table-activator"], [data-slot="group-header-toggle"]';

/** Sticky group rows sit under the header: its height is published as `--dt-head`. */
const useHeadOffset = (
  container: React.RefObject<HTMLDivElement | null>,
  head: React.RefObject<HTMLTableSectionElement | null>
) =>
  React.useLayoutEffect(() => {
    const height = head.current?.offsetHeight ?? 0;
    container.current?.style.setProperty('--dt-head', `${String(height)}px`);
  });

/**
 * Column-def driven table over the `Table` primitives: client-side sorting, densities, grouping,
 * container-query column hiding, row links, a row menu, single or multi selection and Up/Down
 * roving focus. Non-goal: virtualization; paginate large sets instead.
 */
export const DataTable = <T,>(props: DataTableProps<T>): React.JSX.Element => {
  const { columns, density = 'dense', sticky = true, showHeader = true } = props;
  const data = tableRows(props);
  const { groupBy, caption, className, ref, selection } = props;
  const [active, setSort] = useControlled(
    props.sort,
    props.defaultSort ?? null,
    props.onSortChange
  );
  const [collapsed, setCollapsed] = useControlled(
    props.collapsedGroups,
    props.defaultCollapsedGroups ?? [],
    props.onCollapsedGroupsChange
  );
  const keyless = selection !== undefined && !props.rowKey;
  React.useEffect(() => {
    if (keyless)
      console.warn('DataTable: `selection` needs `rowKey`; index keys move with the data.');
  }, [keyless]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const headRef = React.useRef<HTMLTableSectionElement>(null);
  const scope = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  useRovingFocus(containerRef, { selector: ROVING, loop: false });
  useHeadOffset(containerRef, headRef);

  const rows = React.useMemo(() => sortRows(data, columns, active), [data, columns, active]);
  const groups = React.useMemo(
    () => (groupBy ? groupRows(rows, groupBy, props.groupOrder, props.emptyGroups) : null),
    [rows, groupBy, props.groupOrder, props.emptyGroups]
  );
  const position = React.useMemo(() => new Map(data.map((row, i) => [row, i])), [data]);
  const keyOf = (row: T): string => {
    const i = position.get(row) ?? 0;
    return props.rowKey ? props.rowKey(row, i) : String(i);
  };
  const shown = groups
    ? groups.filter((g) => !collapsed.includes(g.key)).flatMap((g) => g.rows)
    : rows;
  const order = shown.map(keyOf);
  const sel = useSelection(
    selection,
    order,
    props.selectedKeys,
    props.defaultSelectedKeys,
    props.onSelectedKeysChange
  );
  const multi = selection === 'multi';
  const hasActions = Boolean(props.rowActions || props.rowMenu);
  const columnCount = columns.length + (hasActions ? 1 : 0) + (multi ? 1 : 0);
  const css = hideBelowCss(scope, columns);
  const overflowX = props.overflowX ?? (groupBy ? 'visible' : 'auto');
  const toggleGroup = (key: string): void =>
    setCollapsed((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]));

  return (
    <div
      ref={containerRef}
      className={cn('@container relative w-full', overflowX === 'auto' && 'overflow-auto')}
      data-dt={scope}
      data-slot="data-table-container"
    >
      {css && <style>{css}</style>}
      <table
        ref={ref}
        className={cn(
          'group/table w-full caption-bottom text-ui data-[look=comfortable]:text-sm',
          className
        )}
        data-slot="data-table"
        data-density={density}
        data-look={density === 'default' || density === 'comfortable' ? 'comfortable' : 'dense'}
        data-selection={selection}
      >
        {caption && <TableCaption>{caption}</TableCaption>}
        {showHeader && (
          <TableHeader ref={headRef}>
            <TableRow className="hover:bg-transparent">
              {multi && (
                <DataTableHeadCell density={density} sticky={sticky} width={SELECT_COLUMN_WIDTH}>
                  <SelectBox
                    checked={sel.all}
                    indeterminate={sel.some}
                    label="Select all rows"
                    onToggle={sel.toggleAll}
                  />
                </DataTableHeadCell>
              )}
              {columns.map((column) => (
                <DataTableHeadCell
                  key={column.key}
                  col={column.key}
                  align={column.align}
                  density={density}
                  sticky={sticky}
                  sortable={column.sortable}
                  direction={active?.key === column.key ? active.direction : null}
                  onSort={() => setSort(nextSortState(active, column.key))}
                  width={column.width}
                  className={cn(column.grow && 'w-full max-w-0', column.className)}
                >
                  {column.header}
                </DataTableHeadCell>
              ))}
              {hasActions && (
                <DataTableHeadCell
                  density={density}
                  sticky={sticky}
                  width={density === 'dense' ? '2.8125rem' : '2.5rem'}
                />
              )}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {rows.length === 0 && !(groups && groups.length > 0) ? (
            <TableRow>
              <TableCell colSpan={columnCount} className="p-0" data-slot="data-table-empty">
                {props.empty}
              </TableCell>
            </TableRow>
          ) : (
            <DataTableRows
              columns={columns}
              rowKey={keyOf}
              rowHref={props.rowHref}
              onRowClick={props.onRowClick}
              isRowSelected={props.isRowSelected}
              rowActions={props.rowActions}
              rowMenu={props.rowMenu}
              rowMenuLabel={props.rowMenuLabel}
              rowLabel={props.rowLabel}
              selection={selection ? sel : undefined}
              density={density}
              rowLines={props.rowLines ?? 1}
              groups={groups}
              rows={rows}
              collapsed={collapsed}
              onToggleGroup={toggleGroup}
              columnCount={columnCount}
              groupIcon={props.groupIcon}
              onAddToGroup={props.onAddToGroup}
              addToGroupLabel={props.addToGroupLabel}
            />
          )}
        </TableBody>
      </table>
    </div>
  );
};
