import { cva } from 'class-variance-authority';

export const commandContentVariants = cva(
  'relative z-10 w-full max-w-lg overflow-hidden rounded-lg border border-border bg-popover shadow-[var(--shadow-popover)]'
);

export const commandItemVariants = cva(
  [
    'flex h-7 w-full items-center gap-2.5 rounded-md px-2 text-ui transition-colors duration-fast',
    'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
    'focus-ring focus:bg-accent focus:text-accent-foreground',
  ],
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
      hidden: {
        true: 'hidden',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      hidden: false,
    },
  }
);
