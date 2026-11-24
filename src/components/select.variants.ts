import { cva } from 'class-variance-authority';
import { fieldVariants } from './control.variants';

export const selectTriggerVariants = cva(
  [
    fieldVariants({ size: null }),
    'inline-flex items-center justify-between gap-2 text-foreground focus:bg-background',
    'data-[placeholder]:text-muted-foreground',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
    '[&>span:first-child]:min-w-0 [&>span:first-child]:flex-1 [&>span:first-child]:truncate [&>span:first-child]:text-left',
  ],
  {
    variants: {
      size: { sm: fieldVariants({ size: 'sm' }), md: fieldVariants({ size: 'md' }) },
      /** @deprecated Use `size="sm"`. */
      compact: { true: fieldVariants({ size: 'sm' }), false: '' },
      error: { true: 'border-destructive', false: '' },
    },
    defaultVariants: { size: 'md', compact: false, error: false },
  }
);
