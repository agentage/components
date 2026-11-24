import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

// `up`/`down` are direction aliases kept for compat; the rest is the canonical status vocabulary.
export const TREND_TONE = {
  up: 'text-success',
  down: 'text-destructive',
  default: 'text-muted-foreground',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  info: 'text-info',
} as const;

export type TrendTone = keyof typeof TREND_TONE;

export const statCardTrendVariants = cva(
  'flex items-center gap-1 rounded-md px-2 py-1 text-2xs font-medium border border-border bg-muted/30',
  {
    variants: { tone: TREND_TONE },
    defaultVariants: { tone: 'up' },
  }
);

/** Whether a rise is good news: drives the trend colour; the arrow always shows the direction. */
export type StatCardSentiment = 'up-is-good' | 'down-is-good' | 'neutral';

export interface StatCardTrend {
  value: string;
  up: boolean;
  /** Overrides the colour derived from `up` and `sentiment`. */
  tone?: TrendTone;
  /** `up-is-good` (default) draws a rise green; `down-is-good` draws it red; `neutral` muted. */
  sentiment?: StatCardSentiment;
}

/** The tone of a change: `tone` wins, then direction read through the sentiment. */
export const trendTone = (
  up: boolean,
  sentiment: StatCardSentiment = 'up-is-good',
  tone?: TrendTone
): TrendTone => {
  if (tone) return tone;
  if (sentiment === 'neutral') return 'default';
  return up === (sentiment === 'up-is-good') ? 'up' : 'down';
};

export const statCardVariants = cva(
  // Hover is a border change only: in-page cards carry no shadow and never move.
  'flex flex-col rounded-lg border border-border bg-card transition-colors duration-fast hover:border-muted-foreground',
  {
    variants: {
      pressable: {
        true: 'relative cursor-pointer text-left has-[[data-card-activator]:focus-visible]:outline-2 has-[[data-card-activator]:focus-visible]:outline-ring has-[[data-card-activator]:focus-visible]:-outline-offset-2',
        false: '',
      },
      /** compact: 12/14 padding, 8 px gaps (default); comfortable is the deprecated p-5 card. */
      density: {
        compact: 'gap-2 px-3.5 py-3',
        comfortable: 'p-5',
      },
    },
    defaultVariants: { pressable: false, density: 'compact' },
  }
);

/** Rising or falling arrow, so the direction reads without colour. */
export const TrendIcon = ({ up = true }: { up?: boolean }): React.JSX.Element => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {up ? (
      <>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </>
    ) : (
      <>
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
        <polyline points="16 17 22 17 22 11" />
      </>
    )}
  </svg>
);

export const Trend = ({ trend, compact }: { trend: StatCardTrend; compact: boolean }) => (
  <div
    className={cn(
      statCardTrendVariants({ tone: trendTone(trend.up, trend.sentiment, trend.tone) }),
      compact && 'h-5 px-1.5 py-0'
    )}
  >
    <TrendIcon up={trend.up} />
    <span className="sr-only">{trend.up ? 'Trending up' : 'Trending down'}</span>
    <span>{trend.value}</span>
  </div>
);
