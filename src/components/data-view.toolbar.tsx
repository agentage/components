'use client';

import * as React from 'react';
import type { ListControls } from '../lib/use-list-controls';
import { cn } from '../lib/utils';
import { Button } from './button';
import {
  columnFlag,
  isShown,
  labelOf,
  SHOW_EMPTY,
  toggleFlag,
  type DataViewColumn,
} from './data-view.config';
import { ResultCount } from './data-view.parts';
import {
  ActiveFilters,
  DisplayMenu,
  FilterMenu,
  ListToolbar,
  ListToolbarEnd,
  ToolbarSearch,
  ToolbarToggle,
  ViewSwitch,
  type ListFilterGroup,
} from './list-toolbar';

const VIEW_OPTIONS = {
  table: { value: 'table', label: 'List view' },
  cards: { value: 'cards', label: 'Cards view' },
  board: { value: 'board', label: 'Board view' },
};

export interface BulkBarProps {
  count: number;
  onClear: () => void;
  children?: React.ReactNode;
  className?: string;
}

/** Takes the place of the result count while rows are selected: "3 selected", actions, Clear. */
export const BulkBar = React.forwardRef<HTMLDivElement, BulkBarProps>(
  ({ count, onClear, children, className }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-none items-center gap-1.5', className)}
      data-slot="data-view-bulk"
      role="group"
      aria-label="Selected rows"
    >
      <span className="text-xs font-semibold tabular-nums text-foreground group-data-[fit-labels]/list-toolbar:sr-only">
        {count} selected
      </span>
      <span
        aria-hidden="true"
        className="hidden text-xs font-semibold tabular-nums text-foreground group-data-[fit-labels]/list-toolbar:inline"
      >
        {count}
      </span>
      {children}
      <Button size="sm" variant="ghost" onClick={onClear}>
        Clear
      </Button>
    </div>
  )
);
BulkBar.displayName = 'BulkBar';

/** One always-mounted polite region, updated once typing settles, so readers hear the result. */
const useSettled = (text: string, ms = 600): string => {
  const [settled, setSettled] = React.useState(text);
  React.useEffect(() => {
    const t = setTimeout(() => setSettled(text), ms);
    return () => clearTimeout(t);
  }, [text, ms]);
  return settled;
};

export interface DataViewToolbarProps<T> {
  c: ListControls;
  columns: DataViewColumn<T>[];
  filters: ListFilterGroup[];
  toggles: { key: string; label: string }[];
  views: string[];
  view: string;
  shown: number;
  total: number;
  selected: T[];
  onClearSelection: () => void;
  bulkActions?: (rows: T[]) => React.ReactNode;
  searchPlaceholder?: string;
  'aria-label'?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/** The DataView control row: search, Filter, chips, then count or bulk bar, toggles, views, Display. */
export const DataViewToolbar = <T,>({
  ref,
  className,
  ...p
}: DataViewToolbarProps<T>): React.JSX.Element => {
  const { c, columns } = p;
  const { state } = c;
  const flags = {
    ...state.flags,
    ...Object.fromEntries(columns.map((col) => [columnFlag(col.key), isShown(col, state.flags)])),
  };
  const status = useSettled(
    p.selected.length > 0
      ? `${String(p.selected.length)} rows selected`
      : p.shown === p.total
        ? `Showing ${String(p.total)} items`
        : `Showing ${String(p.shown)} of ${String(p.total)} items`
  );
  const options = (pick: (col: DataViewColumn<T>) => boolean | undefined) =>
    columns.filter(pick).map((col) => ({ value: col.key, label: labelOf(col) }));
  return (
    <ListToolbar
      ref={ref}
      className={className}
      aria-label={p['aria-label'] ? `${p['aria-label']} controls` : undefined}
    >
      <ToolbarSearch
        value={state.query}
        onValueChange={c.setQuery}
        placeholder={p.searchPlaceholder}
      />
      {p.filters.length > 0 && (
        <FilterMenu
          groups={p.filters}
          value={state.filters}
          onToggle={c.toggleFilter}
          onClear={c.clearFilters}
        />
      )}
      <ActiveFilters groups={p.filters} value={state.filters} onRemove={c.toggleFilter} />
      <ListToolbarEnd>
        <span className="sr-only" aria-live="polite" data-slot="data-view-status">
          {status}
        </span>
        {p.selected.length > 0 ? (
          <BulkBar count={p.selected.length} onClear={p.onClearSelection}>
            {p.bulkActions?.(p.selected)}
          </BulkBar>
        ) : (
          <ResultCount shown={p.shown} total={p.total} />
        )}
        {p.toggles.map((t) => (
          <ToolbarToggle
            key={t.key}
            pressed={state.flags[toggleFlag(t.key)] ?? false}
            onPressedChange={(on) => c.setFlag(toggleFlag(t.key), on)}
          >
            {t.label}
          </ToolbarToggle>
        ))}
        {p.views.length > 1 && (
          <ViewSwitch
            value={p.view}
            onValueChange={c.setView}
            options={p.views.map((v) => VIEW_OPTIONS[v as keyof typeof VIEW_OPTIONS])}
          />
        )}
        <DisplayMenu
          sortOptions={options((col) => col.sortable)}
          sort={state.sort}
          onSortChange={c.setSort}
          groupOptions={options((col) => col.groupable)}
          groupBy={state.groupBy}
          onGroupByChange={c.setGroupBy}
          toggles={[
            ...columns.map((col) => ({ value: columnFlag(col.key), label: labelOf(col) })),
            ...(columns.some((col) => col.groupable)
              ? [{ value: SHOW_EMPTY, label: 'Show empty groups' }]
              : []),
          ]}
          flags={flags}
          onFlagChange={c.setFlag}
        />
      </ListToolbarEnd>
    </ListToolbar>
  );
};
