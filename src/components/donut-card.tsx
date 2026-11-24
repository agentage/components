import * as React from 'react';
import { cn } from '../lib/utils';
import {
  chartCardDescriptionVariants,
  chartCardTitleVariants,
  chartCardVariants,
  type ChartCardDensity,
} from './chart-card.variants';

/* ============================================================================
 * DonutCard - donut chart for part-of-whole
 * Use when showing composition (storage breakdown, traffic source mix).
 * ========================================================================= */

export interface DonutSegment {
  label: string;
  value: number;
  color?: string;
}

export interface DonutCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Deprecated: The 12/14 compact card is the only look; `comfortable` is the pre-0.21 card.
   * @deprecated The 12/14 compact card is the only look; `comfortable` is the pre-0.21 card.
   */
  density?: ChartCardDensity;
  title: string;
  segments: DonutSegment[];
  total?: number;
  centerLabel?: React.ReactNode;
  centerSubLabel?: React.ReactNode;
  description?: React.ReactNode;
  /** Overrides the accessible name derived from title + segments. */
  chartLabel?: string;
}

export const DonutCard = React.forwardRef<HTMLDivElement, DonutCardProps>(
  (
    {
      title,
      segments,
      total,
      centerLabel,
      centerSubLabel,
      description,
      density,
      className,
      chartLabel,
      ...props
    },
    ref
  ) => {
    const sum = total ?? (segments.reduce((s, x) => s + x.value, 0) || 1);
    const r = 18;
    const c = 2 * Math.PI * r;
    let offset = 0;
    const summary = segments
      .map((s) => `${s.label} ${Math.round((s.value / sum) * 100)}%`)
      .join(', ');
    return (
      <div
        ref={ref}
        className={cn(chartCardVariants({ density }), className)}
        data-slot="donut-card"
        {...props}
      >
        <div className={chartCardTitleVariants({ density })}>{title}</div>
        <div className="mt-2.5 flex items-center gap-4">
          <div className="relative size-24 shrink-0">
            <svg
              viewBox="0 0 50 50"
              className="-rotate-90 size-24"
              role="img"
              aria-label={chartLabel ?? `Donut chart, ${title}: ${summary}`}
            >
              <circle
                cx="25"
                cy="25"
                r={r}
                fill="none"
                stroke="var(--color-muted)"
                strokeWidth="6"
              />
              {segments.map((s, i) => {
                const length = (s.value / sum) * c;
                const dash = `${length} ${c - length}`;
                const dashOffset = -offset;
                offset += length;
                return (
                  <circle
                    key={i}
                    cx="25"
                    cy="25"
                    r={r}
                    fill="none"
                    stroke={s.color ?? 'var(--color-primary)'}
                    strokeWidth="6"
                    strokeDasharray={dash}
                    strokeDashoffset={dashOffset}
                  />
                );
              })}
            </svg>
            {(centerLabel || centerSubLabel) && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
                {centerLabel && (
                  <div className="text-sm font-semibold leading-tight tabular-nums text-foreground">
                    {centerLabel}
                  </div>
                )}
                {centerSubLabel && (
                  <div className="text-2xs leading-tight text-muted-foreground">
                    {centerSubLabel}
                  </div>
                )}
              </div>
            )}
          </div>
          <ul className="flex-1 space-y-1">
            {segments.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2 rounded-sm"
                  style={{ background: s.color ?? 'var(--color-primary)' }}
                />
                <span className="text-muted-foreground">{s.label}</span>
                <span className="ml-auto tabular-nums text-foreground/80">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
        {description && (
          <div className={chartCardDescriptionVariants({ density })}>{description}</div>
        )}
      </div>
    );
  }
);
DonutCard.displayName = 'DonutCard';
