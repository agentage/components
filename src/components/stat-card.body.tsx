import * as React from 'react';
import { cn } from '../lib/utils';
import { Skeleton } from './skeleton';
import {
  TREND_TONE,
  trendTone,
  type StatCardSentiment,
  type StatCardTrend,
} from './stat-card.parts';

export interface StatCardComparison {
  /** The earlier figure, for example `42`. */
  previous: React.ReactNode;
  /** When the earlier figure was taken, for example `yesterday`. */
  label?: string;
  /** The change, for example `+5`; draws an arrow in the direction of `up`. */
  delta?: string;
  /** Direction of the change; `trend.up` by default. */
  up?: boolean;
  /** Whether a rise is good news; `trend.sentiment` by default. */
  sentiment?: StatCardSentiment;
}

export interface StatCardFact {
  label: string;
  value: React.ReactNode;
}

// The card turns into a size container only when a part reflows, so a bare card sizes as before.
export const CONTAINER = '@container';

const Arrow = ({ up }: { up: boolean }) => (
  <svg viewBox="0 0 8 8" className="size-2 shrink-0 fill-current" aria-hidden="true">
    <path d={up ? 'M4 1 7.5 7h-7z' : 'M4 7 .5 1h7z'} />
  </svg>
);

export const Comparison = ({
  id,
  comparison,
  trend,
}: {
  id: string;
  comparison: StatCardComparison;
  trend?: StatCardTrend;
}) => {
  const up = comparison.up ?? trend?.up;
  const tone = trendTone(up ?? true, comparison.sentiment ?? trend?.sentiment);
  return (
    <div
      id={id}
      className="flex min-w-0 items-center gap-1 truncate text-xs tabular-nums text-muted-foreground"
      data-slot="stat-card-comparison"
    >
      <span className="truncate">
        {comparison.previous}
        {comparison.label && ` ${comparison.label}`}
        {comparison.delta && ','}
      </span>
      {comparison.delta && (
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-0.5 font-medium',
            up !== undefined && TREND_TONE[tone]
          )}
        >
          {up !== undefined && <Arrow up={up} />}
          {up !== undefined && <span className="sr-only">{up ? 'up' : 'down'}</span>}
          {up !== undefined && ' '}
          {comparison.delta}
        </span>
      )}
    </div>
  );
};

/** Value with its comparison on the left and a fixed-size chart on the right (under it when narrow). */
export const ValueRow = ({
  value,
  comparison,
  chart,
  chartLabel,
}: {
  value: React.ReactNode;
  comparison?: React.ReactNode;
  chart?: React.ReactNode;
  chartLabel?: string;
}) => {
  if (!chart)
    return (
      <>
        {value}
        {comparison}
      </>
    );
  return (
    <div
      className="flex flex-col gap-2 @min-[15rem]:flex-row @min-[15rem]:items-center @min-[15rem]:justify-between @min-[15rem]:gap-3"
      data-slot="stat-card-value-row"
    >
      <div className="min-w-0 space-y-1">
        {value}
        {comparison}
      </div>
      <div
        className="h-8 w-full shrink-0 @min-[15rem]:w-28 [&>svg]:h-full [&>svg]:w-full"
        data-slot="stat-card-chart"
        aria-hidden="true"
      >
        {chart}
      </div>
      {chartLabel && <span className="sr-only">{chartLabel}</span>}
    </div>
  );
};

/** Two to four label and value pairs: one row when the card is wide, two columns when narrow. */
export const Facts = ({ facts }: { facts: StatCardFact[] }) => (
  <dl
    className="m-0 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs @min-[15rem]:auto-cols-fr @min-[15rem]:grid-flow-col @min-[15rem]:grid-cols-none"
    data-slot="stat-card-facts"
  >
    {facts.map((fact) => (
      <div key={fact.label} className="min-w-0">
        <dt className="truncate text-muted-foreground">{fact.label}</dt>
        <dd className="m-0 truncate font-medium tabular-nums text-foreground">{fact.value}</dd>
      </div>
    ))}
  </dl>
);

export interface StatSkeletonShape {
  chart: boolean;
  comparison: boolean;
  description: boolean;
  facts: number;
  breakdown: boolean;
  progress: boolean;
  history: boolean;
}

// bg-muted is the page tone and vanishes on a card surface, so bones use a foreground tint.
/** Loading placeholder with one bone per visible part, so it has the card's shape. */
export const StatSkeleton = ({ shape }: { shape: StatSkeletonShape }) => (
  <div className="flex flex-col gap-2" data-slot="stat-card-skeleton">
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="bg-foreground/10 h-6 w-20" />
        {shape.comparison && <Skeleton variant="text" className="bg-foreground/10 h-3 w-28" />}
      </div>
      {shape.chart && <Skeleton className="bg-foreground/10 hidden h-8 w-28 @min-[15rem]:block" />}
    </div>
    {shape.description && <Skeleton variant="text" className="bg-foreground/10 h-3 w-2/3" />}
    {shape.facts > 0 && <Skeleton variant="text" className="bg-foreground/10 h-7 w-full" />}
    {shape.breakdown && <Skeleton className="bg-foreground/10 h-2 w-full rounded-full" />}
    {shape.progress && <Skeleton className="bg-foreground/10 h-2 w-full rounded-full" />}
    {shape.history && <Skeleton className="bg-foreground/10 h-3.5 w-full" />}
  </div>
);
