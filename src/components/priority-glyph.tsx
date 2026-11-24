import * as React from 'react';
import { cn } from '../lib/utils';

export type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export const PRIORITY_LABEL: Record<Priority, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'No priority',
};

const LIT: Record<Priority, number> = { urgent: 3, high: 3, medium: 2, low: 1, none: 0 };
const BARS = [
  { x: 1.5, y: 8, h: 4 },
  { x: 5.5, y: 5, h: 7 },
  { x: 9.5, y: 2, h: 10 },
];

export interface PriorityGlyphProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  priority: Priority;
  /** Accessible name; defaults to "High priority". Pass `null` when a visible label sits beside it. */
  label?: string | null;
}

/** 14 px priority mark: three bars with 3, 2 or 1 lit, a filled "!" square for urgent, a dash for none. */
export const PriorityGlyph = React.forwardRef<SVGSVGElement, PriorityGlyphProps>(
  ({ priority, label, className, ...props }, ref) => {
    const name =
      label === undefined
        ? priority === 'none'
          ? PRIORITY_LABEL.none
          : `${PRIORITY_LABEL[priority]} priority`
        : label;
    return (
      <svg
        ref={ref}
        viewBox="0 0 14 14"
        className={cn('inline-block size-3.5 shrink-0 text-muted-foreground', className)}
        role={name ? 'img' : undefined}
        aria-label={name ?? undefined}
        aria-hidden={name ? undefined : true}
        focusable="false"
        data-slot="priority-glyph"
        data-priority={priority}
        {...props}
      >
        {priority === 'urgent' ? (
          <>
            <rect x="1" y="1" width="12" height="12" rx="3" className="fill-destructive" />
            <path
              d="M7 3.8v3.8M7 10v.1"
              className="stroke-background"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </>
        ) : priority === 'none' ? (
          <path
            d="M2.5 7h1M6.5 7h1M10.5 7h1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ) : (
          BARS.map((b, i) => (
            <rect
              key={b.x}
              x={b.x}
              y={b.y}
              width="3"
              height={b.h}
              rx="1"
              fill="currentColor"
              opacity={i < LIT[priority] ? 1 : 0.3}
            />
          ))
        )}
      </svg>
    );
  }
);
PriorityGlyph.displayName = 'PriorityGlyph';
