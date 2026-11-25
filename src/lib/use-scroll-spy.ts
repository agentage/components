'use client';

import { useEffect, useState, type RefObject } from 'react';

export interface ScrollSpyOptions {
  /** The scrolling container. Defaults to the window. */
  root?: RefObject<HTMLElement | null>;
  /** Distance in px below the container top at which a section counts as current. */
  offset?: number;
}

const atBottom = (root: HTMLElement | null): boolean => {
  if (root) return root.scrollTop + root.clientHeight >= root.scrollHeight - 4;
  const doc = document.documentElement;
  return window.scrollY + window.innerHeight >= doc.scrollHeight - 4;
};

/** The last section whose top has crossed the line; the bottom of the scroll snaps to the last. */
export const activeSection = (
  ids: readonly string[],
  root: HTMLElement | null,
  offset: number
): string | undefined => {
  if (ids.length === 0) return undefined;
  if (atBottom(root) && (root ? root.scrollTop : window.scrollY) > 0) return ids[ids.length - 1];
  const line = (root ? root.getBoundingClientRect().top : 0) + offset;
  let current = ids[0];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) current = id;
  }
  return current;
};

/** Tracks which of `ids` is currently in view inside `root` (or the window). */
export const useScrollSpy = (
  ids: readonly string[],
  { root, offset = 48 }: ScrollSpyOptions = {}
): string | undefined => {
  const [active, setActive] = useState<string | undefined>(ids[0]);
  const key = ids.join('\n');

  useEffect(() => {
    const list = key ? key.split('\n') : [];
    const target: HTMLElement | Window = root?.current ?? window;
    const measure = (): void => {
      frame = 0;
      setActive(activeSection(list, root?.current ?? null, offset));
    };
    // One layout read per frame, however many scroll events arrive.
    let frame = 0;
    const update = (): void => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    target.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      target.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [key, root, offset]);

  return active;
};
