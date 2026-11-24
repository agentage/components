import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-xs font-medium transition-colors duration-fast disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 focus-ring',
  {
    variants: {
      variant: {
        default: 'bg-primary font-semibold text-primary-foreground hover:bg-primary/90',
        /** A page primary action: amber outline and text, no fill. */
        'outline-primary':
          'border border-primary bg-transparent font-semibold text-primary-emphasis hover:border-primary-hover hover:bg-accent hover:text-primary-hover',
        destructive: 'bg-destructive-solid text-on-solid hover:bg-destructive-solid/90',
        outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary-emphasis underline-offset-4 hover:underline',
      },
      // One control metric: md 28 px, px 10, gap 6, 13 px; sm 24 px, px 8, gap 4, 12 px; lg 32 px.
      size: {
        /** @deprecated Same as `md`. */
        default: 'h-7 px-2.5 text-ui',
        sm: 'h-6 gap-1 px-2 text-xs [&_svg:not([class*="size-"])]:size-3.5',
        md: 'h-7 px-2.5 text-ui',
        /** @deprecated 32 px; the scale is md 28 and sm 24. */
        lg: 'h-8 px-3 text-ui',
        icon: 'size-7',
        'icon-sm': 'size-6',
        /** @deprecated Same as `icon`. */
        'icon-md': 'size-7',
        /** @deprecated 32 px; use `icon` (28) or `icon-sm` (24). */
        'icon-lg': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
