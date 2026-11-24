import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

export type ProgressSegmentTone =
  'muted' | 'subtle' | 'primary' | 'success' | 'destructive' | 'warning' | 'info';

export interface ProgressSegment {
  key: string;
  label: string;
  count: number;
  /** Semantic colour; `color` (any CSS colour) wins when given. */
  tone?: ProgressSegmentTone;
  color?: string;
  /** Legend glyph, for example a StatusGlyph; a colour dot by default. */
  glyph?: React.ReactNode;
}

export const segmentVariants = cva('', {
  variants: {
    tone: {
      muted: 'bg-muted-foreground/55',
      subtle: 'bg-muted-foreground',
      primary: 'bg-primary',
      success: 'bg-success',
      destructive: 'bg-destructive',
      warning: 'bg-warning',
      info: 'bg-info',
    },
  },
  defaultVariants: { tone: 'muted' },
});

export interface ProgressSegmentsProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: ProgressSegment[];
  /** Legend row under the bar: glyph, name and count per segment. */
  legend?: boolean;
  /** Accessible summary; "Backlog 1, Todo 2, ..." by default. */
  label?: string;
}

/**
 * Part-of-whole bar: 8 px high, 2 px gaps, segment widths proportional to their counts and
 * animated when counts change. Zero segments keep their node at zero width.
 */
export const ProgressSegments = React.forwardRef<HTMLDivElement, ProgressSegmentsProps>(
  ({ segments, legend = false, label, className, ...props }, ref) => {
    const summary = label ?? segments.map((s) => `${s.label} ${String(s.count)}`).join(', ');
    let seen = false;
    return (
      <div
        ref={ref}
        className={cn('flex min-w-0 flex-col gap-2', className)}
        data-slot="segmented-bar"
        {...props}
      >
        <div role="img" aria-label={summary} className="flex h-2 overflow-hidden rounded-[4px]">
          {segments.map((s) => {
            const gap = seen && s.count > 0;
            if (s.count > 0) seen = true;
            return (
              <span
                key={s.key}
                className={cn(
                  'h-full basis-0 transition-[flex-grow,margin] duration-normal ease-out motion-reduce:transition-none',
                  segmentVariants({ tone: s.tone })
                )}
                style={{ flexGrow: s.count, marginLeft: gap ? 2 : 0, backgroundColor: s.color }}
                data-key={s.key}
                data-count={s.count}
              />
            );
          })}
        </div>
        {legend && (
          <ul
            className="m-0 flex list-none flex-wrap gap-x-3.5 gap-y-1.5 p-0 text-xs text-muted-foreground"
            aria-hidden="true"
          >
            {segments.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5 [&_svg]:size-3.5">
                {s.glyph ?? (
                  <span
                    className={cn('size-2 rounded-full', segmentVariants({ tone: s.tone }))}
                    style={{ backgroundColor: s.color }}
                  />
                )}
                <span>
                  {s.label} {s.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
ProgressSegments.displayName = 'ProgressSegments';
