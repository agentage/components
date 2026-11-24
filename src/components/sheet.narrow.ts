'use client';

import * as React from 'react';

const QUERY = '(max-width: 760px)';

const subscribe = (notify: () => void): (() => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const list = window.matchMedia(QUERY);
  list.addEventListener('change', notify);
  return () => list.removeEventListener('change', notify);
};

const snapshot = (): boolean =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(QUERY).matches;

/** True below 760 px, where the panel covers the screen; false on the server. */
export const useNarrowScreen = (): boolean =>
  React.useSyncExternalStore(subscribe, snapshot, () => false);
