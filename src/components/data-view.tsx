'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { DataTable } from './data-table';
import { useControlled } from './data-table.state';
import {
  allGroups,
  boardAxes,
  buildConfig,
  filterGroups,
  isShown,
  labelOf,
  SHOW_EMPTY,
  tableColumn,
  valueOf,
} from './data-view.config';
import type { DataViewKind, DataViewProps } from './data-view.types';
import { useCollapsedGroups, useDataViewControls } from './data-view.hooks';
import { BoardView } from './data-view.board';
import { BoardCard } from './data-view.board-card';
import { CardsView, DefaultCard } from './data-view.parts';
import { DataViewToolbar } from './data-view.toolbar';

export type { DataViewColumn, DataViewQuickToggle, DataViewValue } from './data-view.config';
export type { DataViewKind, DataViewProps } from './data-view.types';

const TABLE_ONLY: DataViewKind[] = ['table'];
const NO_TOGGLES: never[] = [];
const NO_IDS: string[] = [];

/**
 * The default list: ListToolbar (search, Filter with counts, chips, quick toggles, views,
 * Display) over a dense, groupable DataTable or a card grid. One import, no wiring.
 */
export const DataView = <T,>(props: DataViewProps<T>): React.JSX.Element => {
  const { rows, columns, getRowId, views = TABLE_ONLY, quickToggles = NO_TOGGLES } = props;
  const c = useDataViewControls(props);
  const { state } = c;
  const config = React.useMemo(
    () => buildConfig(columns, props.searchKeys, quickToggles),
    [columns, props.searchKeys, quickToggles]
  );
  const [collapsed, setCollapsed, collapseRestoring] = useCollapsedGroups(
    props.storageKey,
    state.groupBy
  );
  const [selectedIds, setSelectedIds] = useControlled(
    props.selectedIds,
    props.defaultSelectedIds ?? NO_IDS,
    props.onSelectionChange
  );
  const { apply } = c;
  const result = React.useMemo(() => apply(rows, config), [apply, rows, config]);
  const filters = React.useMemo(
    () => filterGroups(columns, rows, state, config),
    [columns, rows, state, config]
  );
  const toggles = [
    ...columns
      .filter((col) => col.filter === 'toggle')
      .map((col) => ({ key: col.key, label: labelOf(col) })),
    ...quickToggles,
  ];
  const shown = React.useMemo(
    () => columns.filter((col) => isShown(col, state.flags)).map(tableColumn),
    [columns, state.flags]
  );
  const groupCol = columns.find((col) => col.key === state.groupBy);
  const showEmpty = state.flags[SHOW_EMPTY] ?? false;
  const view = views.includes(state.view as DataViewKind) ? state.view : views[0];
  const open = props.onRowOpen;
  const multi = props.selection === 'multi';
  // Bulk actions act on what the user can see: selected rows hidden by a search stay out.
  const selectedSet = new Set(selectedIds);
  const picked = multi ? result.rows.filter((r) => selectedSet.has(getRowId(r))) : [];
  const first = columns[0];
  const rowLabel =
    props.rowLabel ?? (first ? (row: T) => String(valueOf(first, row) ?? '') : undefined);
  const card = (row: T, board: boolean) => {
    const menu = props.rowMenu?.(row);
    const onOpen = open ? () => open(row) : undefined;
    if (board) {
      const menuLabel = props.rowMenuLabel?.(row);
      return <BoardCard row={row} columns={shown} {...{ onOpen, menu, menuLabel }} />;
    }
    return <DefaultCard row={row} columns={shown} onOpen={onOpen} menu={menu} />;
  };
  const renderCard = props.renderCard ?? ((row: T) => card(row, false));
  const renderBoardCard = props.renderCard ?? ((row: T) => card(row, true));
  const restoring = c.restoring || collapseRestoring;

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col bg-background text-foreground',
        restoring && '[&_*]:transition-none!',
        props.className
      )}
      data-slot="data-view"
    >
      <DataViewToolbar
        c={c}
        columns={columns}
        filters={filters}
        toggles={toggles}
        views={views}
        view={view}
        shown={result.rows.length}
        total={rows.length}
        selected={picked}
        onClearSelection={() => setSelectedIds([])}
        bulkActions={props.bulkActions}
        searchPlaceholder={props.searchPlaceholder}
        aria-label={props['aria-label']}
      />
      <div className="min-h-0 flex-1 overflow-auto" data-slot="data-view-body">
        {result.rows.length === 0 && !(showEmpty && groupCol) && view !== 'table' ? (
          props.emptyState
        ) : view === 'cards' ? (
          <CardsView rows={result.rows} getRowId={getRowId} renderCard={renderCard} />
        ) : view === 'board' ? (
          <BoardView
            rows={result.rows}
            getRowId={getRowId}
            renderCard={renderBoardCard}
            {...boardAxes(
              groupCol,
              columns.find((col) => col.key === props.rowsBy),
              rows,
              result.rows
            )}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            showEmpty={showEmpty}
            onMove={props.onMove}
            onAdd={props.onAddToGroup}
          />
        ) : (
          <DataTable
            columns={shown}
            rows={result.rows}
            rowLines={props.rowLines}
            showHeader={props.showHeader}
            groupBy={result.groupOf}
            groupOrder={groupCol?.groupOrder}
            emptyGroups={showEmpty ? allGroups(groupCol, rows) : undefined}
            collapsedGroups={collapsed}
            onCollapsedGroupsChange={setCollapsed}
            groupIcon={groupCol?.valueIcon}
            onAddToGroup={props.onAddToGroup}
            sort={state.sort ? { key: state.sort.key, direction: state.sort.dir } : null}
            onSortChange={(s) => c.setSort(s ? { key: s.key, dir: s.direction } : null)}
            overflowX="visible"
            rowKey={getRowId}
            rowLabel={rowLabel}
            selection={props.selection}
            selectedKeys={props.selection ? selectedIds : undefined}
            onSelectedKeysChange={setSelectedIds}
            onRowClick={open}
            isRowSelected={props.isRowSelected}
            rowActions={props.rowActions}
            rowMenu={props.rowMenu}
            rowMenuLabel={props.rowMenuLabel}
            empty={props.emptyState}
          />
        )}
      </div>
    </div>
  );
};
