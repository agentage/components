'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-full text-xs font-medium transition-colors duration-fast',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary-emphasis border border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground border border-border',
        outline: 'border border-border text-foreground bg-transparent',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
        info: 'bg-info/10 text-info border border-info/20',
      },
      size: {
        /** 24 px chip. */
        md: 'h-6 px-2.5',
        /** 20 px chip: filters, toggles, active-filter pills. */
        sm: 'h-5 px-2 font-normal',
      },
      pressed: {
        true: 'border-primary text-primary-emphasis',
        false: '',
      },
      interactive: {
        // Ring lives on the wrapper but is driven by the inner body's focus.
        true: 'cursor-pointer hover:bg-accent has-[[data-slot=chip-body]:focus-visible]:outline-2 has-[[data-slot=chip-body]:focus-visible]:-outline-offset-2 has-[[data-slot=chip-body]:focus-visible]:outline-ring',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'sm', variant: 'outline', pressed: false, class: 'text-muted-foreground' },
      {
        size: 'sm',
        interactive: true,
        pressed: false,
        class: 'hover:bg-transparent hover:border-muted-foreground hover:text-foreground',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      size: 'md',
      interactive: false,
    },
  }
);

const XIcon = ({ size = 10 }: { size?: number }): React.JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export interface ChipProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'>,
    Omit<VariantProps<typeof chipVariants>, 'pressed'> {
  /** Makes the chip a toggle button (`aria-pressed`), for example "Needs you". */
  pressed?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  removeLabel?: string;
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      pressed,
      interactive,
      children,
      onRemove,
      onClick,
      onKeyDown,
      removeLabel = 'Remove',
      ...props
    },
    ref
  ) => {
    const clickable = !!onClick || !!interactive;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>): void => {
      onKeyDown?.(e);
      if (!clickable || e.defaultPrevented) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    };

    return (
      <span
        ref={ref}
        className={cn(
          chipVariants({
            variant,
            size,
            pressed: pressed ?? false,
            interactive: clickable,
            className,
          }),
          clickable && 'relative'
        )}
        onKeyDown={clickable ? undefined : onKeyDown}
        data-slot="chip"
        {...props}
      >
        {/* Body owns the button role; its stretched ::after keeps the whole chip clickable while
            the remove button stays a sibling rather than a nested control. */}
        <span
          data-slot="chip-body"
          role={clickable ? 'button' : undefined}
          tabIndex={clickable ? 0 : undefined}
          aria-pressed={clickable && pressed !== undefined ? pressed : undefined}
          onClick={clickable ? onClick : undefined}
          onKeyDown={clickable ? handleKeyDown : undefined}
          className={clickable ? 'outline-none after:absolute after:inset-0' : undefined}
        >
          {children}
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={removeLabel}
            data-slot="chip-remove"
            className={cn(
              'relative z-10 -mr-1 rounded-full p-0.5 transition-colors duration-fast hover:bg-accent focus-ring',
              size === 'sm' && '-mr-1.5 p-px opacity-70 hover:opacity-100'
            )}
          >
            <XIcon size={size === 'sm' ? 12 : 10} />
          </button>
        )}
      </span>
    );
  }
);
Chip.displayName = 'Chip';
