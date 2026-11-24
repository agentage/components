import { cva, type VariantProps } from 'class-variance-authority';

/** The one card surface: bg-card, 1 px border, radius 8, no shadow, 12/14 padding. */
export const CARD_SURFACE =
  'flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-card px-3.5 py-3 text-card-foreground';

/**
 * Card surfaces. Every value renders the one surface now; `panel`, `card` and `flat` are the
 * pre-0.21 names and stay accepted.
 */
export const cardSurface = cva('', {
  variants: {
    surface: {
      dense: CARD_SURFACE,
      /** @deprecated Same surface as `dense`. */
      panel: CARD_SURFACE,
      /** @deprecated Same surface as `dense`. */
      card: CARD_SURFACE,
      /** @deprecated Same surface as `dense`. */
      flat: CARD_SURFACE,
    },
    /** `md` is the larger 16/20 padding for a card that leads a page. */
    padding: { sm: '', md: 'gap-3 px-5 py-4' },
  },
  defaultVariants: { surface: 'dense', padding: 'sm' },
});

/** Hover border and focus ring for a clickable card; the ring follows a `[data-card-activator]`. */
export const CARD_INTERACTIVE =
  'cursor-pointer transition-colors duration-fast hover:border-muted-foreground focus-ring has-[[data-card-activator]:focus-visible]:outline-2 has-[[data-card-activator]:focus-visible]:outline-ring has-[[data-card-activator]:focus-visible]:-outline-offset-2';

export const CARD_SELECTED = 'border-primary hover:border-primary';

export type CardSurfaceVariants = VariantProps<typeof cardSurface>;

/** @deprecated Use `cardSurface()`; kept for markup that composed the old chart card class. */
export const CARD_BASE = 'rounded-lg border border-border bg-card px-3.5 py-3';
export const TITLE = 'text-xs text-muted-foreground';
export const DESC = 'text-xs text-muted-foreground mt-3';
