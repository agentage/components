import { MiniBars, Sparkline, StatusBar, type StatCardProps } from '../../src';
import { ago, checkCells } from './monitor-data';

/** Docs-only figures for the StatCard pages: fixed series, no randomness. */
export const REQUESTS = [31, 28, 30, 34, 39, 44, 41, 46, 52, 49, 55, 58, 54, 61];
export const ERRORS = [3, 2, 4, 2, 3, 6, 5, 4, 7, 5, 6, 8];

const results = (failed: number[]) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: String(i),
    tone: failed.includes(i) ? ('destructive' as const) : ('success' as const),
    label: `Result ${String(20 - i)} ago, ${failed.includes(i) ? 'failed' : 'done'}`,
  }));

export const requestsCard: StatCardProps = {
  title: 'Requests',
  value: '48.2k',
  period: 'Last 24 h',
  trend: { value: '+6.1%', up: true },
  comparison: { previous: '45.4k', label: 'yesterday', delta: '+2.8k' },
  chart: <Sparkline data={REQUESTS} showLastDot />,
  chartLabel: 'Requests per hour, rising from 31 to 61 thousand.',
  facts: [
    { label: 'Peak', value: '3.1k/min' },
    { label: 'Median', value: '1.9k/min' },
    { label: 'Low', value: '0.4k/min' },
  ],
  source: 'Edge gateway',
  updatedAt: ago(2),
};

export const errorsCard: StatCardProps = {
  title: 'Error rate',
  value: '0.42%',
  period: 'Last 24 h',
  trend: { value: '+0.08 pt', up: true, sentiment: 'down-is-good' },
  comparison: { previous: '0.34%', label: 'yesterday', delta: '+0.08 pt' },
  chart: <MiniBars data={ERRORS} tone="destructive" />,
  chartLabel: 'Errors per hour, highest in the last hour.',
  breakdown: [
    { key: 'client', label: 'Client errors', count: 312, tone: 'warning' },
    { key: 'server', label: 'Server errors', count: 41, tone: 'destructive' },
    { key: 'timeout', label: 'Timeouts', count: 9, tone: 'muted' },
  ],
  source: 'Edge gateway',
  updatedAt: ago(2),
};

export const latencyCard: StatCardProps = {
  title: 'Response time',
  value: '182 ms',
  period: 'p95, 24 h',
  trend: { value: '-12 ms', up: false, sentiment: 'down-is-good' },
  comparison: { previous: '194 ms', label: 'yesterday', delta: '-12 ms' },
  facts: [
    { label: 'p50', value: '96 ms' },
    { label: 'p95', value: '182 ms' },
    { label: 'p99', value: '410 ms' },
  ],
  history: (
    <StatusBar fill size="sm" label="Last 24 checks of Response time" cells={checkCells(24)} />
  ),
  source: 'Region: EU West',
  updatedAt: ago(4),
};

export const backupCard: StatCardProps = {
  title: 'Nightly backup',
  value: '96%',
  period: 'Last 30 days',
  comparison: { previous: '93%', label: 'last month', delta: '+3 pt', up: true },
  breakdown: [
    { key: 'done', label: 'Done', count: 45, tone: 'success' },
    { key: 'failed', label: 'Failed', count: 2, tone: 'destructive' },
  ],
  history: (
    <StatusBar fill size="sm" label="Last 20 results of Nightly backup" cells={results([6, 15])} />
  ),
  source: 'Every day 02:00',
  updatedAt: ago(380),
};

export const RICH_CARDS = [requestsCard, errorsCard, latencyCard, backupCard];
