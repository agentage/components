'use client';

import * as React from 'react';
import { usePersistedState, type PersistedCheck } from './use-persisted-state';

/**
 * Controlled when `value` is defined, otherwise local state seeded with `initial`;
 * with `storageKey` the local state is also kept in localStorage (see usePersistedState).
 * The setter takes a value or an updater; updaters in one tick compose.
 */
export const useControlled = <V>(
  value: V | undefined,
  initial: V,
  onChange?: (v: V) => void,
  storageKey?: string,
  check?: PersistedCheck<V>
) => {
  const [inner, setInner, restoring] = usePersistedState(storageKey, initial, check);
  const current = value === undefined ? inner : value;
  const latest = React.useRef(current);
  React.useLayoutEffect(() => {
    latest.current = current;
  });
  const set = React.useCallback(
    (next: V | ((prev: V) => V)): void => {
      const resolved = typeof next === 'function' ? (next as (prev: V) => V)(latest.current) : next;
      latest.current = resolved;
      if (value === undefined) setInner(resolved);
      onChange?.(resolved);
    },
    [value, setInner, onChange]
  );
  return [current, set, restoring] as const;
};
