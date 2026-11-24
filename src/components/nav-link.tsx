import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { navRowVariants } from './nav-tree.variants';

/** The pre-0.21 36 px link, kept for `density="comfortable"`. */
export const navLinkVariants = cva(
  [
    'flex items-center gap-3 rounded-md border-l-[3px] border-l-transparent px-3 py-2 text-ui font-medium cursor-pointer transition-colors duration-fast',
    'focus-ring',
  ],
  {
    variants: {
      active: {
        true: 'border-l-primary bg-primary-soft text-foreground',
        false: 'text-muted-foreground hover:bg-accent hover:text-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export interface NavLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof navLinkVariants> {
  active?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  /** Render the child element (e.g. next/link) instead of an `<a>`. */
  asChild?: boolean;
  /**
   * Deprecated: The 28 px nav row is the only look; `comfortable` is the pre-0.21 36 px link.
   * @deprecated The 28 px nav row is the only look; `comfortable` is the pre-0.21 36 px link.
   */
  density?: 'compact' | 'comfortable';
}

/** @deprecated Use `NavRow` (or `navRowVariants` on your own link). */
export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      active = false,
      icon,
      badge,
      asChild = false,
      density = 'compact',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'a';

    return (
      <Comp
        ref={ref}
        data-slot="nav-link"
        data-active={active || undefined}
        aria-current={active ? 'page' : undefined}
        data-density={density}
        className={cn(
          density === 'comfortable'
            ? navLinkVariants({ active })
            : cn(navRowVariants({ selected: active }), 'gap-2.5'),
          className
        )}
        {...props}
      >
        {icon && (
          <span
            className={cn(
              'shrink-0 [&_svg]:size-4',
              density === 'compact' && (active ? 'text-primary-emphasis' : 'text-muted-foreground')
            )}
          >
            {icon}
          </span>
        )}
        {asChild ? (
          // Slottable keeps icon/badge as siblings inside the consumer's element.
          <Slottable>{children}</Slottable>
        ) : (
          <span className="flex-1 truncate">{children}</span>
        )}
        {badge && <span className="shrink-0">{badge}</span>}
      </Comp>
    );
  }
);
NavLink.displayName = 'NavLink';
