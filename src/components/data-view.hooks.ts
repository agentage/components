'use client';

import * as React from 'react';
import { EMPTY_LIST_CONTROLS, type ListControlsState } from '../lib/list-controls';
import { readListControls, writeListControls } from '../lib/list-controls-storage';
import { useListControls, type ListControls } from '../lib/use-list-controls';
import { readPersisted, useRestoring, writePersisted } from '../lib/use-persisted-state';
import type { DataViewDefault, DataViewState } from './data-view.types';

export interface StateSeed {
  views: string[];
  columns: { key: string; groupable?: boolean; sortable?: boolean }[];
  state?: Partial<DataViewState>;
  defaultState?: DataViewDefault;
  onStateChange?: (state: DataViewState) => void;
}

const LIST_KEYS = ['query', 'filters', 'view', 'sort', 'groupBy', 'flags'] as const;
const pickList = (s: Partial<DataViewState> = {}): Partial<ListControlsState> =>
  Object.fromEntries(LIST_KEYS.filter((k) => s[k] !== undefined).map((k) => [k, s[k]]));

const NO_IDS: string[] = [];
type Col = StateSeed['columns'][number];
const known = (cols: Col[], key: string, flag: 'groupable' | 'sortable'): boolean =>
  cols.some((col) => col.key === key && col[flag]);

/** Seeds from `defaultState`, then a stored state; a restored column that is gone falls back. */
const useListPart = (seed: StateSeed, report: (list: ListControlsState) => void) => {
  const [initial] = React.useState<ListControlsState>(() => ({
    ...EMPTY_LIST_CONTROLS,
    view: seed.views[0] ?? 'table',
    ...pickList(seed.defaultState),
  }));
  const [inner, setInner] = React.useState(initial);
  const [restoring, setRestoring] = useRestoring();
  const { columns } = seed;
  const storageKey = seed.defaultState?.storageKey;
  React.useLayoutEffect(() => {
    if (!storageKey) return;
    const stored = readListControls(storageKey);
    if (!stored) return;
    const next = { ...initial, ...stored };
    if (next.groupBy !== null && next.groupBy !== initial.groupBy)
      if (!known(columns, next.groupBy, 'groupable')) next.groupBy = initial.groupBy;
    if (next.sort && next.sort.key !== initial.sort?.key)
      if (!known(columns, next.sort.key, 'sortable')) next.sort = initial.sort;
    // Storage is read after hydration, so server and client render the same first tree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInner(next);
    if (next.groupBy !== stored.groupBy || next.sort !== stored.sort)
      writeListControls(storageKey, next);
    setRestoring(true);
    // Restore once per key; later changes write, they never re-read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);
  const own = seed.state ?? {};
  const state = React.useMemo(
    () => ({ ...inner, ...pickList(own) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the controlled keys, not the wrapper
    [inner, own.query, own.filters, own.view, own.sort, own.groupBy, own.flags]
  );
  const c = useListControls(initial, {
    state,
    onStateChange: (next) => {
      setInner(next);
      if (storageKey) writeListControls(storageKey, next);
      report(next);
    },
  });
  return [c, restoring] as const;
};

const isStrings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((s) => typeof s === 'string');

/** Collapsed group keys, kept per Group by column under `<storageKey>.collapsed.<column>`. */
const useCollapsedGroups = (storageKey: string | undefined, groupBy: string | null) => {
  const key = storageKey && groupBy ? `${storageKey}.collapsed.${groupBy}` : null;
  const [byGroup, setByGroup] = React.useState<Record<string, string[]>>({});
  const [restoring, setRestoring] = useRestoring();
  const seen = groupBy !== null && byGroup[groupBy] !== undefined;
  React.useLayoutEffect(() => {
    if (!key || !groupBy || seen) return;
    const stored = readPersisted<string[]>(key, [], isStrings);
    if (typeof stored === 'symbol' || stored.length === 0) return;
    // Storage is read after hydration, so server and client render the same first tree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setByGroup((m) => ({ ...m, [groupBy]: stored }));
    setRestoring(true);
  }, [key, groupBy, seen, setRestoring]);
  const current = groupBy ? (byGroup[groupBy] ?? NO_IDS) : NO_IDS;
  const set = (next: string[]): void => {
    if (!groupBy) return;
    setByGroup((m) => ({ ...m, [groupBy]: next }));
    if (key) writePersisted(key, next);
  };
  return [current, set, restoring] as const;
};

export interface DataViewControls {
  c: ListControls;
  state: DataViewState;
  setSelection: (ids: string[]) => void;
  setCollapsed: (keys: string[]) => void;
  restoring: boolean;
}

/** One state object: each key given in `state` is controlled, the rest is kept here. */
export const useDataViewState = (seed: StateSeed): DataViewControls => {
  const own = seed.state ?? {};
  const [selection, setOwnSelection] = React.useState(seed.defaultState?.selection ?? NO_IDS);
  const latest = React.useRef<DataViewState | null>(null);
  const report = (patch: Partial<DataViewState>) => {
    if (latest.current) seed.onStateChange?.({ ...latest.current, ...patch });
  };
  const [c, listRestoring] = useListPart(seed, (list) => report(list));
  const [collapsedOwn, setCollapsedOwn, collapseRestoring] = useCollapsedGroups(
    seed.defaultState?.storageKey,
    c.state.groupBy
  );
  const sel = own.selection ?? selection;
  const collapsed = own.collapsed ?? collapsedOwn;
  const rowsBy = own.rowsBy !== undefined ? own.rowsBy : (seed.defaultState?.rowsBy ?? null);
  // One stable object per change, so the row and filter memos downstream can hit.
  const state = React.useMemo<DataViewState>(
    () => ({ ...c.state, selection: sel, collapsed, rowsBy }),
    [c.state, sel, collapsed, rowsBy]
  );
  React.useLayoutEffect(() => {
    latest.current = state;
  });
  return {
    c,
    state,
    setSelection: (ids) => {
      setOwnSelection(ids);
      report({ selection: ids });
    },
    setCollapsed: (keys) => {
      setCollapsedOwn(keys);
      report({ collapsed: keys });
    },
    restoring: listRestoring || collapseRestoring,
  };
};
