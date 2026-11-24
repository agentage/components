import * as React from 'react';
import { cn } from '../lib/utils';
import {
  chartCardDescriptionVariants,
  chartCardTitleVariants,
  chartCardVariants,
  type ChartCardDensity,
} from './chart-card.variants';

/* ============================================================================
 * HeatmapCard - grid with intensity colors. Activity-by-day-hour, cohorts.
 * ========================================================================= */

export type HeatmapCardTone = 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'muted';

const TONE_COLOR: Record<HeatmapCardTone, string> = {
  primary: 'var(--color-primary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  destructive: 'var(--color-destructive)',
  info: 'var(--color-info)',
  muted: 'var(--color-muted-foreground)',
};

export interface HeatmapCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Deprecated: The 12/14 compact card is the only look; `comfortable` is the pre-0.21 card.
   * @deprecated The 12/14 compact card is the only look; `comfortable` is the pre-0.21 card.
   */
  density?: ChartCardDensity;
  title: string;
  /** Values, one array per row. */
  data: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  max?: number;
  /** Colour meaning the cell intensity ramp is mixed from (default `primary`). */
  tone?: HeatmapCardTone;
  /**
   * Deprecated: use `tone`; a raw CSS colour, used only when `tone` is not set.
   * @deprecated Use `tone`; a raw CSS colour, used only when `tone` is not set.
   */
  color?: string;
  description?: React.ReactNode;
  /** Overrides the screen-reader table caption (defaults to title). */
  chartLabel?: string;
}

export const HeatmapCard = React.forwardRef<HTMLDivElement, HeatmapCardProps>(
  (
    {
      title,
      data,
      rowLabels,
      colLabels,
      max: maxProp,
      tone,
      color: colorProp,
      description,
      density,
      className,
      chartLabel,
      ...props
    },
    ref
  ) => {
    const max = maxProp ?? (Math.max(...data.flat()) || 1);
    const color = tone ? TONE_COLOR[tone] : (colorProp ?? TONE_COLOR.primary);
    return (
      <div
        ref={ref}
        className={cn(chartCardVariants({ density }), className)}
        data-slot="heatmap-card"
        {...props}
      >
        <div className={chartCardTitleVariants({ density })}>{title}</div>
        <div className="mt-2.5 overflow-x-auto">
          <table className="border-separate" style={{ borderSpacing: 2 }}>
            <caption className="sr-only">{chartLabel ?? title}</caption>
            {colLabels && (
              <thead>
                <tr>
                  {rowLabels && <td />}
                  {colLabels.map((c) => (
                    <th
                      key={c}
                      scope="col"
                      className="pb-1 text-2xs font-normal text-muted-foreground"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {rowLabels && (
                    <th
                      scope="row"
                      className="pr-2 text-right text-2xs font-normal text-muted-foreground"
                    >
                      {rowLabels[i]}
                    </th>
                  )}
                  {row.map((v, j) => {
                    const intensity = Math.max(5, (v / max) * 100);
                    return (
                      <td key={j}>
                        <span className="sr-only">{v}</span>
                        <div
                          aria-hidden="true"
                          className="size-4 rounded-sm"
                          style={{
                            background: `color-mix(in oklch, ${color} ${intensity}%, transparent)`,
                          }}
                          title={`${rowLabels?.[i] ?? ''} ${colLabels?.[j] ?? ''}: ${v}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {description && (
          <div className={chartCardDescriptionVariants({ density })}>{description}</div>
        )}
      </div>
    );
  }
);
HeatmapCard.displayName = 'HeatmapCard';
