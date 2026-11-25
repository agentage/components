'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';

const ITEM = '[data-stack-cell]';

/**
 * Items that share one grid cell (same `data-stack-cell`) stack in DOM order through their top
 * margin, so each column keeps its own card heights while every card stays a child of one grid.
 * Runs before paint and again when an item resizes.
 */
export const useCellStack = (
  rootRef: RefObject<HTMLElement | null>,
  gap: number,
  inset: number
): void => {
  const observer = useRef<ResizeObserver | null>(null);
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const place = (): void => {
      const items = Array.from(root.querySelectorAll<HTMLElement>(ITEM));
      // All reads first, then all writes: one layout pass, no thrash.
      const heights = items.map((el) => el.offsetHeight);
      const tops = new Map<string, number>();
      items.forEach((el, i) => {
        const cell = el.dataset.stackCell ?? '';
        const top = tops.get(cell) ?? inset;
        if (el.style.marginTop !== `${String(top)}px`) el.style.marginTop = `${String(top)}px`;
        tops.set(cell, top + (heights[i] ?? 0) + (heights[i] ? gap : 0));
      });
    };
    place();
    if (typeof ResizeObserver === 'undefined') return;
    observer.current ??= new ResizeObserver(() => place());
    for (const el of root.querySelectorAll<HTMLElement>(ITEM)) observer.current.observe(el);
    return () => observer.current?.disconnect();
  });
};
