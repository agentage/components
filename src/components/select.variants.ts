import { cva } from 'class-variance-authority';
import { fieldVariants } from './control.variants';

export const selectTriggerVariants = cva(
  [
    fieldVariants({ size: null }),
    'inline-flex items-center justify-between gap-2 text-foreground focus:bg-background',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      /** md 30 px (default), sm 26 px. */
      size: { sm: fieldVariants({ size: 'sm' }), md: fieldVariants({ size: 'md' }) },
      error: { true: 'border-destructive', false: '' },
    },
    defaultVariants: { size: 'md', error: false },
  }
);

export const selectOptionVariants = cva(
  [
    'flex min-h-7 w-full items-center gap-2 rounded-md px-2 py-1 text-ui transition-colors duration-fast',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-ring',
  ],
  {
    variants: {
      active: { true: 'bg-accent text-accent-foreground', false: '' },
      selected: { true: 'font-medium', false: '' },
      disabled: { true: 'pointer-events-none opacity-50', false: '' },
    },
    defaultVariants: { active: false, selected: false, disabled: false },
  }
);

export const selectIndicatorVariants = cva('size-4 shrink-0', {
  variants: {
    selected: { true: 'opacity-100', false: 'opacity-0' },
  },
  defaultVariants: { selected: false },
});
