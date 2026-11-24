import { cva } from 'class-variance-authority';

/** @deprecated The compact card is the only look; `comfortable` is the pre-0.21 card. */
export type ChartCardDensity = 'compact' | 'comfortable';

/** Root of the chart cards: the one card surface; `comfortable` is the deprecated p-4. */
export const chartCardVariants = cva('rounded-lg border border-border bg-card', {
  variants: {
    density: { compact: 'px-3.5 py-3', comfortable: 'p-4' },
  },
  defaultVariants: { density: 'compact' },
});

/** Card title: 13/500 foreground when compact, the old 12 px muted line when comfortable. */
export const chartCardTitleVariants = cva('', {
  variants: {
    density: {
      compact: 'text-ui font-medium text-foreground',
      comfortable: 'text-xs text-muted-foreground',
    },
  },
  defaultVariants: { density: 'compact' },
});

export const chartCardDescriptionVariants = cva('text-xs text-muted-foreground', {
  variants: { density: { compact: 'mt-2', comfortable: 'mt-3' } },
  defaultVariants: { density: 'compact' },
});
