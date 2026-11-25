import type { StatusBarTone, StatusGlyphProps } from '../../src';

/** Docs-only: how sample result states map onto the generic StatusGlyph. */
export type ResultStatus =
  | 'queued'
  | 'active'
  | 'waiting-input'
  | 'waiting-permission'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'timed-out'
  | 'skipped';

type Glyph = Pick<StatusGlyphProps, 'shape' | 'tone' | 'pulse'> & { label: string };

export const RESULT_GLYPH: Record<ResultStatus, Glyph> = {
  queued: { shape: 'ring', tone: 'muted', label: 'Queued' },
  active: { shape: 'disc', tone: 'primary', pulse: true, label: 'In progress' },
  'waiting-input': { shape: 'question', tone: 'primary', label: 'Waiting for input' },
  'waiting-permission': { shape: 'alert', tone: 'primary', label: 'Waiting for approval' },
  succeeded: { shape: 'check', tone: 'success', label: 'Succeeded' },
  failed: { shape: 'cross', tone: 'destructive', label: 'Failed' },
  canceled: { shape: 'slash', tone: 'muted', label: 'Canceled' },
  'timed-out': { shape: 'clock', tone: 'destructive', label: 'Timed out' },
  skipped: { shape: 'dashed', tone: 'muted', label: 'Skipped' },
};

export const RESULT_TICK: Record<ResultStatus, StatusBarTone> = {
  queued: 'pending',
  active: 'primary',
  'waiting-input': 'primary',
  'waiting-permission': 'primary',
  succeeded: 'success',
  failed: 'destructive',
  canceled: 'muted',
  'timed-out': 'destructive',
  skipped: 'muted',
};
