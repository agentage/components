'use client';

import * as React from 'react';
import { nextListIndex } from '../lib/list-navigation';
import { cn } from '../lib/utils';

import {
  toggleButtonVariants,
  toggleGroupVariants,
  type ToggleGroupColumns,
} from './toggle-group.variants';

export { toggleButtonVariants, toggleGroupVariants } from './toggle-group.variants';
export type { ToggleGroupColumns } from './toggle-group.variants';

const isGridColumns = (n: number): n is ToggleGroupColumns =>
  Number.isInteger(n) && n >= 1 && n <= 6;

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  /** Show only the icon; the label stays the accessible name and the hover title. */
  iconOnly?: boolean;
  disabled?: boolean;
}

export interface ToggleGroupProps<T extends string> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'children'
> {
  value: T;
  onValueChange?: (value: T) => void;
  options: ToggleOption<T>[];
  columns?: ToggleGroupColumns;
  vertical?: boolean;
  error?: boolean;
  /** Disables every option. */
  disabled?: boolean;
  /** default: a grid of separate buttons; segmented: one joined 28 px control. */
  variant?: 'default' | 'segmented';
  ref?: React.Ref<HTMLDivElement>;
}

export const ToggleGroup = <T extends string>({
  value,
  onValueChange,
  options,
  columns,
  vertical = false,
  error = false,
  disabled = false,
  variant = 'default',
  className,
  style,
  ...props
}: ToggleGroupProps<T>): React.JSX.Element => {
  const buttonsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const commit = (next: T): void => onValueChange?.(next);
  const segmented = variant === 'segmented';
  const gridCols = columns ?? Math.max(1, options.length);
  const mapped = segmented || isGridColumns(gridCols);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const enabled = (i: number): boolean => !disabled && !options[i]?.disabled;
  const firstEnabled = options.findIndex((_, i) => enabled(i));
  const tabStop = selectedIndex >= 0 && enabled(selectedIndex) ? selectedIndex : firstEnabled;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    const buttons = buttonsRef.current;
    const focused = buttons.findIndex((button) => button === document.activeElement);
    let next = nextListIndex(e.key, focused >= 0 ? focused : tabStop, options.length);
    if (next === null) return;
    e.preventDefault();
    // Arrows step over disabled options; Home and End land on the nearest enabled one.
    const step = e.key === 'Home' || e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    for (let tries = 0; next !== null && !enabled(next) && tries < options.length; tries++)
      next = (next + step + options.length) % options.length;
    if (next === null || !enabled(next)) return;
    commit(options[next].value);
    buttons[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-invalid={error || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        toggleGroupVariants({
          variant,
          columns: !segmented && isGridColumns(gridCols) ? gridCols : undefined,
          className,
        })
      )}
      style={
        mapped
          ? style
          : { gridTemplateColumns: `repeat(${String(gridCols)}, minmax(0, 1fr))`, ...style }
      }
      data-slot="toggle-group"
      {...props}
    >
      {options.map((option, index) => (
        <ToggleButton
          key={option.value}
          ref={(node) => {
            buttonsRef.current[index] = node;
          }}
          selected={value === option.value}
          tabIndex={index === tabStop ? 0 : -1}
          onKeyDown={handleKeyDown}
          onClick={() => commit(option.value)}
          disabled={disabled || option.disabled}
          vertical={vertical}
          error={error}
          variant={variant}
          iconOnly={option.iconOnly}
          title={option.iconOnly ? option.label : undefined}
          aria-label={option.label}
        >
          {option.icon}
          {!option.iconOnly && <span>{option.label}</span>}
        </ToggleButton>
      ))}
    </div>
  );
};

export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  onClick: () => void;
  vertical?: boolean;
  children: React.ReactNode;
  error?: boolean;
  variant?: 'default' | 'segmented';
  iconOnly?: boolean;
}

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      selected,
      vertical = false,
      error = false,
      variant = 'default',
      iconOnly = false,
      children,
      className,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      data-slot="toggle-button"
      className={cn(
        toggleButtonVariants({ variant, selected, vertical, iconOnly, error, className })
      )}
      {...props}
    >
      {children}
    </button>
  )
);
ToggleButton.displayName = 'ToggleButton';
