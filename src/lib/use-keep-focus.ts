'use client';

import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

/** Refocuses an element inside `root` that lost focus only because a commit moved its node. */
export const useKeepFocus = (root: RefObject<HTMLElement | null>): void => {
  const lost = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const onFocusOut = (e: FocusEvent): void => {
      if (e.relatedTarget !== null || !(e.target instanceof HTMLElement)) return;
      lost.current = e.target;
      // Removal blurs inside the commit; anything later is a real blur and is left alone.
      queueMicrotask(() => {
        lost.current = null;
      });
    };
    el.addEventListener('focusout', onFocusOut);
    return () => el.removeEventListener('focusout', onFocusOut);
  }, [root]);
  useLayoutEffect(() => {
    const el = lost.current;
    lost.current = null;
    if (el?.isConnected && root.current?.contains(el) && document.activeElement !== el)
      el.focus({ preventScroll: true });
  });
};
