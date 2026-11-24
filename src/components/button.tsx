import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { buttonVariants } from './button.variants';

export { buttonVariants } from './button.variants';

export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, 'size'> {
  /** md 28 px (default), sm 24 px; `icon` 28 and `icon-sm` 24 px squares. */
  size?: 'sm' | 'md' | 'icon' | 'icon-sm' | null;
  asChild?: boolean;
  /**
   * Work in flight: keeps focus (`aria-disabled`, clicks and submits blocked), sets `aria-busy`
   * and draws a spinner over the label, so the width never changes. Default false.
   */
  pending?: boolean;
}

const Spinner = () => (
  <svg
    viewBox="0 0 24 24"
    className="animate-spin fill-none stroke-current stroke-2 motion-reduce:animate-none"
    aria-hidden="true"
    data-slot="button-spinner"
  >
    <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      asChild = false,
      pending = false,
      disabled,
      type,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    // Server-safe: pending drops the handler instead of wrapping it; a plain button never submits.
    const native = asChild ? {} : { type: pending ? 'button' : (type ?? 'button') };

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(
          buttonVariants({ variant, size }),
          pending && 'relative cursor-default',
          className
        )}
        disabled={disabled || undefined}
        aria-disabled={pending || undefined}
        aria-busy={pending || undefined}
        {...props}
        {...native}
        onClick={pending ? undefined : onClick}
      >
        {asChild || !pending ? (
          children
        ) : (
          <>
            <span className="inline-flex items-center gap-[inherit] opacity-0">{children}</span>
            <span className="absolute inset-0 grid place-items-center">
              <Spinner />
            </span>
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';
