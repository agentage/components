import type * as React from 'react';
import type { CardMetaProps, CardState } from './card-state';
import type { ProgressSegment } from './progress';
import type { StatCardComparison, StatCardFact } from './stat-card.body';
import type { StatCardTrend } from './stat-card.parts';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement>, CardMetaProps {
  icon?: React.ReactNode;
  iconColor?: string;
  title: string;
  value: string | number;
  trend?: StatCardTrend;
  /** Trailing header slot for a status mark, for example a StatusGlyph; sits before the trend. */
  indicator?: React.ReactNode;
  /** Header label for the time window, for example `Last 24 h`. */
  period?: React.ReactNode;
  description?: React.ReactNode;
  /** Earlier figure and change in one muted line: "42 yesterday, +5". */
  comparison?: StatCardComparison;
  /** A Sparkline or MiniBars, 112 by 32 px right of the value; under it when the card is narrow. */
  chart?: React.ReactNode;
  /** Text alternative of the chart, read in place of the hidden chart. */
  chartLabel?: string;
  /** Two to four small label and value pairs, for example min, median and max. */
  facts?: StatCardFact[];
  /** Part of whole with a legend, for example 45 done and 2 failed. */
  breakdown?: ProgressSegment[];
  /** A compact strip of recent results, for example `<StatusBar size="sm" fill />`. */
  history?: React.ReactNode;
  /** A bottom row above a 1 px rule: last update, owner, a link. */
  footer?: React.ReactNode;
  /** 0-100; renders a Progress bar under the value. */
  progress?: number;
  /** Accessible name for the progress bar; defaults to the card title. */
  progressLabel?: string;
  /** `loading`, `empty` and `error` cover the body at its own height; `stale` badges the footer. */
  state?: CardState;
  /** Loading placeholder; bones in the shape of the visible parts by default. */
  skeleton?: React.ReactNode;
  /** Empty body; "No data for this period." by default. */
  empty?: React.ReactNode;
  /** Error body: a message and an optional reference. */
  error?: { message: React.ReactNode; reference?: string } | React.ReactNode;
  /** Shows Retry in the error body. */
  onRetry?: () => void;
  /** Renders the card as a button (click + keyboard + active state). */
  pressable?: boolean;
  /**
   * Deprecated: the compact card is the only look; `comfortable` is the pre-0.21 p-5 card.
   * @deprecated The compact card is the only look.
   */
  density?: 'compact' | 'comfortable';
}
