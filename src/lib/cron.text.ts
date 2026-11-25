import type { ParsedCron } from './cron.next';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const pad = (n: number): string => String(n).padStart(2, '0');
const isNum = (s: string): boolean => /^\d+$/.test(s);
const sorted = (set: Set<number>): number[] => [...set].sort((a, b) => a - b);
const andList = (items: string[]): string =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
const isRun = (v: number[]): boolean =>
  v.length >= 3 && v.every((x, i) => i === 0 || x === v[i - 1] + 1);
const everyN = (s: string, range: number): number | null => {
  const match = /^\*\/(\d+)$/.exec(s);
  return match && range % Number(match[1]) === 0 ? Number(match[1]) : null;
};

/** Names of a value set; three or more consecutive values read as "A to B". */
const namesText = (values: number[], names: string[]): string =>
  isRun(values)
    ? `${names[values[0]]} to ${names[values[values.length - 1]]}`
    : andList(values.map((v) => names[v]));

const weekdayText = (set: Set<number>): string =>
  namesText(
    [...set].map((d) => (d + 6) % 7).sort((a, b) => a - b),
    DAY_NAMES
  );

const frequencyText = ([mi, h]: string[]): string | null => {
  const minutes = everyN(mi, 60);
  const hours = everyN(h, 24);
  if (mi === '*' && h === '*') return 'Every minute';
  if (minutes !== null && h === '*')
    return minutes === 1 ? 'Every minute' : `Every ${minutes} minutes`;
  if (!isNum(mi)) return null;
  const at = Number(mi) === 0 ? '' : ` at minute ${Number(mi)}`;
  if (h === '*') return `Every hour${at}`;
  if (hours === null) return null;
  return `Every ${hours === 1 ? 'hour' : `${hours} hours`}${at}`;
};

const timeText = (minuteSet: Set<number>, hourSet: Set<number>): string => {
  const [mis, hs] = [sorted(minuteSet), sorted(hourSet)];
  const [allMin, allHour] = [mis.length === 60, hs.length === 24];
  if (allMin && allHour) return 'Every minute';
  if (mis.length * hs.length <= 4)
    return `At ${andList(hs.flatMap((h) => mis.map((mi) => `${pad(h)}:${pad(mi)}`)))}`;
  if (allHour) return `At minute ${andList(mis.map(String))} of every hour`;
  const run = isRun(hs);
  const span = `${pad(hs[0])}:00 to ${pad(hs[hs.length - 1])}:`;
  if (allMin)
    return run
      ? `Every minute from ${span}59`
      : `Every minute during ${andList(hs.map((h) => `${pad(h)}:xx`))}`;
  if (run && mis.length === 1 && mis[0] === 0) return `Every hour from ${span}00`;
  const hoursText = run ? `${hs[0]} to ${hs[hs.length - 1]}` : andList(hs.map(String));
  return `At minute ${andList(mis.map(String))} past hours ${hoursText}`;
};

const dayClause = ({ raw: [, , dom, , dow], sets, star }: ParsedCron): string => {
  const days = sorted(sets[2]);
  const parts = [
    dom !== '*' &&
      `${days.length === 1 ? 'day' : 'days'} ${andList(days.map(String))} of the month`,
    dow !== '*' && weekdayText(sets[4]),
  ].filter(Boolean);
  return parts.length ? `on ${parts.join(star[2] || star[4] ? ' and ' : ' or ')}` : '';
};

const genericText = (cron: ParsedCron): string => {
  const month =
    cron.raw[3] === '*'
      ? ''
      : `in ${namesText(
          sorted(cron.sets[3]).map((m) => m - 1),
          MONTH_NAMES
        )}`;
  return [timeText(cron.sets[0], cron.sets[1]), dayClause(cron), month].filter(Boolean).join(' ');
};

export const describe = (cron: ParsedCron): string => {
  const { raw, sets } = cron;
  const [mi, h, dom, mon, dow] = raw;
  const at = isNum(mi) && isNum(h) ? `${pad(Number(h))}:${pad(Number(mi))}` : null;
  if (dom === '*' && mon === '*' && dow === '*') {
    const freq = frequencyText(raw);
    if (freq) return freq;
  }
  if (at && mon === '*' && dom === '*') {
    return sets[4].size === 7 ? `Every day at ${at}` : `At ${at} on ${weekdayText(sets[4])}`;
  }
  return genericText(cron);
};
