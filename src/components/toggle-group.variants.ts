import { cva } from 'class-variance-authority';

export type ToggleGroupColumns = 1 | 2 | 3 | 4 | 5 | 6;

// Tailwind cannot generate class names at runtime, so the static ones are mapped explicitly.
export const toggleGroupVariants = cva('', {
  variants: {
    /** default: a grid of separate buttons; segmented: one joined 28 px control. */
    variant: {
      default: 'grid gap-1.5',
      segmented: 'inline-flex items-center gap-0.5 rounded-lg border border-border p-px',
    },
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const toggleButtonVariants = cva(
  [
    'flex items-center justify-center gap-1.5 rounded-md text-ui transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-50',
    'focus-ring',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: 'h-7 px-2.5',
        segmented:
          'h-6 min-w-6.5 border border-transparent px-2 text-muted-foreground hover:bg-accent hover:text-foreground',
      },
      selected: { true: '', false: '' },
      vertical: { true: 'h-auto flex-col gap-1 py-1.5', false: '' },
      iconOnly: { true: 'px-0', false: '' },
      error: { true: 'border border-destructive', false: '' },
    },
    compoundVariants: [
      { variant: 'default', selected: true, className: 'bg-primary text-primary-foreground' },
      {
        variant: 'default',
        selected: false,
        className:
          'border border-border bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground',
      },
      {
        variant: 'segmented',
        selected: true,
        className: 'border-primary bg-accent text-foreground hover:bg-accent',
      },
    ],
    defaultVariants: {
      variant: 'default',
      selected: false,
      vertical: false,
      iconOnly: false,
      error: false,
    },
  }
);
