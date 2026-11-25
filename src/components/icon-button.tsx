import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const iconButtonVariants = cva('flex shrink-0 items-center justify-center rounded-lg', {
  variants: {
    size: {
      sm: 'size-6 [&_svg]:size-3.5',
      md: 'size-7 [&_svg]:size-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface IconButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof iconButtonVariants>, 'size'> {
  /** sm 24 px with a 14 px icon, md 28 px (default). */
  size?: 'sm' | 'md' | null;
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  /** Toggle state: sets aria-pressed and keeps the accent surface on. */
  pressed?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, title, 'aria-label': ariaLabel, disabled, size, pressed, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      title={title}
      aria-label={ariaLabel ?? title}
      disabled={disabled}
      data-slot="icon-button"
      aria-pressed={pressed}
      className={cn(
        iconButtonVariants({ size }),
        'transition-colors',
        'text-muted-foreground hover:bg-accent hover:text-foreground',
        'aria-pressed:bg-accent aria-pressed:text-foreground',
        'focus-ring',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {icon}
    </button>
  )
);
IconButton.displayName = 'IconButton';
