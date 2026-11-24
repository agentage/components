import { cva } from 'class-variance-authority';
import { MUTED_ON_ACCENT } from '../lib/utils';

/**
 * The one row surface: navigation 28 px, list 36 px, two-line 52 px, stacked 54 px.
 * Hover is solid accent; selected adds a 2 px primary bar on the leading edge.
 */
export const rowVariants = cva(
  'relative flex w-full min-w-0 items-center text-left text-ui transition-colors duration-fast focus-ring',
  {
    variants: {
      size: {
        nav: 'h-7 gap-1 rounded-md px-2 whitespace-nowrap select-none',
        list: 'min-h-9 gap-2.5 px-4',
        twoLine: 'min-h-[52px] gap-2.5 px-4 py-1.5',
        stacked: 'h-[54px] flex-col items-stretch justify-center gap-0.5 px-2.5',
      },
      interactive: {
        true: [
          'cursor-pointer hover:bg-accent',
          'hover:[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]',
        ],
        false: '',
      },
      selected: {
        true: [
          'bg-accent text-foreground',
          MUTED_ON_ACCENT,
          'overflow-hidden rounded-l-none before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary',
        ],
        false: '',
      },
    },
    compoundVariants: [
      { size: 'nav', selected: false, class: 'text-muted-foreground hover:text-foreground' },
    ],
    defaultVariants: { size: 'list', interactive: true, selected: false },
  }
);
