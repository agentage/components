'use client';

import * as React from 'react';
import { useControlled } from '../lib/use-controlled';
import {
  formatRange,
  parseRelativeRange,
  RANGE_PRESETS,
  type DateRange,
} from '../lib/relative-range';
import { useMounted } from '../lib/use-mounted';
import { cn, MUTED_ON_HOVER } from '../lib/utils';
import { controlVariants } from './control.variants';
import { DisclosureChevron } from './disclosure';
import { Input } from './input';
import { CalendarIcon, CustomRange, placeholderRange } from './date-picker.range.parts';
import { Popover } from './popover';
import { rowVariants } from './row.variants';

export interface DateRangePickerProps {
  value?: DateRange;
  onValueChange?: (range: DateRange) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Toolbar control height: md 28 px (default), sm 24 px. */
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
}

const item = (selected = false): string =>
  cn(rowVariants({ size: 'nav', selected }), 'text-foreground');

/**
 * Range trigger with presets, a relative text field (`6h`, `now-2d`) and a Custom day pair.
 * A relative pick keeps its `expression`; read the current window with `resolveDateRange`.
 */
export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onValueChange,
      placeholder = 'Pick a range',
      disabled,
      size = 'md',
      className,
      'aria-label': label = 'Date range',
    },
    ref
  ) => {
    const [range, setRange] = useControlled<DateRange | undefined>(
      value,
      undefined,
      (r) => r && onValueChange?.(r)
    );
    const [open, setOpen] = React.useState(false);
    const [text, setText] = React.useState('');
    const [custom, setCustom] = React.useState(false);
    const mounted = useMounted();
    const error = text.trim() !== '' && parseRelativeRange(text) === null;
    const fixedText = !!range && !!(range.label || range.expression);
    // A label or expression is fixed text; locale dates wait for mount so server and client match.
    const shownText = !range
      ? placeholder
      : fixedText || mounted
        ? formatRange(range)
        : placeholderRange(range);
    const pick = (r: DateRange | null): void => {
      if (!r) return;
      setRange(r);
      setOpen(false);
      setText('');
      setCustom(false);
    };
    const openCustom = (): void => setCustom((c) => !c);
    const content = (
      <div className="flex w-64 flex-col gap-2">
        <Input
          size="sm"
          value={text}
          placeholder="6h, 2d, now-6h or 2026-11-01 to 2026-11-03"
          aria-label="Type a range"
          aria-invalid={error || undefined}
          error={error}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            // Focus returns to the trigger before Enter's default action, which would reopen it.
            e.preventDefault();
            pick(parseRelativeRange(text));
          }}
        />
        {error && (
          <p className="m-0 text-xs text-destructive">Try 15m, 6h, 2d, now-6h or a date.</p>
        )}
        <ul className="m-0 flex list-none flex-col gap-px p-0" aria-label="Presets">
          {RANGE_PRESETS.map((p) => (
            <li key={p.value}>
              <button
                type="button"
                className={item(range?.label === p.label)}
                aria-pressed={range?.label === p.label}
                onClick={() => {
                  const r = parseRelativeRange(p.value);
                  pick(r && { ...r, label: p.label });
                }}
              >
                {p.label}
              </button>
            </li>
          ))}
          <li>
            <button type="button" className={item()} aria-expanded={custom} onClick={openCustom}>
              <span className="flex-1">Custom</span>
              <DisclosureChevron open={custom} />
            </button>
          </li>
        </ul>
        {custom && <CustomRange initial={range} onApply={pick} />}
      </div>
    );
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
        side="bottom"
        align="start"
        aria-label={label}
        content={content}
        trigger={
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`${label}: ${shownText}`}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              controlVariants({ size }),
              'border border-border bg-background hover:bg-accent focus-ring disabled:opacity-50',
              MUTED_ON_HOVER,
              className
            )}
            data-slot="date-range-trigger"
          >
            <CalendarIcon />
            <span
              className={cn(
                !range && 'text-muted-foreground',
                range && !fixedText && !mounted && 'invisible'
              )}
            >
              {shownText}
            </span>
          </button>
        }
      />
    );
  }
);
DateRangePicker.displayName = 'DateRangePicker';
