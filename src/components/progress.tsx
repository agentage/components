import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { UsageThresholds } from '../lib/usage-level';
import { cn } from '../lib/utils';
import { LevelCue, progressLevel, ProgressTop } from './progress.meter';
import { ProgressSegments, type ProgressSegment } from './progress.segments';

export { segmentVariants } from './progress.segments';
export type { ProgressSegment, ProgressSegmentTone } from './progress.segments';

export const progressVariants = cva('h-full rounded-full transition-all', {
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

export interface ProgressProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof progressVariants>, 'indeterminate'> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  /** Name of the bar: the default `aria-label`, and the visible text with `showValue`. */
  label?: string;
  /** Shows the value: beside the bar ("2 of 7 done, 29%"), or on the right of the label row. */
  showValue?: boolean;
  /** `inline` (default) the bar alone or with the value beside it; `top` a label row over it. */
  labelPosition?: 'inline' | 'top';
  /** Value text, visible and in `aria-valuetext`; defaults to the rounded percentage. */
  formatValue?: (value: number, max: number) => string;
  /** Quota levels: past `warning` / `critical` (fractions of max) the bar turns warning / destructive, with a glyph and the level in `aria-valuetext`. */
  thresholds?: Partial<UsageThresholds>;
  /** `md` 8 px track (default), `sm` 6 px. */
  size?: 'sm' | 'md';
  /** Unknown progress: omits `aria-valuenow` and renders an animated full-width bar. */
  indeterminate?: boolean;
  /** Fill transition in ms; `false` disables the transition. Defaults to 300. */
  duration?: number | false;
  /** Part of whole: one proportional bar per segment with 2 px gaps, in place of value and max. */
  segments?: ProgressSegment[];
  /** With `segments`: a legend row of glyph, name and count. */
  legend?: boolean;
}

/**
 * A determinate or indeterminate bar. `role="meter"` with `thresholds` makes it a quota meter;
 * with `labelPosition="top"` the ref and the rest props go to the outer block.
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      variant = 'default',
      label,
      indeterminate = false,
      duration = 300,
      showValue = false,
      labelPosition = 'inline',
      formatValue,
      thresholds,
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
    const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
    const pct = Math.round(percentage);
    const info = progressLevel(value, max, pct, { thresholds, formatValue, variant });
    const top = labelPosition === 'top';
    const fillStyle: React.CSSProperties = {
      ...(indeterminate ? {} : { width: `${String(percentage)}%` }),
      transitionDuration: duration === false ? '0s' : `${String(duration)}ms`,
    };
    const inlineText = label ? `${label}, ${info.text}` : info.text;
    const { role = 'progressbar', ...rest } = props;
    const bar = (
      <div
        ref={top ? undefined : ref}
        role={role}
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
        {...(top ? {} : rest)}
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
          {...rest}
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
