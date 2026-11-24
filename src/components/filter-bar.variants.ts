import { cva } from 'class-variance-authority';

export const filterOptionVariants = cva(
  [
    'flex h-6 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors cursor-pointer',
    'focus-ring',
  ],
  {
    variants: {
      active: {
        true: 'bg-accent text-foreground',
        false: 'text-muted-foreground hover:bg-accent hover:text-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export const filterSearchInputVariants = cva(
  [
    'h-7 w-full rounded-md border border-border bg-background pl-8 text-ui',
    'placeholder:text-muted-foreground/60',
    'focus-ring',
    'transition-colors',
  ],
  {
    variants: {
      /** The clear button only exists once there is a query, so the input reserves room for it. */
      clearable: {
        true: 'pr-8',
        false: 'pr-3',
      },
    },
    defaultVariants: {
      clearable: false,
    },
  }
);

export const filterClearVariants = cva(
  [
    'flex h-7 items-center gap-1.5 rounded-lg px-2.5 self-end text-ui font-medium transition-colors',
    'focus-ring',
  ],
  {
    variants: {
      active: {
        true: 'text-muted-foreground hover:text-foreground cursor-pointer',
        false: 'text-transparent pointer-events-none',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);
