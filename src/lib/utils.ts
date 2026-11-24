import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Custom font-size steps from tokens.css; unknown `text-*` would merge as a colour and be dropped.
const twMerge = extendTailwindMerge({ extend: { theme: { text: ['3xs', '2xs', 'ui'] } } });

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

/**
 * Raises muted text on an accent surface (selected row, open trigger) to a readable mix of the
 * foreground, so secondary text keeps AA contrast in both themes.
 */
export const MUTED_ON_ACCENT =
  '[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]';

/** `MUTED_ON_ACCENT` for surfaces that turn accent on hover. */
export const MUTED_ON_HOVER =
  'hover:[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]';

/** Default number format: a fixed locale, so the server and the browser render the same text. */
export const formatNumber = (n: number): string => n.toLocaleString('en-US');
