import type * as React from 'react';
import type { DragMove } from '../lib/use-drag-reorder';
import type { ListControlsState } from '../lib/list-controls';
import type { DataViewColumn, DataViewQuickToggle } from './data-view.config';

export type DataViewKind = 'table' | 'cards' | 'board';

export interface DataViewProps<T> {
  rows: T[];
  columns: DataViewColumn<T>[];
  getRowId: (row: T) => string;
  /** Column keys the search box matches; all columns by default. */
  searchKeys?: string[];
  searchPlaceholder?: string;
  views?: DataViewKind[];
  /** Card of the cards and board views; by default an EntityCard and a compact board card. */
  renderCard?: (row: T) => React.ReactNode;
  defaultGroupBy?: string | null;
  defaultSort?: { key: string; dir: 'asc' | 'desc' } | null;
  quickToggles?: DataViewQuickToggle<T>[];
  /** Controlled control state; pair with `onStateChange`. */
  state?: ListControlsState;
  onStateChange?: (state: ListControlsState) => void;
  /** Uncontrolled: persist the control state and the collapsed groups in localStorage. */
  storageKey?: string;
  rowActions?: (row: T) => React.ReactNode;
  /** DropdownMenu items of the 24 px row menu (also on cards). */
  rowMenu?: (row: T) => React.ReactNode;
  rowMenuLabel?: (row: T) => string;
  /** Accessible name of a row for its select checkbox; the first column value by default. */
  rowLabel?: (row: T) => string;
  onRowOpen?: (row: T) => void;
  isRowSelected?: (row: T) => boolean;
  /** `single`: the opened row stays current. `multi`: checkboxes, select all, Shift ranges. */
  selection?: 'single' | 'multi';
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Buttons of the bulk bar that replaces the result count while rows are selected. */
  bulkActions?: (rows: T[]) => React.ReactNode;
  /** Shows a "+" in each group header. */
  onAddToGroup?: (groupKey: string) => void;
  /** Board: drag and Alt + arrow moves report here; the view never changes `rows` itself. */
  onMove?: (move: DragMove) => void;
  /** Board: swimlanes by this column key. */
  rowsBy?: string | null;
  rowLines?: 1 | 2;
  emptyState?: React.ReactNode;
  /** Shows the table header row; a grouped list can hide it. */
  showHeader?: boolean;
  'aria-label'?: string;
  className?: string;
}
