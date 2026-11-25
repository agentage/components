import type * as React from 'react';
import type { DragMove } from '../lib/use-drag-reorder';
import type { ListControlsState } from '../lib/list-controls';
import type { DataViewColumn } from './data-view.config';

export type DataViewKind = 'table' | 'cards' | 'board';

/** Everything a user can change in a DataView, as one object. */
export interface DataViewState extends ListControlsState {
  /** Selected row ids (`multi`), or the current row (`single`). */
  selection: string[];
  /** Collapsed group keys of the current Group by column. */
  collapsed: string[];
  /** Board: swimlanes by this column key. */
  rowsBy: string | null;
}

/** What the user can do with rows. Each one is optional. */
export interface DataViewActions<T> {
  /** Click or Enter on a row or card. The opened row stays current unless `bulk` is set. */
  open?: (row: T) => void;
  /** DropdownMenu items of the 24 px row menu (also on cards). */
  menu?: (row: T) => React.ReactNode;
  /** Buttons of the bulk bar; setting it adds checkboxes, select all and Shift ranges. */
  bulk?: (rows: T[]) => React.ReactNode;
  /** Shows a "+" in each group header. */
  add?: (groupKey: string) => void;
  /** Board: drag and Alt + arrow moves report here; the view never changes `rows` itself. */
  move?: (move: DragMove) => void;
}

export interface DataViewProps<T> {
  rows: T[];
  /** Columns carry the filter, sort, group, search and visibility options. */
  columns: DataViewColumn<T>[];
  getRowId: (row: T) => string;
  /** Default `['table']`; more than one adds a view switch. */
  views?: DataViewKind[];
  /** Controlled keys of the state; keys left out stay internal. */
  state?: Partial<DataViewState>;
  /** Reports the whole state after every change. */
  onStateChange?: (state: DataViewState) => void;
  /** Start state of the uncontrolled keys, for example `{ groupBy: 'status' }`. */
  defaultState?: Partial<DataViewState>;
  /** Persist the controls and the collapsed groups in localStorage under this key. */
  storageKey?: string;
  actions?: DataViewActions<T>;
  /** Card of the cards and board views; an item card built from the columns by default. */
  renderCard?: (row: T) => React.ReactNode;
  /** Shown when no row matches. */
  empty?: React.ReactNode;
  'aria-label'?: string;
  className?: string;
}
