import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { StatusGlyph, type StatusGlyphProps } from './status-glyph';

/** @deprecated Class strings of the 0.20 dot; `StatusDot` now draws a `StatusGlyph`. */
export const statusDotVariants = cva('inline-block shrink-0 rounded-full', {
  variants: {
    variant: {
      online: 'bg-success',
      offline: 'bg-muted-foreground',
      working: 'bg-success motion-safe:animate-pulse',
      error: 'bg-destructive',
      warning: 'bg-warning',
      info: 'bg-info',
      pending: 'bg-muted-foreground motion-safe:animate-pulse',
      default: 'bg-muted-foreground',
      primary: 'bg-primary',
      success: 'bg-success',
      destructive: 'bg-destructive',
      /** Hollow ring: switched off or paused, still present. */
      paused: 'border-[1.5px] border-muted-foreground bg-transparent',
      /** Running now: a soft breathing glow, never a blink; still under reduced motion. */
      running: 'bg-primary outline-3 outline-primary/30 motion-safe:animate-breathe',
    },
    size: {
      sm: 'size-1.5',
      md: 'size-2',
      lg: 'size-2.5',
    },
  },
  defaultVariants: {
    variant: 'offline',
    size: 'md',
  },
});

type DotVariant = NonNullable<VariantProps<typeof statusDotVariants>['variant']>;
type Glyph = Pick<StatusGlyphProps, 'shape' | 'tone' | 'pulse' | 'className'>;

const disc = (tone: Glyph['tone'], pulse = false): Glyph => ({ shape: 'disc', tone, pulse });

/** The StatusGlyph each dot variant draws. */
export const STATUS_DOT_GLYPH: Record<DotVariant, Glyph> = {
  online: disc('success'),
  offline: disc('muted'),
  working: disc('success', true),
  error: disc('destructive'),
  warning: disc('warning'),
  info: disc('info'),
  pending: disc('muted', true),
  default: disc('muted'),
  primary: disc('primary'),
  success: disc('success'),
  destructive: disc('destructive'),
  paused: { shape: 'ring', tone: 'muted' },
  running: { ...disc('primary', true), className: 'rounded-full outline-3 outline-primary/30' },
};

// The disc fills 12.5 of the 14 px box, so these boxes keep the 6, 8 and 10 px dots.
const BOX = { sm: 'size-[7px]', md: 'size-[9px]', lg: 'size-[11px]' } as const;

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusDotVariants> {
  /** Visible text after the dot; without it the variant name is the accessible name. */
  label?: string;
}

/**
 * A small status dot with an optional text label.
 * @deprecated Use `StatusGlyph` (`shape`, `tone`, `pulse`); `STATUS_DOT_GLYPH` maps each variant.
 * `size="lg"` stays only for 0.20 layouts.
 */
export const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  (
    { variant = 'offline', size = 'md', label, className, 'aria-label': ariaLabel, ...props },
    ref
  ) => {
    const v = variant ?? 'offline';
    const name = label ? ariaLabel : (ariaLabel ?? v);
    const glyph = STATUS_DOT_GLYPH[v];

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center gap-1.5', label && 'text-ui', className)}
        data-slot="status-dot"
        data-variant={v}
        aria-label={name}
        // aria-label is prohibited on a generic span; role=img gives it a home.
        role={name ? 'img' : undefined}
        {...props}
      >
        <StatusGlyph {...glyph} className={cn(BOX[size ?? 'md'], glyph.className)} />
        {label && <span className="text-muted-foreground leading-none">{label}</span>}
      </span>
    );
  }
);
StatusDot.displayName = 'StatusDot';
