import type { StatusBarCell, StatusBarTone } from '../../src';

/** Docs-only uptime samples: deterministic per seed, so the bars never change between renders. */
const rand = (seed: number) => {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const STATE: Record<string, { tone: StatusBarTone; text: string }> = {
  up: { tone: 'success', text: 'no incidents' },
  degraded: { tone: 'warning', text: 'degraded for 14 min' },
  down: { tone: 'destructive', text: 'down for 6 min' },
  maintenance: { tone: 'info', text: 'planned maintenance' },
  none: { tone: 'empty', text: 'no data' },
};

const DAY = 86_400_000;

export const dayLabel = (daysAgo: number): string =>
  new Date(Date.now() - daysAgo * DAY).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

/** `days` daily cells, oldest first; the first seed days of seed 4 have no data. */
export const dayCells = (days: number, seed: number): StatusBarCell[] => {
  const r = rand(seed);
  return Array.from({ length: days }, (_, i) => {
    const v = r();
    const key =
      seed === 4 && i < 8
        ? 'none'
        : v > 0.97
          ? 'down'
          : v > 0.92
            ? 'degraded'
            : v > 0.91
              ? 'maintenance'
              : 'up';
    const state = STATE[key];
    const date = dayLabel(days - 1 - i);
    return { tone: state.tone, label: `${date}, ${state.text}` };
  });
};

export const SERVICES_UPTIME = [
  { name: 'Public API', seed: 3, uptime: '99.98%' },
  { name: 'Dashboard', seed: 7, uptime: '99.91%' },
  { name: 'Background jobs', seed: 11, uptime: '99.42%' },
  { name: 'Search index', seed: 4, uptime: '99.99%' },
  { name: 'Webhooks', seed: 19, uptime: '100%' },
];
