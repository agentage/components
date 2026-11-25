'use client';

import * as React from 'react';

/** Type guard for a stored value; anything it rejects falls back to the initial value. */
export type PersistedCheck<T> = (value: unknown) => value is T;

const MISSING = Symbol('missing');

const sameKind = (a: unknown, b: unknown): boolean =>
  b === null ||
  b === undefined ||
  (typeof a === typeof b && a !== null && Array.isArray(a) === Array.isArray(b));

/** Stored value under `key`, or `MISSING` when absent, unreadable, corrupt or of the wrong shape. */
export const readPersisted = <T>(
  key: string,
  initial: T,
  check?: PersistedCheck<T>
): T | typeof MISSING => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return MISSING;
    const value: unknown = JSON.parse(raw);
    const ok = check ? check(value) : sameKind(value, initial);
    return ok ? (value as T) : MISSING;
  } catch {
    return MISSING;
  }
};

export const writePersisted = (key: string | undefined, value: unknown): void => {
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked or full: the state still works for this page.
  }
};

/**
 * True for the frames in which a stored value replaces the initial one, so animated bodies can
 * skip their transition; cleared after two frames.
 */
export const useRestoring = () => {
  const [restoring, setRestoring] = React.useState(false);
  React.useEffect(() => {
    if (!restoring) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setRestoring(false));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [restoring]);
  return [restoring, setRestoring] as const;
};

/**
 * State mirrored to localStorage under `storageKey`; without a key it is plain state. The server
 * and the hydration render use `initial`; the stored value applies in the hydration commit, before
 * the first client paint (server HTML shows `initial` until the bundle runs: pass a cookie value
 * as `initial` to avoid that). Returns `[value, set, restoring]`.
 */
export const usePersistedState = <T>(
  storageKey: string | undefined,
  initial: T,
  check?: PersistedCheck<T>
) => {
  const [value, setValue] = React.useState<T>(initial);
  const [restoring, setRestoring] = useRestoring();
  const seed = React.useRef({ initial, check });
  React.useLayoutEffect(() => {
    if (!storageKey) return;
    const load = (first: boolean): void => {
      const stored = readPersisted(storageKey, seed.current.initial, seed.current.check);
      const next = stored === MISSING ? seed.current.initial : stored;
      setValue(next);
      if (first && stored !== MISSING) setRestoring(true);
    };
    load(true);
    const onStorage = (e: StorageEvent): void => {
      if (e.key === storageKey) load(false);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [storageKey, setRestoring]);
  const set = React.useCallback(
    (next: T): void => {
      setValue(next);
      writePersisted(storageKey, next);
    },
    [storageKey]
  );
  return [value, set, restoring] as const;
};
