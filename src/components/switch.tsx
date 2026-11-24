'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { useControlled } from '../lib/use-controlled';
import { cn } from '../lib/utils';

export const switchVariants = cva(
  [
    'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-fast motion-reduce:transition-none',
    'focus-ring',
  ],
  {
    variants: {
      size: {
        md: 'h-4.5 w-7.5 border p-0.5',
        sm: 'h-3.5 w-6 border p-px',
      },
      checked: {
        true: 'border-primary bg-primary',
        false: 'border-border bg-accent',
      },
      error: { true: 'border-destructive', false: '' },
      disabled: { true: 'cursor-not-allowed opacity-50', false: '' },
    },
    defaultVariants: { size: 'md', checked: false, error: false, disabled: false },
  }
);

export const switchThumbVariants = cva(
  'pointer-events-none block rounded-full transition-[translate,background-color] duration-fast motion-reduce:transition-none',
  {
    variants: {
      size: { md: 'size-3', sm: 'size-2.5' },
      checked: { true: 'bg-background', false: 'translate-x-0 bg-muted-foreground' },
    },
    compoundVariants: [
      { size: 'md', checked: true, class: 'translate-x-3' },
      { size: 'sm', checked: true, class: 'translate-x-2.5' },
    ],
    defaultVariants: { size: 'md', checked: false },
  }
);

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  checked?: boolean;
  /** Uncontrolled start state. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  error?: boolean;
  /** `md` 30x18 (default), `sm` 24x14 for dense rows and cards. */
  size?: 'md' | 'sm';
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>((allProps, ref) => {
  const {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    error = false,
    size = 'md',
    className,
    onClick,
    onKeyDown,
    ...props
  } = allProps;
  // `checked={undefined}` stays controlled (unchecked), as in 0.20, instead of toggling itself.
  const controlled = Object.prototype.hasOwnProperty.call(allProps, 'checked');
  const [checked, setChecked] = useControlled(
    controlled ? (checkedProp ?? false) : undefined,
    defaultChecked,
    onCheckedChange
  );
  const toggle = (): void => {
    if (!disabled) setChecked(!checked);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    onClick?.(e);
    toggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    onKeyDown?.(e);
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-invalid={error || undefined}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-slot="switch"
      className={cn(switchVariants({ size, checked, error, disabled, className }))}
      {...props}
    >
      <span aria-hidden="true" className={cn(switchThumbVariants({ size, checked }))} />
    </button>
  );
});
Switch.displayName = 'Switch';
