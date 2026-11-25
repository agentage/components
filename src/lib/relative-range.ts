export interface DateRange {
  /** Start at pick time; read a relative range through `resolveDateRange`. */
  from: Date;
  /** End at pick time; read a relative range through `resolveDateRange`. */
  to: Date;
  label?: string;
  /** Relative source such as `now-24h` or `today`; absent for absolute ranges. */
  expression?: string;
}

export interface RangePreset {
  value: string;
  label: string;
}

export const RANGE_PRESETS: RangePreset[] = [
  { value: '15m', label: 'Last 15 minutes' },
  { value: '1h', label: 'Last hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
];

type Unit = 'm' | 'h' | 'd' | 'w';

const UNIT_MS: Record<Unit, number> = { m: 60_000, h: 3_600_000, d: 86_400_000, w: 604_800_000 };
const UNIT_NAMES: Record<Unit, [string, string]> = {
  m: ['minute', 'minutes'],
  h: ['hour', 'hours'],
  d: ['day', 'days'],
  w: ['week', 'weeks'],
};

const DURATION =
  /^(?:last\s+(\d*)|(\d+))\s*(m|min|mins|minutes?|h|hrs?|hours?|d|days?|w|wks?|weeks?)$/;
const NOW_SPACED = /\bnow\s*-\s*(?=\d+\s*[mhdw]\b)/g;
const NOW_POINT = /^now(?:\s*-\s*(\d+)\s*(m|h|d|w))?$/;
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})[t ](\d{2}):(\d{2})(?::(\d{2}))?$/;
const SEPARATOR = /\s+to\s+|\s+-\s+|\.\./;

const startOfDay = (date: Date, offsetDays = 0): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + offsetDays);

const endOfDay = (date: Date): Date => new Date(startOfDay(date, 1).getTime() - 1);

const durationLabel = (n: number, unit: Unit): string => {
  const [one, many] = UNIT_NAMES[unit];
  return n === 1 ? `Last ${one}` : `Last ${n} ${many}`;
};

const toLocal = (parts: number[]): Date | null => {
  const [y, mo, d, h = 0, mi = 0, s = 0] = parts;
  const date = new Date(y, mo - 1, d, h, mi, s);
  const same = date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d;
  return same && h < 24 && mi < 60 && s < 60 ? date : null;
};

const parsePoint = (text: string, edge: 'start' | 'end', now: Date): Date | null => {
  const rel = NOW_POINT.exec(text);
  if (rel) return new Date(now.getTime() - (rel[1] ? Number(rel[1]) * UNIT_MS[rel[2] as Unit] : 0));
  const day = DATE_ONLY.exec(text);
  if (day) {
    const date = toLocal(day.slice(1).map(Number));
    return date && (edge === 'end' ? endOfDay(date) : date);
  }
  const time = DATE_TIME.exec(text);
  return time ? toLocal(time.slice(1).filter(Boolean).map(Number)) : null;
};

const parseDuration = (text: string, now: Date): DateRange | null => {
  const match = DURATION.exec(text);
  if (!match) return null;
  const n = Number(match[1] || match[2] || 1);
  const unit = match[3][0] as Unit;
  if (n <= 0) return null;
  return {
    from: new Date(now.getTime() - n * UNIT_MS[unit]),
    to: now,
    label: durationLabel(n, unit),
    expression: `now-${String(n)}${unit}`,
  };
};

const parseSingle = (text: string, now: Date): DateRange | null => {
  if (text === 'today') return { from: startOfDay(now), to: now, label: 'Today', expression: text };
  if (text === 'yesterday') {
    const from = startOfDay(now, -1);
    return { from, to: endOfDay(from), label: 'Yesterday', expression: text };
  }
  const duration = parseDuration(text, now);
  if (duration) return duration;
  const rel = NOW_POINT.exec(text);
  if (rel?.[1]) return parseDuration(`${rel[1]}${rel[2]}`, now);
  const day = DATE_ONLY.test(text) ? parsePoint(text, 'start', now) : null;
  return day && { from: day, to: endOfDay(day) };
};

const finish = (range: DateRange | null): DateRange | null =>
  range && range.to.getTime() > range.from.getTime() ? range : null;

const parsePair = (parts: string[], now: Date): DateRange | null => {
  const from = parsePoint(parts[0], 'start', now);
  const to = parsePoint(parts[1], 'end', now);
  if (!from || !to) return null;
  const label =
    /^now-/.test(parts[0]) && parts[1] === 'now'
      ? parseDuration(parts[0].slice(4), now)?.label
      : undefined;
  const relative = parts.some((part) => NOW_POINT.test(part));
  return {
    from,
    to,
    ...(label && { label }),
    ...(relative && { expression: `${parts[0]} to ${parts[1]}` }),
  };
};

/** Accepts shorthand (`6h`, `last hour`), `now-6h` or `now - 6h`, `today`, `yesterday` and absolute dates or ranges. */
export const parseRelativeRange = (input: string, now: Date = new Date()): DateRange | null => {
  const text = input.trim().toLowerCase().replace(NOW_SPACED, 'now-');
  if (!text) return null;
  const whole = parseSingle(text, now);
  if (whole) return finish(whole);
  const parts = text.split(SEPARATOR).map((part) => part.trim());
  if (parts.length > 2) return null;
  return parts.length === 2 ? finish(parsePair(parts, now)) : null;
};

/** The window a range covers at `now`: a relative range moves with the clock, an absolute one stays. */
export const resolveDateRange = (
  range: DateRange,
  now: Date = new Date()
): { from: Date; to: Date } => {
  const live = range.expression ? parseRelativeRange(range.expression, now) : null;
  return live ? { from: live.from, to: live.to } : { from: range.from, to: range.to };
};

const FORMAT: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
};

export const formatRange = (range: DateRange): string => {
  if (range.label) return range.label;
  if (range.expression) return range.expression;
  const fmt = (date: Date): string => date.toLocaleString(undefined, FORMAT);
  return `${fmt(range.from)} to ${fmt(range.to)}`;
};
