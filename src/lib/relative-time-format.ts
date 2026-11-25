export type RelativeTimeValue = Date | number | string;

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** A date-only string is a local calendar day, not UTC midnight. */
export const toDate = (value: RelativeTimeValue): Date => {
  if (value instanceof Date) return value;
  const day = typeof value === 'string' ? DATE_ONLY.exec(value) : null;
  return day ? new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3])) : new Date(value);
};

/** "just now", "5 min ago", "3 h ago", "2 d ago", then a short date; future values read "in ...". */
export const formatRelativeTime = (value: RelativeTimeValue, now: number = Date.now()): string => {
  const date = toDate(value);
  const diff = now - date.getTime();
  const abs = Math.abs(diff);
  if (Number.isNaN(abs)) return '';
  if (abs < MIN) return 'just now';
  if (abs >= 7 * DAY) {
    const sameYear = date.getFullYear() === new Date(now).getFullYear();
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: sameYear ? undefined : 'numeric',
    });
  }
  const [n, unit] =
    abs < HOUR
      ? [Math.floor(abs / MIN), 'min']
      : abs < DAY
        ? [Math.floor(abs / HOUR), 'h']
        : [Math.floor(abs / DAY), 'd'];
  return diff >= 0 ? `${String(n)} ${unit} ago` : `in ${String(n)} ${unit}`;
};
