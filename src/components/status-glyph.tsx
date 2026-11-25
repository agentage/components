import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export type StatusGlyphShape =
  | 'dot'
  | 'ring'
  | 'dashed'
  | 'disc'
  | 'half'
  | 'three-quarters'
  | 'check'
  | 'cross'
  | 'question'
  | 'alert'
  | 'slash'
  | 'clock';

export const statusGlyphVariants = cva('inline-block shrink-0', {
  variants: {
    tone: {
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      success: 'text-success',
      destructive: 'text-destructive',
      warning: 'text-warning',
      info: 'text-info',
    },
    size: {
      sm: 'size-3.5',
      md: 'size-4',
    },
    pulse: {
      true: 'motion-safe:animate-breathe',
      false: '',
    },
  },
  defaultVariants: { tone: 'muted', size: 'sm', pulse: false },
});

const MARK = {
  fill: 'none',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'stroke-background',
} as const;

const Ring = ({ dashed }: { dashed?: boolean }) => (
  <circle
    cx="7"
    cy="7"
    r="5.25"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeDasharray={dashed ? '2.1 1.9' : undefined}
  />
);

const Disc = () => <circle cx="7" cy="7" r="6.25" fill="currentColor" />;

const LINE = { ...MARK, className: undefined, stroke: 'currentColor' } as const;

const SHAPES: Record<StatusGlyphShape, React.ReactNode> = {
  /** 6 px dot, the StatusDot look inside the 14 px box. */
  dot: <circle cx="7" cy="7" r="3" fill="currentColor" />,
  ring: <Ring />,
  dashed: <Ring dashed />,
  disc: <circle cx="7" cy="7" r="5.25" fill="currentColor" />,
  half: (
    <>
      <Ring />
      <path d="M7 3.5a3.5 3.5 0 0 1 0 7z" fill="currentColor" />
    </>
  ),
  'three-quarters': (
    <>
      <Ring />
      <path d="M7 7V3.5a3.5 3.5 0 1 1-3.5 3.5z" fill="currentColor" />
    </>
  ),
  check: (
    <>
      <Disc />
      <path d="M4.3 7.2l1.9 1.9 3.6-4" {...MARK} />
    </>
  ),
  cross: (
    <>
      <Disc />
      <path d="M4.8 4.8l4.4 4.4M9.2 4.8l-4.4 4.4" {...MARK} />
    </>
  ),
  question: (
    <>
      <Disc />
      <path d="M5.2 5.4a1.85 1.85 0 1 1 2.6 1.7c-.55.3-.8.65-.8 1.2M7 10.2v.05" {...MARK} />
    </>
  ),
  alert: (
    <>
      <Disc />
      <path d="M7 3.8v4M7 10.1v.05" {...MARK} />
    </>
  ),
  slash: (
    <>
      <Ring />
      <path d="M3.9 10.1l6.2-6.2" {...LINE} />
    </>
  ),
  clock: (
    <>
      <Ring />
      <path d="M7 4.3V7l1.9 1.3" {...LINE} />
    </>
  ),
};

export interface StatusGlyphProps
  extends
    Omit<React.SVGAttributes<SVGSVGElement>, 'children'>,
    VariantProps<typeof statusGlyphVariants> {
  shape: StatusGlyphShape;
  /** Accessible name. Without it the glyph is decorative and hidden from assistive tech. */
  label?: string;
}

export const StatusGlyph = React.forwardRef<SVGSVGElement, StatusGlyphProps>(
  ({ shape, tone, size, pulse, label, className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 14 14"
      className={cn(statusGlyphVariants({ tone, size, pulse }), className)}
      data-slot="status-glyph"
      data-shape={shape}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...props}
    >
      {SHAPES[shape]}
    </svg>
  )
);
StatusGlyph.displayName = 'StatusGlyph';
