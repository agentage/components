/** Wall-clock maths in a time zone, and the next fire times of a parsed cron. */
export interface ParsedCron {
  raw: string[];
  sets: Set<number>[];
  star: boolean[];
}

/** Leap-day schedules recur every 4 years (8 across a skipped century), so scan a decade. */
const MAX_DAYS = 3660;

const formatterCache = new Map<string, Intl.DateTimeFormat>();

export const zoneParts = (time: number, zone: string | undefined): Record<string, number> => {
  const key = zone ?? '';
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    formatterCache.set(key, formatter);
  }
  const out: Record<string, number> = {};
  for (const part of formatter.formatToParts(new Date(time))) {
    if (part.type !== 'literal') out[part.type] = Number(part.value);
  }
  out.hour %= 24;
  return out;
};

const zoneOffset = (time: number, zone: string | undefined): number => {
  const p = zoneParts(time, zone);
  return (
    Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) -
    Math.floor(time / 1000) * 1000
  );
};

const wallKey = (p: Record<string, number>): number =>
  Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);

/** A wall time inside a DST gap does not exist: it runs at the first valid minute, like cron. */
const wallToInstant = (
  y: number,
  m: number,
  d: number,
  h: number,
  mi: number,
  zone?: string
): number => {
  const guess = Date.UTC(y, m, d, h, mi);
  const time = guess - zoneOffset(guess - zoneOffset(guess, zone), zone);
  if (wallKey(zoneParts(time, zone)) === guess) return time;
  let first = guess - zoneOffset(guess, zone);
  if (wallKey(zoneParts(first, zone)) < guess) first += 3_600_000;
  while (wallKey(zoneParts(first - 60_000, zone)) >= guess) first -= 60_000;
  return first;
};

const dayMatches = ({ sets, star }: ParsedCron, dom: number, mon: number, dow: number): boolean => {
  if (!sets[3].has(mon)) return false;
  const byDate = sets[2].has(dom);
  const byWeekday = sets[4].has(dow);
  if (star[2] && star[4]) return true;
  if (star[2]) return byWeekday;
  return star[4] ? byDate : byDate || byWeekday;
};

export const nextRuns = (
  cron: ParsedCron,
  zone: string | undefined,
  from: number,
  count: number
): Date[] => {
  const out: Date[] = [];
  const start = zoneParts(from, zone);
  const hours = [...cron.sets[1]].sort((a, b) => a - b);
  const minutes = [...cron.sets[0]].sort((a, b) => a - b);
  let last = from;
  for (let i = 0; i < MAX_DAYS && out.length < count; i++) {
    const day = new Date(Date.UTC(start.year, start.month - 1, start.day + i));
    const [y, m, d] = [day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()];
    if (!dayMatches(cron, d, m + 1, day.getUTCDay())) continue;
    for (const h of hours) {
      if (i === 0 && h < start.hour) continue;
      for (const mi of minutes) {
        if (out.length >= count) return out;
        if (i === 0 && h === start.hour && mi < start.minute) continue;
        const time = wallToInstant(y, m, d, h, mi, zone);
        if (time <= last) continue;
        last = time;
        out.push(new Date(time));
      }
    }
  }
  return out;
};
