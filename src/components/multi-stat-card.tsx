import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
import {
  chartCardDescriptionVariants,
  chartCardTitleVariants,
  chartCardVariants,
  type ChartCardDensity,
} from './chart-card.variants';
import { TREND_TONE, type StatCardTrend } from './stat-card.parts';

/* ============================================================================
 * MultiStatCard - multiple stats side-by-side w/ shared header & dividers.
 * ========================================================================= */

export const multiStatTrendVariants = cva('text-2xs tabular-nums', {
  variants: { tone: TREND_TONE },
  defaultVariants: { tone: 'up' },
});

export interface MultiStat {
  label: string;
  value: string | number;
  trend?: StatCardTrend;
}

export interface MultiStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Deprecated: The 12/14 compact card is the only look; `comfortable` is the pre-0.21 card.
   * @deprecated The 12/14 compact card is the only look; `comfortable` is the pre-0.21 card.
   */
  density?: ChartCardDensity;
  title: string;
  stats: MultiStat[];
  description?: React.ReactNode;
}

export const MultiStatCard = React.forwardRef<HTMLDivElement, MultiStatCardProps>(
  ({ title, stats, description, density, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(chartCardVariants({ density }), className)}
      data-slot="multi-stat-card"
      {...props}
    >
      <div className={chartCardTitleVariants({ density })}>{title}</div>
      <div
        className="mt-2.5 grid gap-3"
        style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
      >
        {stats.map((s, i) => (
          <div key={i} className={cn(i > 0 && 'border-l border-border pl-3')}>
            <div className="text-2xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <div className="text-base font-semibold tabular-nums text-foreground">{s.value}</div>
            {s.trend && (
              <div
                className={cn(
                  multiStatTrendVariants({ tone: s.trend.tone ?? (s.trend.up ? 'up' : 'down') })
                )}
              >
                <span aria-hidden="true">{s.trend.up ? '▲' : '▼'}</span>
                <span className="sr-only">{s.trend.up ? 'Up' : 'Down'}</span> {s.trend.value}
              </div>
            )}
          </div>
        ))}
      </div>
      {description && (
        <div className={chartCardDescriptionVariants({ density })}>{description}</div>
      )}
    </div>
  )
);
MultiStatCard.displayName = 'MultiStatCard';
