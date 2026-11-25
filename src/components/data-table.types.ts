import type * as React from 'react';
import type { SortableValue, SortState } from '../lib/table-sort';
import type { DataTableGroup, DataTableGroupBy, DataTableGroupOrder } from './data-table.group';
import type { DataTableSelection } from './data-table.selection';

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  nowrap?: boolean;
  width?: number | string;
  cell?: (row: T) => React.ReactNode;
  /** Sort key when the displayed cell is not what you sort on. */
  sortValue?: (row: T) => SortableValue;
  /** Full comparator; wins over `sortValue`. */
  compare?: (a: T, b: T) => number;
  /** Hide the column when the table is narrower than this many px (container query). */
  hideBelow?: number;
  /** Extra classes on the header and body cells. */
  className?: string;
  /** Takes the free width and truncates its content (one per table, for example a title). */
  grow?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows?: T[];
  /** 2 gives the 52 px two-line row (name over a muted description); dense only. */
  rowLines?: 1 | 2;
  /** Pin the header row while the container scrolls. */
  sticky?: boolean;
  showHeader?: boolean;
  /** `visible` lets the header and group rows stick to a page or pane scroller. */
  overflowX?: 'auto' | 'visible';
  /** Controlled sort; omit for the internal state seeded by `defaultSort`. */
  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  /** Sticky, collapsible group headers with a count; rows keep the current sort inside a group. */
  groupBy?: DataTableGroupBy<T> | null;
  groupOrder?: DataTableGroupOrder;
  /** Show these groups even when empty (header with a 0 count), for "Show empty groups". */
  emptyGroups?: DataTableGroup[];
  collapsedGroups?: string[];
  onCollapsedGroupsChange?: (keys: string[]) => void;
  rowKey?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  isRowSelected?: (row: T) => boolean;
  rowActions?: (row: T) => React.ReactNode;
  /** Items of a 24 px row menu (DropdownMenuItem and friends). */
  rowMenu?: (row: T) => React.ReactNode;
  rowMenuLabel?: (row: T) => string;
  /** Accessible name of a row, used by its select checkbox ("Select <name>"). */
  rowLabel?: (row: T) => string;
  /**
   * `single`: a click makes the row current (accent tint, 2 px bar, `aria-current`).
   * `multi`: a 13 px checkbox column, select all with a mixed state, Shift-click ranges.
   * Both need `rowKey`.
   */
  selection?: DataTableSelection;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectedKeysChange?: (keys: string[]) => void;
  /** Leading glyph in a group header, by group key. */
  groupIcon?: (key: string) => React.ReactNode;
  /** Shows a "+" in each group header. */
  onAddToGroup?: (key: string) => void;
  empty?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLTableElement>;
}
