import { cva } from 'class-variance-authority';
import { fieldVariants } from './control.variants';

export const comboboxTriggerVariants = cva(
  [fieldVariants({ size: null }), 'flex items-center justify-between'],
  {
    variants: {
      /** md 30 px (default), sm 26 px. */
      size: { sm: fieldVariants({ size: 'sm' }), md: fieldVariants({ size: 'md' }) },
      disabled: { true: 'opacity-50 cursor-not-allowed', false: '' },
      placeholder: { true: 'text-muted-foreground', false: '' },
      error: { true: 'border-destructive', false: '' },
    },
    defaultVariants: { size: 'md', disabled: false, placeholder: false, error: false },
  }
);

export const comboboxOptionVariants = cva(
  [
    'flex min-h-7 w-full items-center gap-2 rounded-md px-2 py-1 text-ui transition-colors duration-fast',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-ring',
  ],
  {
    variants: {
      active: { true: 'bg-accent text-accent-foreground', false: '' },
      selected: { true: 'font-medium', false: '' },
    },
    defaultVariants: { active: false, selected: false },
  }
);

export const comboboxOptionIndicatorVariants = cva('size-4 shrink-0', {
  variants: {
    selected: { true: 'opacity-100', false: 'opacity-0' },
  },
  defaultVariants: { selected: false },
});
