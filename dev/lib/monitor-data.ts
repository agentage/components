import type { StatusBarCell } from '../../src';

/** Docs-only monitoring samples: fixed offsets from load time, no randomness. */
const MIN = 60_000;
const NOW = Date.now();
export const ago = (minutes: number): number => NOW - minutes * MIN;

export type ServiceState = 'up' | 'degraded' | 'down';

export interface SubComponent {
  name: string;
  seed: number;
}

export interface StatusService {
  id: string;
  name: string;
  uptime: string;
  state: ServiceState;
  parts: SubComponent[];
}

export const STATUS_SERVICES: StatusService[] = [
  {
    id: 'api',
    name: 'Public API',
    uptime: '99.98%',
    state: 'up',
    parts: [
      { name: 'Read endpoints', seed: 3 },
      { name: 'Write endpoints', seed: 5 },
      { name: 'Authentication', seed: 8 },
    ],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    uptime: '99.91%',
    state: 'up',
    parts: [
      { name: 'Web app', seed: 7 },
      { name: 'Exports', seed: 13 },
    ],
  },
  {
    id: 'jobs',
    name: 'Background jobs',
    uptime: '99.42%',
    state: 'degraded',
    parts: [
      { name: 'Scheduler', seed: 11 },
      { name: 'Workers', seed: 17 },
      { name: 'Retry queue', seed: 23 },
    ],
  },
];

export const STATE_TEXT: Record<ServiceState, string> = {
  up: 'Operational',
  degraded: 'Degraded',
  down: 'Outage',
};

export interface IncidentRow {
  id: string;
  title: string;
  service: string;
  resolved: boolean;
  at: number;
}

export const INCIDENTS: IncidentRow[] = [
  { id: 'i-3', title: 'Slow job pickup', service: 'Background jobs', resolved: false, at: ago(42) },
  {
    id: 'i-2',
    title: 'Elevated API latency',
    service: 'Public API',
    resolved: true,
    at: ago(2900),
  },
  { id: 'i-1', title: 'Export failures', service: 'Dashboard', resolved: true, at: ago(11500) },
];

/** The last `count` checks, oldest first; a few slow and failed ones at fixed places. */
export const checkCells = (count: number): StatusBarCell[] =>
  Array.from({ length: count }, (_, i) => {
    const n = count - i;
    const failed = n === 17 || n === 18 || n === 63;
    const slow = n % 11 === 0 && !failed;
    const ms = failed ? 0 : 120 + ((n * 37) % 90) + (slow ? 380 : 0);
    return {
      tone: failed ? 'destructive' : slow ? 'warning' : 'success',
      label: failed ? `Check ${String(n)} ago, failed` : `Check ${String(n)} ago, ${String(ms)} ms`,
    };
  });

export interface TimelineUpdate {
  id: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  author: string;
  text: string;
  at: number;
}

export const TIMELINE: TimelineUpdate[] = [
  {
    id: 'u-1',
    status: 'investigating',
    author: 'Ada Park',
    text: 'Jobs start later than planned. We are looking at the queue.',
    at: ago(42),
  },
  {
    id: 'u-2',
    status: 'identified',
    author: 'Lin Moreau',
    text: 'A stuck worker pool is holding jobs back. We are restarting it.',
    at: ago(25),
  },
];

export interface MonitorIncident {
  id: string;
  title: string;
  at: number;
  minutes: number;
  resolved: boolean;
}

export const MONITOR_INCIDENTS: MonitorIncident[] = [
  { id: 'm-3', title: 'Two checks failed in a row', at: ago(95), minutes: 6, resolved: true },
  { id: 'm-2', title: 'Response time above 500 ms', at: ago(2900), minutes: 14, resolved: true },
  { id: 'm-1', title: 'Certificate expires soon', at: ago(9800), minutes: 0, resolved: false },
];
