'use client';

import * as React from 'react';
import { applyListControls } from '../lib/list-controls';
import { cn } from '../lib/utils';
import { DataTable } from './data-table';
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
  type DataViewColumn,
} from './data-view.config';
import type { DataViewKind, DataViewProps } from './data-view.types';
import { useDataViewState } from './data-view.hooks';
import { BoardView } from './data-view.board';
import { BoardCard } from './data-view.board-card';
import { CardsView, DefaultCard } from './data-view.parts';
import { DataViewToolbar } from './data-view.toolbar';

export type { DataViewColumn, DataViewValue } from './data-view.config';
export type {
  DataViewActions,
  DataViewKind,
  DataViewProps,
  DataViewState,
} from './data-view.types';

const TABLE_ONLY: DataViewKind[] = ['table'];

/** Accessible row name: the card id and title columns, else the first column. */
const labelFor = <T,>(columns: DataViewColumn<T>[]) => {
  const named = ['id', 'title']
    .map((slot) => columns.find((c) => c.cardSlot === slot))
    .filter((c): c is DataViewColumn<T> => c !== undefined);
  const parts = named.length > 0 ? named : columns.slice(0, 1);
  return (row: T) => parts.map((c) => String(valueOf(c, row) ?? '')).join(' ');
};

/**
 * The default list: ListToolbar (search, Filter with counts, chips, toggles, views, Display)
 * over a dense, groupable table, a card grid or a board. Everything comes from the columns.
 */
export const DataView = <T,>(props: DataViewProps<T>): React.JSX.Element => {
  const { rows, columns, getRowId, views = TABLE_ONLY, actions = {} } = props;
  const v = useDataViewState({ ...props, views });
  const { c, state } = v;
  const config = React.useMemo(() => buildConfig(columns), [columns]);
  const result = React.useMemo(() => applyListControls(rows, state, config), [rows, state, config]);
  const filters = React.useMemo(
    () => filterGroups(columns, rows, state, config),
    [columns, rows, state, config]
  );
  const toggles = columns
    .filter((col) => col.filter === 'toggle')
    .map((col) => ({ key: col.key, label: labelOf(col) }));
  const shown = React.useMemo(
    () => columns.filter((col) => isShown(col, state.flags)).map(tableColumn),
    [columns, state.flags]
  );
  const groupCol = columns.find((col) => col.key === state.groupBy);
  const showEmpty = state.flags[SHOW_EMPTY] ?? false;
  const view = views.includes(state.view as DataViewKind) ? state.view : views[0];
  const multi = actions.bulk !== undefined;
  const selection = multi ? 'multi' : actions.open ? 'single' : undefined;
  // Bulk actions act on what the user can see: selected rows hidden by a search stay out.
  const selectedSet = new Set(state.selection);
  const picked = multi ? result.rows.filter((r) => selectedSet.has(getRowId(r))) : [];
  const rowLabel = labelFor(columns);
  const menuLabel = (row: T) => `Actions for ${rowLabel(row)}`;
  const open = actions.open
    ? (row: T) => {
        if (!multi) v.setSelection([getRowId(row)]);
        actions.open?.(row);
      }
    : undefined;
  const card = (row: T, board: boolean) => {
    const menu = actions.menu?.(row);
    const onOpen = open ? () => open(row) : undefined;
    if (board)
      return (
        <BoardCard row={row} columns={shown} {...{ onOpen, menu }} menuLabel={menuLabel(row)} />
      );
    return <DefaultCard row={row} columns={shown} onOpen={onOpen} menu={menu} />;
  };
  const renderCard = props.renderCard ?? ((row: T) => card(row, false));
  const renderBoardCard = props.renderCard ?? ((row: T) => card(row, true));

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col bg-background text-foreground',
        v.restoring && '[&_*]:transition-none!',
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
        onClearSelection={() => v.setSelection([])}
        bulkActions={actions.bulk}
        aria-label={props['aria-label']}
      />
      <div className="min-h-0 flex-1 overflow-auto" data-slot="data-view-body">
        {result.rows.length === 0 && !(showEmpty && groupCol) && view !== 'table' ? (
          props.empty
        ) : view === 'cards' ? (
          <CardsView rows={result.rows} getRowId={getRowId} renderCard={renderCard} />
        ) : view === 'board' ? (
          <BoardView
            rows={result.rows}
            getRowId={getRowId}
            renderCard={renderBoardCard}
            {...boardAxes(
              groupCol,
              columns.find((col) => col.key === state.rowsBy),
              rows,
              result.rows
            )}
            collapsed={state.collapsed}
            onCollapsedChange={v.setCollapsed}
            showEmpty={showEmpty}
            onMove={actions.move}
            onAdd={actions.add}
          />
        ) : (
          <DataTable
            columns={shown}
            rows={result.rows}
            rowLines={shown.some((col) => col.twoLine) ? 2 : 1}
            showHeader={shown.some((col) => col.header !== '' && col.header != null)}
            groupBy={result.groupOf}
            groupOrder={groupCol?.groupOrder}
            emptyGroups={showEmpty ? allGroups(groupCol, rows) : undefined}
            collapsedGroups={state.collapsed}
            onCollapsedGroupsChange={v.setCollapsed}
            groupIcon={groupCol?.valueIcon}
            onAddToGroup={actions.add}
            sort={state.sort ? { key: state.sort.key, direction: state.sort.dir } : null}
            onSortChange={(s) => c.setSort(s ? { key: s.key, dir: s.direction } : null)}
            overflowX="visible"
            rowKey={getRowId}
            rowLabel={rowLabel}
            selection={selection}
            selectedKeys={selection ? state.selection : undefined}
            onSelectedKeysChange={v.setSelection}
            onRowClick={open}
            rowMenu={actions.menu}
            rowMenuLabel={menuLabel}
            empty={props.empty}
          />
        )}
      </div>
    </div>
  );
};
