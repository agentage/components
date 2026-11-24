'use client';

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  applyListControls,
  EMPTY_LIST_CONTROLS,
  type ListApplyConfig,
  type ListControlsState,
  type ListSort,
} from './list-controls';
import { readListControls, writeListControls } from './list-controls-storage';
import { useRestoring } from './use-persisted-state';

export * from './list-controls';

export interface ListControlsOptions {
  /** Controlled state; the hook then only reports changes through `onStateChange`. */
  state?: ListControlsState;
  onStateChange?: (state: ListControlsState) => void;
  /**
   * Keeps the state (without the search query) in localStorage. The server and the hydration
   * render use `initial`; a valid stored state applies in a layout effect after hydration, so
   * the server HTML shows `initial` until the bundle runs. Pass `state` to avoid that.
   */
  storageKey?: string;
}

const useMaybeControlled = (initial: Partial<ListControlsState>, options: ListControlsOptions) => {
  const [inner, setInner] = useState<ListControlsState>(() => ({
    ...EMPTY_LIST_CONTROLS,
    ...initial,
  }));
  const state = options.state ?? inner;
  // Setters read the latest state through a ref, so chained calls in one tick compose.
  const latest = useRef(state);
  const onChange = useRef(options.onStateChange);
  const [restoring, setRestoring] = useRestoring();
  const { storageKey } = options;
  const controlled = options.state !== undefined;
  useLayoutEffect(() => {
    latest.current = state;
    onChange.current = options.onStateChange;
  });
  useLayoutEffect(() => {
    if (!storageKey || controlled) return;
    const stored = readListControls(storageKey);
    if (!stored) return;
    const value = { ...latest.current, ...stored };
    latest.current = value;
    setInner(value);
    setRestoring(true);
    // Restore once per key; later control changes write, they never re-read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);
  const setState = useCallback(
    (next: ListControlsState | ((s: ListControlsState) => ListControlsState)) => {
      const value = typeof next === 'function' ? next(latest.current) : next;
      latest.current = value;
      setInner(value);
      if (storageKey) writeListControls(storageKey, value);
      onChange.current?.(value);
    },
    [storageKey]
  );
  return [state, setState, restoring] as const;
};

export const useListControls = (
  initial: Partial<ListControlsState> = {},
  options: ListControlsOptions = {}
) => {
  const [state, setState, restoring] = useMaybeControlled(initial, options);
  const patch = useCallback(
    (next: Partial<ListControlsState>) => {
      setState((s) => ({ ...s, ...next }));
    },
    [setState]
  );

  const setters = useMemo(
    () => ({
      setQuery: (query: string) => patch({ query }),
      setView: (view: string) => patch({ view }),
      setSort: (sort: ListSort | null) => patch({ sort }),
      setGroupBy: (groupBy: string | null) => patch({ groupBy }),
      setFlag: (flag: string, on: boolean) =>
        setState((s) => ({ ...s, flags: { ...s.flags, [flag]: on } })),
      toggleFilter: (group: string, value: string) =>
        setState((s) => {
          const current = s.filters[group] ?? [];
          const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
          return { ...s, filters: { ...s.filters, [group]: next } };
        }),
      clearFilters: () => patch({ filters: {} }),
      reset: () => setState({ ...EMPTY_LIST_CONTROLS, ...initial }),
    }),
    // `initial` is a seed, like useState's argument.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [patch, setState]
  );

  const apply = useCallback(
    <T>(rows: T[], config: ListApplyConfig<T>) => applyListControls(rows, state, config),
    [state]
  );

  /** `restoring` is true while a stored state replaces the initial one; skip animations then. */
  return { state, restoring, ...setters, apply };
};

export type ListControls = ReturnType<typeof useListControls>;
