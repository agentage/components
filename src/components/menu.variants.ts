import { cva } from 'class-variance-authority';
import { MUTED_ON_HOVER } from '../lib/utils';

/** Menu surface: 210 px, radius 8, popover shadow, short fade; `md` is the deprecated older menu. */
export const menuContentVariants = cva(
  [
    'z-[var(--z-dropdown,100)] min-w-52.5 rounded-lg border border-border bg-popover p-1 shadow-[var(--shadow-popover)] motion-safe:animate-menu-in',
    // Icon-less items line up with icon items.
    '[&:has([data-slot=menu-icon])_[data-slot$=item]:not(:has([data-slot=menu-icon]))]:pl-9',
  ],
  {
    variants: {
      size: { sm: '', md: 'min-w-45 rounded-md' },
    },
    defaultVariants: { size: 'sm' },
  }
);

/** 28 px item, 13 px text, radius 6; `md` is the deprecated older item. */
export const menuItemVariants = cva(
  [
    'flex h-7 w-full items-center gap-2.5 rounded-md px-2.5 text-ui cursor-pointer transition-colors duration-fast',
    'focus-ring focus:bg-accent focus:text-accent-foreground',
    // Meta text (counts, dates, keys) stays AA on the accent of a hovered or focused item.
    MUTED_ON_HOVER,
    'focus:[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]',
  ],
  {
    variants: {
      variant: {
        default: 'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
        destructive: 'text-destructive hover:bg-accent',
      },
      size: { sm: '', md: 'h-auto gap-2 rounded-sm px-2 py-1.5 text-sm' },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

/** Small uppercase group label inside a menu. */
export const menuLabelVariants = cva(
  'flex h-6.5 items-center px-2.5 text-2xs font-normal uppercase tracking-[0.08em] text-muted-foreground',
  {
    variants: {
      size: { sm: '', md: 'h-auto px-2 py-1.5 text-xs font-semibold normal-case tracking-normal' },
    },
    defaultVariants: { size: 'sm' },
  }
);
