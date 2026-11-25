'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';

const reduced = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * FLIP: after every render, items matched by `selector` that moved slide from their old place
 * to the new one. Items keep their DOM nodes, so only a transform animates; reduced motion skips it.
 * With `signature` (for example the joined item order) it measures only when that changes.
 */
export const useFlip = (
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  keyAttr: string,
  durationMs = 180,
  signature?: string
): void => {
  const last = useRef(new Map<string, { x: number; y: number }>());
  const seen = useRef<string | undefined>(undefined);
  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root || (signature !== undefined && signature === seen.current)) return;
    seen.current = signature;
    const next = new Map<string, { x: number; y: number }>();
    const skip = reduced();
    // Relative to the container, so scrolling the page never reads as a move.
    const origin = root.getBoundingClientRect();
    for (const el of root.querySelectorAll<HTMLElement>(selector)) {
      const key = el.getAttribute(keyAttr);
      if (!key) continue;
      const rect = el.getBoundingClientRect();
      const at = { x: rect.left - origin.left, y: rect.top - origin.top };
      next.set(key, at);
      const prev = last.current.get(key);
      const dx = prev ? prev.x - at.x : 0;
      const dy = prev ? prev.y - at.y : 0;
      if (skip || (!dx && !dy) || typeof el.animate !== 'function' || !rect.width) continue;
      el.animate(
        [{ transform: `translate(${String(dx)}px, ${String(dy)}px)` }, { transform: 'none' }],
        { duration: durationMs, easing: 'ease-out' }
      );
    }
    last.current = next;
  });
};
