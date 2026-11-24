import { cva } from 'class-variance-authority';
import { MUTED_ON_ACCENT } from '../lib/utils';

const ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/** Column gap 10 px (5 + 5) and 16 px row padding at the outer edges. */
const DENSE_X = 'px-[5px] first:pl-4 last:pr-4';

export const dataTableHeadVariants = cva('', {
  variants: {
    density: {
      dense: [
        'z-30 h-8 bg-background text-xs font-normal normal-case tracking-normal whitespace-nowrap',
        DENSE_X,
      ],
    },
    align: ALIGN,
  },
  defaultVariants: {
    density: 'dense',
    align: 'left',
  },
});

export const dataTableCellVariants = cva('', {
  variants: {
    density: {
      dense: ['py-0 text-ui whitespace-nowrap', DENSE_X],
    },
    align: ALIGN,
    nowrap: {
      true: 'whitespace-nowrap',
      false: '',
    },
  },
  defaultVariants: {
    density: 'dense',
    align: 'left',
    nowrap: false,
  },
});

/** Inner box of a dense cell: it owns the row height so a collapsed group can shrink it to 0. */
export const dataTableCellInnerVariants = cva('', {
  variants: {
    dense: { true: 'flex min-w-0 items-center gap-1.5', false: '' },
    lines: { 1: '', 2: '' },
    align: { left: '', center: 'justify-center', right: 'justify-end' },
  },
  compoundVariants: [
    { dense: true, lines: 1, class: 'min-h-[35px]' },
    { dense: true, lines: 2, class: 'min-h-[51px]' },
  ],
  defaultVariants: { dense: true, lines: 1, align: 'left' },
});

// Selected and current rows sit on the accent surface; their muted text is raised for contrast.
const SELECTED_MUTED =
  'data-[state=selected]:[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]';

export const dataTableRowVariants = cva(SELECTED_MUTED, {
  variants: {
    dense: {
      true: [
        'hover:bg-accent',
        'hover:[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]',
      ],
      false: '',
    },
    interactive: { true: 'relative', false: '' },
    shut: { true: 'border-b-0', false: '' },
    /** Single selection: accent tint and a 2 px primary bar on the leading edge. */
    current: {
      true: [
        'bg-accent hover:bg-accent',
        MUTED_ON_ACCENT,
        '[&>td:first-child]:relative [&>td:first-child]:before:absolute [&>td:first-child]:before:inset-y-0 [&>td:first-child]:before:left-0 [&>td:first-child]:before:w-0.5 [&>td:first-child]:before:bg-primary',
      ],
      false: '',
    },
  },
  defaultVariants: { dense: true, interactive: false, shut: false, current: false },
});
