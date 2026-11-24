'use client';

import { useEffect } from 'react';

let locks = 0;
let saved = { overflow: '', paddingRight: '' };

const lock = (): void => {
  locks += 1;
  if (locks > 1) return;
  const { body } = document;
  saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  body.style.overflow = 'hidden';
  body.style.paddingRight = `${String(Math.max(0, scrollbarWidth))}px`;
};

const unlock = (): void => {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  document.body.style.overflow = saved.overflow;
  document.body.style.paddingRight = saved.paddingRight;
};

/**
 * Freezes body scroll while `active`, padding out the width the scrollbar leaves behind.
 * Counted, so nested locks apply once and release only when the last one ends, in any order.
 */
export const useScrollLock = (active: boolean): void => {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
};
