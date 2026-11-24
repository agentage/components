import { compareValues, type SortableValue } from './table-sort';

export interface ListSort {
  key: string;
  dir: 'asc' | 'desc';
}

/** One plain object drives a list toolbar: search, filters, view, sort, group and flags. */
export interface ListControlsState {
  query: string;
  filters: Record<string, string[]>;
  view: string;
  sort: ListSort | null;
  groupBy: string | null;
  flags: Record<string, boolean>;
}

export interface ListGroup {
  key: string;
  label: string;
}

export interface ListApplyConfig<T> {
  /** Text the query matches against (case-insensitive substring). */
  search?: (row: T) => string;
  /** Filter group id to the value(s) a row has; a row passes a group when any selected value matches. */
  filters?: Record<string, (row: T) => string | string[]>;
  /** A row passes an on flag only when the predicate is true. */
  flags?: Record<string, (row: T) => boolean>;
  /** Sort key to a value accessor or a comparator of two rows. */
  sorts?: Record<string, ((row: T) => SortableValue) | { compare: (a: T, b: T) => number }>;
  /** Group key to the group of a row. */
  groups?: Record<string, (row: T) => ListGroup>;
  /** Explicit group order per group key; unknown groups follow in first-seen order. */
  groupOrder?: Record<string, string[]>;
}

export interface ListApplyResult<T> {
  rows: T[];
  /** Null when `groupBy` is unset or unknown. */
  groups: (ListGroup & { rows: T[] })[] | null;
  /** The active group accessor, for a DataTable `groupBy`. */
  groupOf: ((row: T) => ListGroup) | null;
}

export const EMPTY_LIST_CONTROLS: ListControlsState = {
  query: '',
  filters: {},
  view: 'list',
  sort: null,
  groupBy: null,
  flags: {},
};

const asList = (v: string | string[]): string[] => (Array.isArray(v) ? v : [v]);

const passes = <T>(row: T, state: ListControlsState, config: ListApplyConfig<T>): boolean => {
  const q = state.query.trim().toLowerCase();
  if (q && config.search && !config.search(row).toLowerCase().includes(q)) return false;
  for (const [group, selected] of Object.entries(state.filters)) {
    const of = config.filters?.[group];
    if (of && selected.length > 0 && !asList(of(row)).some((v) => selected.includes(v)))
      return false;
  }
  return Object.entries(state.flags).every(
    ([flag, on]) => !on || config.flags?.[flag]?.(row) !== false
  );
};

const comparator = <T>(state: ListControlsState, config: ListApplyConfig<T>) => {
  const sorter = state.sort && config.sorts?.[state.sort.key];
  if (!state.sort || !sorter) return null;
  const { dir } = state.sort;
  const sign = dir === 'asc' ? 1 : -1;
  if (typeof sorter !== 'function') return (a: T, b: T) => sign * sorter.compare(a, b);
  return (a: T, b: T) => compareValues(sorter(a), sorter(b), dir);
};

const groupList = <T>(rows: T[], of: (row: T) => ListGroup, order?: string[]) => {
  const map = new Map<string, ListGroup & { rows: T[] }>();
  for (const row of rows) {
    const g = of(row);
    const slot = map.get(g.key);
    if (slot) slot.rows.push(row);
    else map.set(g.key, { ...g, rows: [row] });
  }
  const groups = [...map.values()];
  if (!order) return groups;
  const rank = (k: string) => (order.includes(k) ? order.indexOf(k) : order.length);
  return groups.sort((a, b) => rank(a.key) - rank(b.key));
};

/** Filter, then sort (stable), then group. Pure: safe to call during render. */
export const applyListControls = <T>(
  rows: T[],
  state: ListControlsState,
  config: ListApplyConfig<T>
): ListApplyResult<T> => {
  const kept = rows.filter((row) => passes(row, state, config));
  const compare = comparator(state, config);
  const sorted = compare ? [...kept].sort(compare) : kept;
  const groupOf = (state.groupBy && config.groups?.[state.groupBy]) || null;
  const order = state.groupBy ? config.groupOrder?.[state.groupBy] : undefined;
  return {
    rows: sorted,
    groups: groupOf ? groupList(sorted, groupOf, order) : null,
    groupOf,
  };
};

/** Total of selected filter values across groups, for the Filter button count. */
export const activeFilterCount = (filters: Record<string, string[]>): number =>
  Object.values(filters).reduce((n, values) => n + values.length, 0);
