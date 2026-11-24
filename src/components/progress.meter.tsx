import { cva } from 'class-variance-authority';
import { resolveUsageLevel, usageFraction, type UsageLevel } from '../lib/usage-level';
import { cn } from '../lib/utils';
import { StatusGlyph } from './status-glyph';
import type { ProgressProps } from './progress';

export const usageMeterTrackVariants = cva('w-full overflow-hidden rounded-full bg-muted', {
  variants: {
    size: { sm: 'h-1.5', md: 'h-2' },
  },
  defaultVariants: { size: 'md' },
});

export const usageMeterLabelVariants = cva('flex items-baseline justify-between gap-3', {
  variants: {
    size: { sm: 'text-xs', md: 'text-ui' },
  },
  defaultVariants: { size: 'md' },
});

export const usageMeterValueVariants = cva('tabular-nums', {
  variants: {
    level: {
      default: 'text-muted-foreground',
      warning: 'text-warning',
      critical: 'text-destructive',
    },
  },
  defaultVariants: { level: 'default' },
});

const LEVEL_VARIANT = { default: undefined, warning: 'warning', critical: 'destructive' } as const;
const LEVEL_WORD = { default: '', warning: 'warning', critical: 'critical' } as const;

export interface ProgressLevel {
  level?: UsageLevel;
  /** Bar colour: the level colour when thresholds are set, otherwise `variant`. */
  variant: NonNullable<ProgressProps['variant']>;
  /** Visible value: `formatValue` or the rounded percentage. */
  text: string;
  /** `aria-valuetext`: the value text plus the level word above the warning point. */
  valueText?: string;
}

/** Resolves colour, value text and level of a determinate bar. */
export const progressLevel = (
  value: number,
  max: number,
  pct: number,
  { thresholds, formatValue, variant = 'default' }: ProgressProps
): ProgressLevel => {
  const level = thresholds ? resolveUsageLevel(usageFraction(value, max), thresholds) : undefined;
  const text = formatValue ? formatValue(value, max) : `${String(pct)}%`;
  const word = level ? LEVEL_WORD[level] : '';
  const withWord = word ? `${text}, ${word}` : text;
  return {
    level,
    variant: (level && LEVEL_VARIANT[level]) ?? variant,
    text,
    valueText: formatValue || word ? withWord : undefined,
  };
};

/** Warning and critical show as a glyph next to the value, not only as colour. */
export const LevelCue = ({ level }: { level?: UsageLevel }) =>
  level && level !== 'default' ? (
    <StatusGlyph
      shape="alert"
      tone={level === 'critical' ? 'destructive' : 'warning'}
      className="mr-1 inline-block align-[-2px]"
      data-slot="progress-level-cue"
    />
  ) : null;

export interface ProgressTopProps {
  labelId: string;
  label?: string;
  size: 'sm' | 'md';
  showValue: boolean;
  info: ProgressLevel;
}

/** The label row over the bar: name on the left, value (with the level cue) on the right. */
export const ProgressTop = ({ labelId, label, size, showValue, info }: ProgressTopProps) => (
  <div className={usageMeterLabelVariants({ size })} data-slot="progress-label-row">
    <span id={labelId} className="font-medium text-foreground">
      {label}
    </span>
    {showValue && (
      <span
        className={cn(usageMeterValueVariants({ level: info.level ?? 'default' }))}
        data-slot="progress-value-text"
      >
        <LevelCue level={info.level} />
        {info.text}
      </span>
    )}
    {!showValue && <LevelCue level={info.level} />}
  </div>
);
