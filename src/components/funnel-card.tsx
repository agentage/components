import * as React from 'react';
import { cn, formatNumber } from '../lib/utils';
import {
  chartCardDescriptionVariants,
  chartCardTitleVariants,
  chartCardVariants,
  type ChartCardDensity,
} from './chart-card.variants';

/* ============================================================================
 * FunnelCard - vertical conversion funnel with per-stage drop-off %.
 * ========================================================================= */

export interface FunnelStage {
  label: string;
  value: number;
}

export interface FunnelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Deprecated: The 12/14 compact card is the only look; `comfortable` is the pre-0.21 card.
   * @deprecated The 12/14 compact card is the only look; `comfortable` is the pre-0.21 card.
   */
  density?: ChartCardDensity;
  title: string;
  stages: FunnelStage[];
  format?: (n: number) => string;
  description?: React.ReactNode;
}

export const FunnelCard = React.forwardRef<HTMLDivElement, FunnelCardProps>(
  ({ title, stages, format, description, density, className, ...props }, ref) => {
    const fmt = format ?? formatNumber;
    const max = stages[0]?.value || 1;
    return (
      <div
        ref={ref}
        className={cn(chartCardVariants({ density }), className)}
        data-slot="funnel-card"
        {...props}
      >
        <div className={chartCardTitleVariants({ density })}>{title}</div>
        <div className="mt-2.5 space-y-1.5">
          {stages.map((s, i) => {
            const w = Math.max(2, (s.value / max) * 100);
            const conv =
              i > 0 && stages[i - 1].value > 0
                ? ((s.value / stages[i - 1].value) * 100).toFixed(0)
                : null;
            return (
              <div key={s.label}>
                {conv && (
                  <div className="flex items-center gap-3 text-2xs text-muted-foreground">
                    <span className="w-2/5 shrink-0" />
                    <span>
                      <span aria-hidden="true">↓</span>
                      <span className="sr-only">converted</span> {conv}%
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="w-2/5 shrink-0 truncate text-xs text-foreground" title={s.label}>
                    {s.label}
                  </span>
                  {/* Bar duplicates the label + value text next to it, so it stays out of the a11y tree. */}
                  <div
                    aria-hidden="true"
                    className="relative h-5 flex-1 overflow-hidden rounded bg-muted/40"
                  >
                    <div
                      className="h-full rounded bg-primary/70 transition-[width]"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {fmt(s.value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {description && (
          <div className={chartCardDescriptionVariants({ density })}>{description}</div>
        )}
      </div>
    );
  }
);
FunnelCard.displayName = 'FunnelCard';
