import { cva } from 'class-variance-authority';

/** Buttons and toolbar controls: md 28 px, px 10, gap 6, 13 px, 16 px icons; sm 24 px, 12 px. */
export const controlVariants = cva(
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg [&_svg]:shrink-0',
  {
    variants: {
      size: {
        md: 'h-7 gap-1.5 px-2.5 text-ui [&_svg:not([class*="size-"])]:size-4',
        sm: 'h-6 gap-1 px-2 text-xs [&_svg:not([class*="size-"])]:size-3.5',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

/** Form fields (Input, Select, DatePicker triggers): md 30 px, sm 26 px at 12 px. */
export const fieldVariants = cva(
  'w-full rounded-md border border-border bg-muted/30 transition-colors duration-fast focus-ring placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        md: 'h-[30px] px-2.5 text-ui',
        sm: 'h-[26px] px-2 text-xs',
      },
      error: { true: 'border-destructive', false: '' },
    },
    defaultVariants: { size: 'md', error: false },
  }
);
