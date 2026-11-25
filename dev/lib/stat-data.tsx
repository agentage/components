import {
  CardMeta,
  DescriptionDetail,
  DescriptionList,
  DescriptionTerm,
  MiniBars,
  Progress,
  Sparkline,
  StatusBar,
  type ProgressSegment,
  type StatCardProps,
} from '../../src';
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

/** A facts row: two to four small label and value pairs. */
export const Facts = ({ facts }: { facts: [string, string][] }) => (
  <DescriptionList variant="inline">
    {facts.map(([label, value]) => (
      <div key={label}>
        <DescriptionTerm>{label}</DescriptionTerm>
        <DescriptionDetail>{value}</DescriptionDetail>
      </div>
    ))}
  </DescriptionList>
);

export const Breakdown = ({ segments }: { segments: ProgressSegment[] }) => (
  <Progress segments={segments} legend />
);

export const requestsCard: StatCardProps = {
  title: 'Requests',
  value: '48.2k',
  trend: { value: '+6.1%', direction: 'up' },
  hint: '45.4k yesterday, last 24 h',
  children: (
    <>
      <Sparkline
        data={REQUESTS}
        showLastDot
        chartLabel="Requests per hour, rising from 31 to 61 thousand."
      />
      <Facts
        facts={[
          ['Peak', '3.1k/min'],
          ['Median', '1.9k/min'],
          ['Low', '0.4k/min'],
        ]}
      />
    </>
  ),
  footer: <CardMeta source="Edge gateway" updatedAt={ago(2)} />,
};

export const errorsCard: StatCardProps = {
  title: 'Error rate',
  value: '0.42%',
  trend: { value: '+0.08 pt', direction: 'up', sentiment: 'down-is-good' },
  hint: '0.34% yesterday, last 24 h',
  children: (
    <>
      <MiniBars
        data={ERRORS}
        tone="destructive"
        chartLabel="Errors per hour, highest in the last hour."
      />
      <Breakdown
        segments={[
          { key: 'client', label: 'Client errors', count: 312, tone: 'warning' },
          { key: 'server', label: 'Server errors', count: 41, tone: 'destructive' },
          { key: 'timeout', label: 'Timeouts', count: 9, tone: 'muted' },
        ]}
      />
    </>
  ),
  footer: <CardMeta source="Edge gateway" updatedAt={ago(2)} />,
};

export const latencyCard: StatCardProps = {
  title: 'Response time',
  value: '182 ms',
  trend: { value: '-12 ms', direction: 'down', sentiment: 'down-is-good' },
  hint: '194 ms yesterday, p95 over 24 h',
  children: (
    <>
      <Facts
        facts={[
          ['p50', '96 ms'],
          ['p95', '182 ms'],
          ['p99', '410 ms'],
        ]}
      />
      <StatusBar fill size="sm" label="Last 24 checks of Response time" cells={checkCells(24)} />
    </>
  ),
  footer: <CardMeta source="Region: EU West" updatedAt={ago(4)} />,
};

export const backupCard: StatCardProps = {
  title: 'Nightly backup',
  value: '96%',
  trend: { value: '+3 pt', direction: 'up' },
  hint: '93% last month, last 30 days',
  children: (
    <>
      <Breakdown
        segments={[
          { key: 'done', label: 'Done', count: 45, tone: 'success' },
          { key: 'failed', label: 'Failed', count: 2, tone: 'destructive' },
        ]}
      />
      <StatusBar
        fill
        size="sm"
        label="Last 20 results of Nightly backup"
        cells={results([6, 15])}
      />
    </>
  ),
  footer: <CardMeta source="Every day 02:00" updatedAt={ago(380)} />,
};

export const RICH_CARDS = [requestsCard, errorsCard, latencyCard, backupCard];
