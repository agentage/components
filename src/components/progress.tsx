import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { LevelCue, progressLevel, ProgressTop } from './progress.meter';
import { ProgressSegments, type ProgressSegment } from './progress.segments';

export type { ProgressSegment, ProgressSegmentTone } from './progress.segments';

export const progressVariants = cva('h-full rounded-full transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive',
      info: 'bg-info',
    },
    indeterminate: {
      true: 'w-full motion-safe:animate-pulse',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    indeterminate: false,
  },
});

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Omit for unknown progress: no `aria-valuenow` and an animated full-width bar. */
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  /** Name of the bar: the default `aria-label`, and the visible text with `showValue`. */
  label?: string;
  /** Shows the value: beside the bar ("2 of 7 done, 29%"), or on the right of the meter label row. */
  showValue?: boolean;
  /** Value text, visible and in `aria-valuetext`; defaults to the rounded percentage. */
  formatValue?: (value: number, max: number) => string;
  /** Quota meter: `role="meter"`, a label row over the bar, warning past 80 % and destructive past 95 % with a glyph. */
  meter?: boolean;
  /** `md` 8 px track (default), `sm` 6 px. */
  size?: 'sm' | 'md';
  /** Part of whole: one proportional bar per segment with 2 px gaps, in place of value and max. */
  segments?: ProgressSegment[];
  /** With `segments`: a legend row of glyph, name and count. */
  legend?: boolean;
}

/** A determinate or indeterminate bar, a quota `meter`, or a part-of-whole bar from `segments`. */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value: valueProp,
      max = 100,
      variant = 'default',
      label,
      showValue = false,
      formatValue,
      meter = false,
      size = 'md',
      className,
      'aria-label': ariaLabel,
      segments,
      legend,
      ...props
    },
    ref
  ) => {
    const labelId = `${React.useId()}-progress-label`;
    if (segments)
      return (
        <ProgressSegments
          ref={ref}
          segments={segments}
          legend={legend}
          label={ariaLabel ?? label}
          className={className}
          {...props}
        />
      );
    const indeterminate = valueProp === undefined;
    const value = valueProp ?? 0;
    const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
    const pct = Math.round(percentage);
    const info = progressLevel(value, max, pct, { meter, formatValue, variant });
    const top = meter;
    const fillStyle = indeterminate ? undefined : { width: `${String(percentage)}%` };
    const inlineText = label ? `${label}, ${info.text}` : info.text;
    const bar = (
      <div
        ref={top ? undefined : ref}
        role={meter ? 'meter' : 'progressbar'}
        aria-valuenow={indeterminate ? undefined : Math.min(max, Math.max(0, value))}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={indeterminate ? undefined : info.valueText}
        aria-label={top ? ariaLabel : (ariaLabel ?? (showValue ? inlineText : label))}
        aria-labelledby={top && !ariaLabel ? labelId : undefined}
        data-slot="progress"
        data-indeterminate={indeterminate || undefined}
        data-level={info.level}
        className={cn(
          'w-full overflow-hidden rounded-full bg-muted',
          size === 'sm' ? 'h-1.5' : 'h-2',
          showValue && !top ? 'min-w-0 flex-1' : !top && className
        )}
        {...(top ? {} : props)}
      >
        <div
          className={cn(progressVariants({ variant: info.variant, indeterminate }))}
          data-slot="progress-fill"
          style={fillStyle}
        />
      </div>
    );
    if (top)
      return (
        <div
          ref={ref}
          className={cn('space-y-1.5', className)}
          data-level={info.level}
          data-slot="progress-meter"
          {...props}
        >
          <ProgressTop
            labelId={labelId}
            label={label}
            size={size}
            showValue={showValue}
            info={info}
          />
          {bar}
        </div>
      );
    if (!showValue) return bar;
    return (
      <span
        className={cn(
          'inline-flex w-60 items-center gap-1.5 text-xs text-muted-foreground',
          className
        )}
        data-slot="progress-value"
      >
        {bar}
        <span className="shrink-0" aria-hidden="true">
          <LevelCue level={info.level} />
          {inlineText}
        </span>
      </span>
    );
  }
);
Progress.displayName = 'Progress';
