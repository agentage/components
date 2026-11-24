'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { useMounted } from '../lib/use-mounted';
import { cn } from '../lib/utils';
import { fieldVariants } from './control.variants';
import { DateRangePicker, type DateRangePickerProps } from './date-picker.range';

export type { DateRange, RangePreset } from '../lib/relative-range';
export { parseRelativeRange, resolveDateRange } from '../lib/relative-range';

export const datePickerTriggerVariants = cva(
  [
    fieldVariants({ size: null }),
    'flex items-center gap-2 cursor-pointer hover:border-ring [&_svg]:size-4',
  ],
  {
    variants: {
      /** md 30 px (default), sm 26 px. */
      size: { sm: fieldVariants({ size: 'sm' }), md: fieldVariants({ size: 'md' }) },
      disabled: { true: 'opacity-50 cursor-not-allowed', false: '' },
      placeholder: { true: 'text-muted-foreground', false: '' },
      error: { true: 'border-destructive', false: '' },
    },
    defaultVariants: { size: 'md', disabled: false, placeholder: false, error: false },
  }
);

export interface DatePickerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue'
> {
  mode?: 'single';
  value?: Date;
  /** Uncontrolled start value. */
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  /** Trigger height: md 30 px (default), sm 26 px. */
  size?: 'sm' | 'md';
}

export interface DatePickerRangeProps extends DateRangePickerProps {
  /** A from and to range with presets and relative input; the trigger is a 28 px toolbar control. */
  mode: 'range';
}

const CalendarIcon = (): React.JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

// Local parts: toISOString is UTC and gives the previous day east of Greenwich.
const toInputValue = (date: Date): string =>
  `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const DAY_TEXT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

const SingleDatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      mode: _mode,
      value,
      defaultValue,
      onValueChange,
      placeholder = 'Pick a date',
      disabled = false,
      error = false,
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<string>(() => {
      const start = value ?? defaultValue;
      return start ? toInputValue(start) : '';
    });
    // Derived, so a controlled `value` always wins over the last locally picked date.
    const inputValue = value === undefined ? internalValue : toInputValue(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const dateStr = e.target.value;
      setInternalValue(dateStr);
      setOpen(false);
      if (dateStr) {
        onValueChange?.(new Date(dateStr + 'T00:00:00'));
      }
    };

    const mounted = useMounted();
    const shown = value ?? (internalValue ? new Date(internalValue + 'T00:00:00') : undefined);
    // The locale text waits for mount: server and browser locales and zones differ.
    const displayValue = !shown
      ? ''
      : mounted
        ? shown.toLocaleDateString(undefined, DAY_TEXT)
        : // Same width class as the final text, identical on server and client (fixed locale, UTC).
          shown.toLocaleDateString('en-US', { ...DAY_TEXT, timeZone: 'UTC' });

    // showPicker throws outside a user gesture and is missing in Firefox/older Safari.
    const handleClick = (): void => {
      const input = inputRef.current;
      if (disabled || !input) return;
      try {
        input.showPicker();
        setOpen(true);
      } catch {
        input.focus();
        input.click();
      }
    };

    return (
      <div className={cn('relative', className)} data-slot="date-picker" {...props}>
        {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- the focusable trigger carries the field's invalid state */}
        <button
          ref={ref}
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={error || undefined}
          className={cn(
            datePickerTriggerVariants({ size, disabled, placeholder: !displayValue, error })
          )}
        >
          <CalendarIcon />
          <span className={cn('flex-1 truncate text-left', shown && !mounted && 'invisible')}>
            {displayValue || placeholder}
          </span>
        </button>
        <input
          ref={inputRef}
          type="date"
          value={inputValue}
          onChange={handleChange}
          onBlur={() => {
            setOpen(false);
          }}
          disabled={disabled}
          className="sr-only"
          aria-label={placeholder}
          tabIndex={-1}
        />
      </div>
    );
  }
);
SingleDatePicker.displayName = 'SingleDatePicker';

/** A day picker; `mode="range"` picks a from and to range with presets and relative input. */
export const DatePicker = React.forwardRef<
  HTMLButtonElement,
  DatePickerProps | DatePickerRangeProps
>((props, ref) =>
  props.mode === 'range' ? (
    <DateRangePicker ref={ref} {...props} />
  ) : (
    <SingleDatePicker ref={ref} {...props} />
  )
);
DatePicker.displayName = 'DatePicker';
