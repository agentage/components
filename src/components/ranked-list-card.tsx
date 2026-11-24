import * as React from 'react';
import { cn } from '../lib/utils';
import {
  chartCardDescriptionVariants,
  chartCardTitleVariants,
  chartCardVariants,
  type ChartCardDensity,
} from './chart-card.variants';

/* ============================================================================
 * RankedListCard - top-N list with rank, optional icon, value.
 * ========================================================================= */

export interface RankedItem {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  hint?: string;
}

export interface RankedListCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Deprecated: The 12/14 compact card is the only look; `comfortable` is the pre-0.21 card.
   * @deprecated The 12/14 compact card is the only look; `comfortable` is the pre-0.21 card.
   */
  density?: ChartCardDensity;
  title: string;
  items: RankedItem[];
  format?: (n: number | string) => string;
  description?: React.ReactNode;
}

export const RankedListCard = React.forwardRef<HTMLDivElement, RankedListCardProps>(
  ({ title, items, format, description, density, className, ...props }, ref) => {
    const fmt = format ?? ((n: number | string) => String(n));
    return (
      <div
        ref={ref}
        className={cn(chartCardVariants({ density }), className)}
        data-slot="ranked-list-card"
        {...props}
      >
        <div className={chartCardTitleVariants({ density })}>{title}</div>
        <ol className="mt-2.5 space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="flex items-center gap-3 text-xs">
              <span className="flex size-5 items-center justify-center rounded-full bg-muted text-2xs font-semibold tabular-nums text-foreground">
                {i + 1}
              </span>
              {it.icon && (
                <span aria-hidden="true" className="text-muted-foreground [&_svg]:size-4">
                  {it.icon}
                </span>
              )}
              <span className="flex-1 truncate text-foreground">{it.label}</span>
              {it.hint && <span className="text-2xs text-muted-foreground">{it.hint}</span>}
              <span className="tabular-nums text-muted-foreground">{fmt(it.value)}</span>
            </li>
          ))}
        </ol>
        {description && (
          <div className={chartCardDescriptionVariants({ density })}>{description}</div>
        )}
      </div>
    );
  }
);
RankedListCard.displayName = 'RankedListCard';
