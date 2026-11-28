import * as React from 'react';
import { cn } from '../lib/utils';

export interface ContextMeterProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Used amount, out of `max`. */
  value: number;
  /** Default 100, so `value` reads as a percent. */
  max?: number;
  /** `sm` 14 px ring for a status strip (default), `md` 64 px for a panel. */
  size?: 'sm' | 'md';
  /** Accessible name; the percent is added. Default "Context window". */
  label?: string;
}

const GEOMETRY = { sm: { box: 14, stroke: 2.5, inset: 2 }, md: { box: 64, stroke: 6, inset: 4 } };

/** The tone of a fill level: neutral, warning from 75 %, danger from 90 %. */
export const meterTone = (percent: number): string =>
  percent >= 90 ? 'text-destructive' : percent >= 75 ? 'text-warning' : 'text-muted-foreground';

/** A ring that fills with use, for example the model context window. */
export const ContextMeter = React.forwardRef<HTMLSpanElement, ContextMeterProps>(
  ({ value, max = 100, size = 'sm', label = 'Context window', className, ...props }, ref) => {
    const percent = Math.round((Math.min(Math.max(value, 0), max) / (max || 1)) * 100);
    const { box, stroke, inset } = GEOMETRY[size];
    const c = box / 2;
    const r = c - inset;
    const length = 2 * Math.PI * r;
    return (
      <span
        ref={ref}
        role="meter"
        aria-label={`${label} ${String(percent)}%`}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${String(percent)}%`}
        className={cn('inline-block flex-none', meterTone(percent), className)}
        data-slot="context-meter"
        data-size={size}
        {...props}
      >
        <svg
          width={box}
          height={box}
          viewBox={`0 0 ${String(box)} ${String(box)}`}
          aria-hidden="true"
          className="block"
        >
          <circle cx={c} cy={c} r={r} fill="none" strokeWidth={stroke} className="stroke-accent" />
          {percent > 0 && (
            <circle
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${((percent / 100) * length).toFixed(1)} ${length.toFixed(1)}`}
              transform={`rotate(-90 ${String(c)} ${String(c)})`}
            />
          )}
        </svg>
      </span>
    );
  }
);
ContextMeter.displayName = 'ContextMeter';
