import * as React from 'react';
import type { UsageThresholds } from '../lib/usage-level';
import { Progress } from './progress';

export type { UsageLevel, UsageThresholds } from '../lib/usage-level';
export { DEFAULT_USAGE_THRESHOLDS, resolveUsageLevel } from '../lib/usage-level';
export {
  usageMeterLabelVariants,
  usageMeterTrackVariants,
  usageMeterValueVariants,
} from './progress.meter';

export interface UsageMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number;
  max: number;
  /** Accessible name and the text of the label row. */
  label: string;
  /** Renders the trailing value; defaults to `"<value> / <max>"` - format upstream. */
  formatValue?: (value: number, max: number) => string;
  thresholds?: Partial<UsageThresholds>;
  size?: 'sm' | 'md';
  showValue?: boolean;
}

const fraction = (v: number, m: number): string => `${String(v)} / ${String(m)}`;

/**
 * Quota counter: a label row over a bar that escalates default, warning, destructive.
 * @deprecated Use `<Progress role="meter" labelPosition="top" showValue thresholds={...} />`.
 */
export const UsageMeter = React.forwardRef<HTMLDivElement, UsageMeterProps>(
  ({ formatValue = fraction, thresholds, showValue = true, ...props }, ref) => (
    <Progress
      ref={ref}
      role="meter"
      labelPosition="top"
      showValue={showValue}
      formatValue={formatValue}
      thresholds={thresholds ?? {}}
      data-slot="usage-meter"
      {...props}
    />
  )
);
UsageMeter.displayName = 'UsageMeter';
