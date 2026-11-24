'use client';

import { useEffect, useLayoutEffect, type RefObject } from 'react';
import { nextListIndex } from './list-navigation';

export interface RovingFocusOptions {
  /** CSS selector for the items inside the container. */
  selector?: string;
  /** `vertical` keeps Left/Right free (trees, text); `horizontal` keeps Up/Down free (toolbars). */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Wrap from the last item to the first and back. */
  loop?: boolean;
}

const DEFAULT_SELECTOR = '[data-roving-item]';

const itemsOf = (container: HTMLElement | null, selector: string): HTMLElement[] =>
  container
    ? Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.closest('[inert]')
      )
    : [];

const setTabStop = (items: HTMLElement[], stop: HTMLElement | undefined): void => {
  for (const item of items) item.tabIndex = item === stop ? 0 : -1;
};

// The selected item wins over a stale tab stop, so Tab never lands on an old selection.
const pickStop = (items: HTMLElement[]): HTMLElement | undefined =>
  items.find((el) => el.getAttribute('aria-selected') === 'true') ??
  items.find((el) => el.hasAttribute('aria-current')) ??
  items.find((el) => el.getAttribute('tabindex') === '0') ??
  items[0];

const blockedByEdge = (key: string, index: number, count: number): boolean =>
  (index === count - 1 && (key === 'ArrowDown' || key === 'ArrowRight')) ||
  (index === 0 && (key === 'ArrowUp' || key === 'ArrowLeft'));

/** Roving tabindex: one Tab stop, arrows/Home/End move; items are re-read from the DOM each render. */
export const useRovingFocus = (
  containerRef: RefObject<HTMLElement | null>,
  { selector = DEFAULT_SELECTOR, orientation = 'vertical', loop = true }: RovingFocusOptions = {}
): void => {
  useLayoutEffect(() => {
    const items = itemsOf(containerRef.current, selector);
    setTabStop(items, pickStop(items));
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      const items = itemsOf(container, selector);
      const index = items.indexOf(event.target as HTMLElement);
      if (index < 0 || event.defaultPrevented) return;
      if (orientation === 'horizontal' && (event.key === 'ArrowUp' || event.key === 'ArrowDown'))
        return;
      const next = nextListIndex(event.key, index, items.length, orientation !== 'vertical');
      if (next === null) return;
      event.preventDefault();
      if (!loop && blockedByEdge(event.key, index, items.length)) return;
      setTabStop(items, items[next]);
      items[next]?.focus();
    };
    const onFocusIn = (event: FocusEvent): void => {
      const items = itemsOf(container, selector);
      const target = event.target as HTMLElement;
      if (items.includes(target)) setTabStop(items, target);
    };
    container.addEventListener('keydown', onKeyDown);
    container.addEventListener('focusin', onFocusIn);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
      container.removeEventListener('focusin', onFocusIn);
    };
  }, [containerRef, selector, orientation, loop]);
};

/** Re-picks the tab stop after items were hidden or shown without a render. */
export const refreshRovingStop = (container: HTMLElement, selector = DEFAULT_SELECTOR): void => {
  const items = itemsOf(container, selector);
  setTabStop(items, pickStop(items));
};
