'use client';

import { useCallback, useEffect } from 'react';

export type AnnouncePoliteness = 'polite' | 'assertive';

const REGION_ATTR = 'data-ds-announcer';
// Screen readers skip a region whose text is replaced in the same tick, so clear first.
const ANNOUNCE_DELAY_MS = 30;

const VISUALLY_HIDDEN =
  'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0';

const regionFor = (politeness: AnnouncePoliteness): HTMLElement => {
  const existing = document.querySelector<HTMLElement>(`[${REGION_ATTR}="${politeness}"]`);
  if (existing) return existing;
  const region = document.createElement('div');
  region.setAttribute(REGION_ATTR, politeness);
  region.setAttribute('aria-live', politeness);
  region.setAttribute('aria-atomic', 'true');
  region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  region.style.cssText = VISUALLY_HIDDEN;
  document.body.appendChild(region);
  return region;
};

/** Writes `message` into a shared, visually hidden live region. */
export const announce = (message: string, politeness: AnnouncePoliteness = 'polite'): void => {
  if (typeof document === 'undefined') return;
  const region = regionFor(politeness);
  region.textContent = '';
  setTimeout(() => {
    region.textContent = message;
  }, ANNOUNCE_DELAY_MS);
};

/** Stable `announce(message, politeness?)`; one shared region per politeness, page-wide. */
export const useAnnounce = (
  defaultPoliteness: AnnouncePoliteness = 'polite'
): ((message: string, politeness?: AnnouncePoliteness) => void) => {
  // Mounted ahead of the first message: text in a region inserted that same moment is often dropped.
  useEffect(() => {
    regionFor('polite');
    regionFor('assertive');
  }, []);

  return useCallback(
    (message: string, politeness?: AnnouncePoliteness) => {
      announce(message, politeness ?? defaultPoliteness);
    },
    [defaultPoliteness]
  );
};
