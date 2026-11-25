import { cva } from 'class-variance-authority';

// A gap near the top marks a failure, so down and up never differ by colour alone.
const NOTCH_SM = '[mask-image:linear-gradient(to_bottom,#000_0_3px,transparent_3px_6px,#000_6px)]';
const NOTCH_MD =
  '[mask-image:linear-gradient(to_bottom,#000_0_6px,transparent_6px_10px,#000_10px)]';

export const statusBarTickVariants = cva(
  'block shrink-0 self-end p-0 outline-offset-1 cursor-default',
  {
    variants: {
      tone: {
        success: 'h-full bg-success',
        /** Down: full height with a gap near the top. */
        destructive: 'h-full bg-destructive',
        /** Degraded: half height as well as amber. */
        warning: 'h-1/2 bg-warning',
        info: 'h-full bg-info',
        primary: 'h-full bg-primary',
        /** Skipped or paused: short and grey. */
        muted: 'h-1/4 bg-muted-foreground/45',
        /** Waiting: a hollow tick. */
        pending: 'h-full border-[1.5px] border-muted-foreground bg-transparent',
        /** No data: a faint hollow tick. */
        empty: 'h-full border border-border bg-transparent',
      },
      size: {
        sm: 'w-1.5 rounded-[2px]',
        md: 'w-[7px] rounded-[2px]',
      },
      fill: { true: 'w-auto min-w-[3px] flex-1', false: '' },
      pulse: { true: 'motion-safe:animate-breathe', false: '' },
      interactive: {
        true: 'cursor-pointer transition-opacity duration-fast hover:opacity-75 focus-ring motion-reduce:transition-none',
        false: 'focus-ring',
      },
    },
    compoundVariants: [
      { tone: 'destructive', size: 'sm', class: NOTCH_SM },
      { tone: 'destructive', size: 'md', class: NOTCH_MD },
    ],
    defaultVariants: { tone: 'muted', size: 'md', fill: false, pulse: false, interactive: false },
  }
);

export const statusBarTrackVariants = cva('flex min-w-0 items-end', {
  variants: {
    size: { sm: 'h-3.5 gap-0.5', md: 'h-7 gap-px' },
    fill: { true: 'flex-1', false: 'shrink-0' },
  },
  defaultVariants: { size: 'md', fill: false },
});
