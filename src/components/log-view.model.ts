import type { StatusGlyphShape } from './status-glyph';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogLine {
  /** Stable key: a line keeps its node while new lines arrive. */
  id: string;
  time?: Date | number | string;
  level?: LogLevel | (string & {});
  message: string;
  source?: string;
  /** Structured detail, shown as a DataTree when the line expands. */
  fields?: Record<string, unknown>;
}

export type LogTone = 'muted' | 'default' | 'info' | 'success' | 'warning' | 'destructive';

export interface LogLevelStyle {
  tone: LogTone;
  /** Glyph in the level column, so a level never relies on colour alone. */
  shape: StatusGlyphShape;
  label?: string;
}

export const LOG_LEVELS: Record<LogLevel, LogLevelStyle> = {
  debug: { tone: 'muted', shape: 'dashed', label: 'Debug' },
  info: { tone: 'default', shape: 'dot', label: 'Info' },
  warn: { tone: 'warning', shape: 'alert', label: 'Warning' },
  error: { tone: 'destructive', shape: 'cross', label: 'Error' },
};

/** Level of a plain text line: FAIL or ERROR, WARN, an indented line is quiet. */
export const levelOfText = (text: string): LogLevel => {
  if (/^(FAIL|ERROR|ERR!)/i.test(text)) return 'error';
  if (/^WARN/i.test(text)) return 'warn';
  return /^\s/.test(text) ? 'debug' : 'info';
};

/** A plain string becomes a line keyed by its index. */
export const toLogLine = (line: string | LogLine, index: number): LogLine =>
  typeof line === 'string' ? { id: String(index), message: line, level: levelOfText(line) } : line;

/** Time as ISO text; a value that is not a date stays as given. */
const timeText = (time: LogLine['time']): string => {
  if (time === undefined) return '';
  const d = new Date(time);
  return Number.isNaN(d.getTime()) ? String(time) : d.toISOString();
};

export const lineText = (line: LogLine): string =>
  [
    timeText(line.time),
    line.level?.toUpperCase() ?? '',
    line.source ? `[${line.source}]` : '',
    line.message,
  ]
    .filter(Boolean)
    .join(' ');

/** Top offset of each line plus the total height at the end; extra holds open detail heights. */
export const offsetsOf = (count: number, rowHeight: number, extra: number[]): number[] => {
  const out = new Array<number>(count + 1);
  out[0] = 0;
  for (let i = 0; i < count; i++) out[i + 1] = out[i] + rowHeight + (extra[i] ?? 0);
  return out;
};

/** Index of the line at `y`, by binary search over the offsets. */
export const indexAt = (offsets: number[], y: number): number => {
  let lo = 0;
  let hi = offsets.length - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (offsets[mid] <= y) lo = mid;
    else hi = mid - 1;
  }
  return Math.max(0, lo);
};

/** The window of lines to render for a scroll position, with `overscan` lines either side. */
export const windowOf = (
  offsets: number[],
  scrollTop: number,
  height: number,
  overscan = 8
): [number, number] => {
  const count = offsets.length - 1;
  if (count <= 0) return [0, 0];
  const start = Math.max(0, indexAt(offsets, scrollTop) - overscan);
  const end = Math.min(count, indexAt(offsets, scrollTop + height) + 1 + overscan);
  return [start, end];
};

export const isAtBottom = (
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number,
  slack = 4
): boolean => scrollHeight - scrollTop - clientHeight <= slack;

/** Lines after the one with id `seen` that pass; all passing lines when it is gone. */
export const countAfter = (
  lines: LogLine[],
  seen: string | null,
  passes: (line: LogLine) => boolean
): number => {
  let n = 0;
  for (let i = lines.length - 1; i >= 0 && lines[i].id !== seen; i--) if (passes(lines[i])) n++;
  return n;
};
