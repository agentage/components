'use client';

import {
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useState,
  type Ref,
} from 'react';
import {
  clampPx,
  collapsedStorageKey,
  readStoredFlag,
  readStoredPx,
  resizableSplitCollapsedVar,
  resizableSplitVar,
  writeStored,
} from '../lib/split-px';
import type { ResizableSplitApi } from './resizable-split.context';

const setRootVar = (name: string, value: string | null): void => {
  if (value === null) document.documentElement.style.removeProperty(name);
  else document.documentElement.style.setProperty(name, value);
};

interface SplitStateOptions {
  storageKey: string;
  init: number;
  min: number;
  max: number;
  collapsible: boolean;
  apiRef?: Ref<ResizableSplitApi>;
}

/** Stored size and collapsed flag, mirrored onto `<html>` CSS variables the grid reads. */
export const useSplitState = ({
  storageKey,
  init,
  min,
  max,
  collapsible,
  apiRef,
}: SplitStateOptions): { api: ResizableSplitApi; set: (px: number) => void } => {
  const name = resizableSplitVar(storageKey);
  const collapsedName = resizableSplitCollapsedVar(storageKey);
  const flagKey = collapsedStorageKey(storageKey);
  const [width, setWidth] = useState(() => clampPx(init, min, max));
  const [collapsed, setCollapsed] = useState(false);

  // Hydration commit, before the first client paint; the prepaint already set the variables.
  useLayoutEffect(() => {
    const stored = readStoredPx(storageKey);
    if (stored !== null) {
      const next = clampPx(stored, min, max);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWidth(next);
      setRootVar(name, `${String(next)}px`);
    }
    if (collapsible && readStoredFlag(flagKey)) {
      setCollapsed(true);
      setRootVar(collapsedName, '0px');
    }
  }, [storageKey, name, collapsedName, flagKey, collapsible, min, max]);

  const applyCollapsed = useCallback(
    (next: boolean): void => {
      if (!collapsible) return;
      setCollapsed(next);
      setRootVar(collapsedName, next ? '0px' : null);
      writeStored(flagKey, next ? '1' : '0');
    },
    [collapsible, collapsedName, flagKey]
  );

  // A split that stops being collapsible shows its pane again.
  const shut = collapsible && collapsed;

  const set = (px: number): void => {
    const next = clampPx(px, min, max);
    if (shut) applyCollapsed(false);
    setWidth(next);
    setRootVar(name, `${String(next)}px`);
    writeStored(storageKey, String(next));
  };

  const api = useMemo<ResizableSplitApi>(
    () => ({
      collapsed: shut,
      width,
      toggle: () => applyCollapsed(!collapsed),
      collapse: () => applyCollapsed(true),
      expand: () => applyCollapsed(false),
    }),
    [shut, collapsed, width, applyCollapsed]
  );
  useImperativeHandle(apiRef, () => api, [api]);

  return { api, set };
};
