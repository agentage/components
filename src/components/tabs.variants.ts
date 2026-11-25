import { cva } from 'class-variance-authority';

export type TabsVariant = 'line' | 'pill';

const LINE_LIST = 'flex h-9.5 w-full items-center gap-1 self-stretch border-b border-border';
const PILL_LIST =
  'inline-flex h-8.5 items-center gap-0.5 rounded-lg border border-border bg-card p-0.5';

// `w-fit self-start` stops the list stretching to the Tabs column width.
export const tabsListVariants = cva('w-fit self-start', {
  variants: {
    variant: {
      /** 38 px list over a 1 px rule; the active tab has a 2 px amber bar. */
      line: LINE_LIST,
      /** 34 px bordered tray of 28 px pills. */
      pill: PILL_LIST,
    },
  },
  defaultVariants: { variant: 'pill' },
});

const TRIGGER =
  'relative inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-ui font-medium transition-colors duration-fast focus-ring disabled:pointer-events-none disabled:opacity-50';
const LINE_ON =
  'text-foreground after:absolute after:inset-x-2 after:-bottom-1.5 after:h-0.5 after:rounded-[1px] after:bg-primary';
// Same weight in every state: a bolder active pill would widen and move its neighbours.
const PILL_ON = 'bg-accent text-foreground';
const OFF = 'text-muted-foreground hover:bg-accent hover:text-foreground';

export const tabsTriggerVariants = cva(TRIGGER, {
  variants: {
    variant: { line: '', pill: '' },
    active: { true: '', false: OFF },
  },
  compoundVariants: [
    { variant: 'line', active: true, class: LINE_ON },
    { variant: 'pill', active: true, class: PILL_ON },
  ],
  defaultVariants: { variant: 'pill', active: false },
});

export const tabsContentVariants = cva('mt-3 focus-ring');
