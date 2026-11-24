import type { StatusGlyphProps } from './status-glyph';

/** One status vocabulary for status rows (CheckList, StepList). */
export type RowStatus = 'ok' | 'error' | 'running' | 'pending' | 'skipped';

/** Accepted spellings from older parts: `fail` / `failed` = error, `done` = ok, `active` = running. */
export type RowStatusAlias = 'fail' | 'failed' | 'done' | 'active';

const ALIAS: Record<RowStatusAlias, RowStatus> = {
  fail: 'error',
  failed: 'error',
  done: 'ok',
  active: 'running',
};

export const normalizeRowStatus = (status: RowStatus | RowStatusAlias): RowStatus =>
  status in ALIAS ? ALIAS[status as RowStatusAlias] : (status as RowStatus);

/** The glyph of each status: shape and colour both carry it. */
export const ROW_STATUS_GLYPH: Record<
  RowStatus,
  Pick<StatusGlyphProps, 'shape' | 'tone' | 'pulse'>
> = {
  ok: { shape: 'check', tone: 'success' },
  error: { shape: 'cross', tone: 'destructive' },
  running: { shape: 'disc', tone: 'primary', pulse: true },
  pending: { shape: 'ring', tone: 'muted' },
  skipped: { shape: 'dashed', tone: 'muted' },
};

/** "6 of 6 passed", with failed, running and skipped counts when there are any. */
export const checkSummary = (statuses: (RowStatus | RowStatusAlias)[]): string => {
  const all = statuses.map(normalizeRowStatus);
  const n = (s: RowStatus) => all.filter((x) => x === s).length;
  const counted = all.length - n('skipped');
  const parts = [`${String(n('ok'))} of ${String(counted)} passed`];
  if (n('error')) parts.push(`${String(n('error'))} failed`);
  if (n('running')) parts.push(`${String(n('running'))} running`);
  if (n('skipped')) parts.push(`${String(n('skipped'))} skipped`);
  return parts.join(', ');
};
