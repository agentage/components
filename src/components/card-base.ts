import { cva } from 'class-variance-authority';

/** The one card surface: bg-card, 1 px border, radius 8, no shadow, 12/14 padding. */
export const CARD_SURFACE =
  'flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-card px-3.5 py-3 text-card-foreground';

/** `md` is the larger 16/20 padding for a card that leads a page. */
export const cardSurface = cva(CARD_SURFACE, {
  variants: { padding: { sm: '', md: 'gap-3 px-5 py-4' } },
  defaultVariants: { padding: 'sm' },
});

/** Hover border and focus ring for a clickable card; the ring follows a `[data-card-activator]`. */
export const CARD_INTERACTIVE =
  'cursor-pointer transition-colors duration-fast hover:border-muted-foreground focus-ring has-[[data-card-activator]:focus-visible]:outline-2 has-[[data-card-activator]:focus-visible]:outline-ring has-[[data-card-activator]:focus-visible]:-outline-offset-2';

export const CARD_SELECTED = 'border-primary hover:border-primary';
