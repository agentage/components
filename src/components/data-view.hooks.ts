'use client';

import * as React from 'react';
import {
  useListControls,
  type ListControls,
  type ListControlsState,
} from '../lib/use-list-controls';
import { readPersisted, useRestoring, writePersisted } from '../lib/use-persisted-state';

export interface ControlsSeed {
  views?: string[];
  columns?: { key: string; groupable?: boolean; sortable?: boolean }[];
  defaultGroupBy?: string | null;
  defaultSort?: { key: string; dir: 'asc' | 'desc' } | null;
  state?: ListControlsState;
  onStateChange?: (state: ListControlsState) => void;
  storageKey?: string;
}

type Col = NonNullable<ControlsSeed['columns']>[number];
const known = (cols: Col[], key: string, flag: 'groupable' | 'sortable'): boolean =>
  cols.some((col) => col.key === key && col[flag]);

export const useDataViewControls = (seed: ControlsSeed): ListControls => {
  const [initial] = React.useState(() => ({
    view: seed.views?.[0] ?? 'table',
    groupBy: seed.defaultGroupBy ?? null,
    sort: seed.defaultSort ?? null,
  }));
  const c = useListControls(initial, {
    state: seed.state,
    onStateChange: seed.onStateChange,
    storageKey: seed.storageKey,
  });
  const { groupBy, sort } = c.state;
  const { columns: cols, storageKey } = seed;
  const own = seed.state === undefined;
  // A restored group or sort column that no longer exists falls back to the default.
  React.useLayoutEffect(() => {
    if (!storageKey || !own || !cols?.length) return;
    if (groupBy !== initial.groupBy && groupBy !== null && !known(cols, groupBy, 'groupable'))
      c.setGroupBy(initial.groupBy);
    if (sort && sort.key !== initial.sort?.key && !known(cols, sort.key, 'sortable'))
      c.setSort(initial.sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- checks each restored value once
  }, [groupBy, sort?.key]);
  return c;
};

const isStrings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((s) => typeof s === 'string');

/** Collapsed group keys, kept per Group by column under `<storageKey>.collapsed.<column>`. */
export const useCollapsedGroups = (storageKey: string | undefined, groupBy: string | null) => {
  const key = storageKey && groupBy ? `${storageKey}.collapsed.${groupBy}` : null;
  const [byGroup, setByGroup] = React.useState<Record<string, string[]>>({});
  const [restoring, setRestoring] = useRestoring();
  const known = groupBy !== null && byGroup[groupBy] !== undefined;
  React.useLayoutEffect(() => {
    if (!key || !groupBy || known) return;
    const stored = readPersisted<string[]>(key, [], isStrings);
    if (typeof stored === 'symbol' || stored.length === 0) return;
    // Storage is read after hydration, so server and client render the same first tree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setByGroup((m) => ({ ...m, [groupBy]: stored }));
    setRestoring(true);
  }, [key, groupBy, known, setRestoring]);
  const current = groupBy ? (byGroup[groupBy] ?? []) : [];
  const set = (next: string[]): void => {
    if (!groupBy) return;
    setByGroup((m) => ({ ...m, [groupBy]: next }));
    if (key) writePersisted(key, next);
  };
  return [current, set, restoring] as const;
};
