import type * as React from 'react';
import type { CardFallback, CardState } from './card-state';

/** Whether a rise is good news: drives the trend colour; the arrow always shows the direction. */
export type StatCardSentiment = 'up-is-good' | 'down-is-good' | 'neutral';

export interface StatCardTrend {
  /** The change as shown, for example `+12%`. */
  value: string;
  direction: 'up' | 'down';
  /** `up-is-good` (default) draws a rise green; `down-is-good` draws it red; `neutral` muted. */
  sentiment?: StatCardSentiment;
}

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string;
  value: React.ReactNode;
  /** Change chip at the end of the header. */
  trend?: StatCardTrend;
  /** The one muted line under the value: a description or the earlier figure. */
  hint?: React.ReactNode;
  /** Leading header glyph, for example a StatusGlyph or a 24 px icon tile. */
  icon?: React.ReactNode;
  /** `loading`, `empty` and `error` cover the body at its own height; `stale` badges the card. */
  state?: CardState;
  /** Bodies for those states: loading placeholder, empty line, error with Retry. */
  fallback?: CardFallback;
  /** A bottom row above a 1 px rule; put a `CardMeta` in it for source and last update. */
  footer?: React.ReactNode;
}
