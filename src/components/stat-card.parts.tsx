import * as React from 'react';
import { cn } from '../lib/utils';
import type { StatCardSentiment, StatCardTrend } from './stat-card.types';

// Hover is a border change only: in-page cards carry no shadow and never move.
export const STAT_CARD =
  'flex flex-col gap-2 rounded-lg border border-border bg-card px-3.5 py-3 transition-colors duration-fast hover:border-muted-foreground';
export const STAT_CARD_PRESSABLE =
  'relative cursor-pointer text-left has-[[data-card-activator]:focus-visible]:outline-2 has-[[data-card-activator]:focus-visible]:outline-ring has-[[data-card-activator]:focus-visible]:-outline-offset-2';

const TONE = { good: 'text-success', bad: 'text-destructive', neutral: 'text-muted-foreground' };

/** The colour of a change: its direction read through the sentiment. */
export const trendTone = (up: boolean, sentiment: StatCardSentiment = 'up-is-good') => {
  if (sentiment === 'neutral') return TONE.neutral;
  return up === (sentiment === 'up-is-good') ? TONE.good : TONE.bad;
};

/** Rising or falling arrow, so the direction reads without colour. */
const TrendIcon = ({ up }: { up: boolean }): React.JSX.Element => (
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
    <polyline points={up ? '22 7 13.5 15.5 8.5 10.5 2 17' : '22 17 13.5 8.5 8.5 13.5 2 7'} />
    <polyline points={up ? '16 7 22 7 22 13' : '16 17 22 17 22 11'} />
  </svg>
);

export const Trend = ({ trend }: { trend: StatCardTrend }) => {
  const up = trend.direction === 'up';
  return (
    <div
      className={cn(
        'flex h-5 items-center gap-1 rounded-md border border-border bg-muted/30 px-1.5 text-2xs font-medium',
        trendTone(up, trend.sentiment)
      )}
      data-slot="stat-card-trend"
    >
      <TrendIcon up={up} />
      <span className="sr-only">{up ? 'Trending up' : 'Trending down'}</span>
      <span>{trend.value}</span>
    </div>
  );
};
