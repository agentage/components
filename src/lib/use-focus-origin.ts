'use client';

import * as React from 'react';

/**
 * Remembers where focus came from when it entered `ref`; when `open` turns false while focus is
 * still inside, focus goes back there instead of falling to body.
 */
export const useFocusOrigin = <T extends HTMLElement>(
  open: boolean,
  ref: React.RefObject<T | null>
): { onFocus: (e: React.FocusEvent) => void } => {
  const origin = React.useRef<HTMLElement | null>(null);
  React.useLayoutEffect(() => {
    if (open) return;
    const active = document.activeElement;
    if (!active || !ref.current?.contains(active)) return;
    if (origin.current?.isConnected) origin.current.focus({ preventScroll: true });
  }, [open, ref]);
  const onFocus = React.useCallback(
    (e: React.FocusEvent) => {
      const from = e.relatedTarget as HTMLElement | null;
      if (from && !ref.current?.contains(from)) origin.current = from;
    },
    [ref]
  );
  return { onFocus };
};
