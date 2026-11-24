import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const PILL = 'gap-1 rounded-full border bg-transparent px-2 font-normal';

export const badgeVariants = cva(
  'inline-flex items-center whitespace-nowrap rounded-md text-xs font-medium transition-colors',
  {
    variants: {
      size: {
        /** 20 px, the one badge size. */
        sm: 'h-5 px-1.5 leading-none',
        /** @deprecated The pre-0.21 22 px badge; use the default `sm`. */
        md: 'px-2 py-0.5',
      },
      variant: {
        default: 'bg-primary/10 text-primary-emphasis border border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground border border-border',
        destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        info: 'bg-info/10 text-info border border-info/20',
        outline: 'border border-border text-foreground',
        /** Loud count or state pill: solid accent, fully rounded, bold. */
        solid:
          'min-w-5 justify-center rounded-full border border-transparent bg-primary font-bold text-primary-foreground',
        // Status pills: 20 px, px 8, fully rounded, tinted rule, tone text.
        'outline-success': `${PILL} border-success/45 text-success`,
        'outline-primary': `${PILL} border-primary/50 text-primary-emphasis`,
        'outline-destructive': `${PILL} border-destructive/50 text-destructive`,
        'outline-warning': `${PILL} border-warning/50 text-warning`,
        'outline-info': `${PILL} border-info/50 text-info`,
        'outline-muted': `${PILL} border-border text-muted-foreground`,
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    /** Count badge: renders the number (solid by default) and nothing at 0. */
    count?: number;
    /** Shows `max+` above this number; default 99. */
    max?: number;
  };

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, count, max = 99, children, ...props }, ref) => {
    if (count !== undefined && count <= 0) return null;
    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant: variant ?? (count !== undefined ? 'solid' : undefined), size }),
          className
        )}
        data-slot="badge"
        {...props}
      >
        {count === undefined ? children : count > max ? `${String(max)}+` : count}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
