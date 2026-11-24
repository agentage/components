import { nextRuns, zoneParts, type ParsedCron } from './cron.next';
import { describe } from './cron.text';

export interface CronDescription {
  text: string;
  next: Date[];
  error?: string;
}

interface CronOptions {
  timeZone?: string;
  count?: number;
  from?: Date;
}

interface FieldSpec {
  name: string;
  lo: number;
  hi: number;
  names?: string[];
  offset?: number;
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const SPECS: FieldSpec[] = [
  { name: 'minute', lo: 0, hi: 59 },
  { name: 'hour', lo: 0, hi: 23 },
  { name: 'day of month', lo: 1, hi: 31 },
  { name: 'month', lo: 1, hi: 12, names: MONTHS, offset: 1 },
  { name: 'weekday', lo: 0, hi: 7, names: WEEKDAYS, offset: 0 },
];
const MACROS: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};
const PART = /^(\*|[a-z0-9]+(?:-[a-z0-9]+)?)(?:\/(\d+))?$/i;

const valueOf = (token: string, spec: FieldSpec): number => {
  if (/^\d+$/.test(token)) return Number(token);
  const index = spec.names?.indexOf(token.toLowerCase()) ?? -1;
  return index < 0 ? NaN : index + (spec.offset ?? 0);
};

const rangeOf = (base: string, stepped: boolean, spec: FieldSpec): [number, number] => {
  if (base === '*') return [spec.lo, spec.hi];
  const [a, b] = base.split('-');
  const lo = valueOf(a, spec);
  return [lo, b === undefined ? (stepped ? spec.hi : lo) : valueOf(b, spec)];
};

const parseField = (token: string, spec: FieldSpec): Set<number> | null => {
  const set = new Set<number>();
  for (const part of token.split(',')) {
    const match = PART.exec(part);
    if (!match) return null;
    const step = match[2] === undefined ? 1 : Number(match[2]);
    const [lo, hi] = rangeOf(match[1], match[2] !== undefined, spec);
    const bad = Number.isNaN(lo) || Number.isNaN(hi) || lo < spec.lo || hi > spec.hi;
    if (bad || lo > hi || step < 1) return null;
    for (let v = lo; v <= hi; v += step) set.add(spec.name === 'weekday' && v === 7 ? 0 : v);
  }
  return set;
};

const neverMatches = ({ sets, star }: ParsedCron): boolean => {
  if (star[2] || !star[4]) return false;
  const minDay = Math.min(...sets[2]);
  return ![...sets[3]].some((month) => MONTH_DAYS[month - 1] >= minDay);
};

const parseCron = (expr: string): ParsedCron | string => {
  const trimmed = expr.trim();
  const raw = (MACROS[trimmed.toLowerCase()] ?? trimmed).split(/\s+/);
  if (raw.length !== 5 || !raw[0]) return 'Use five fields: minute hour day-of-month month weekday';
  const sets: Set<number>[] = [];
  for (const [i, spec] of SPECS.entries()) {
    const set = parseField(raw[i], spec);
    if (!set) return `Invalid ${spec.name} field "${raw[i]}"`;
    sets.push(set);
  }
  const cron = { raw, sets, star: raw.map((token) => token.startsWith('*')) };
  return neverMatches(cron) ? 'The day of month never occurs in the chosen months' : cron;
};

const fail = (error: string): CronDescription => ({ text: '', next: [], error });

export const describeCron = (expr: string, options: CronOptions = {}): CronDescription => {
  const { timeZone, count = 3, from = new Date() } = options;
  if (timeZone) {
    try {
      zoneParts(0, timeZone);
    } catch {
      return fail(`Unknown time zone "${timeZone}"`);
    }
  }
  if (Number.isNaN(from.getTime())) return fail('Invalid start date');
  const cron = parseCron(String(expr ?? ''));
  if (typeof cron === 'string') return fail(cron);
  const text = timeZone ? `${describe(cron)} (${timeZone})` : describe(cron);
  return { text, next: nextRuns(cron, timeZone, from.getTime(), Math.max(0, count)) };
};
