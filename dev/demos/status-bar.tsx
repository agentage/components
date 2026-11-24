'use client';
import { useState } from 'react';
import { StatusBar, type StatusBarCell, type StatusBarTone } from '../../src';
import { Block } from '../components/demo';
import { RESULT_TICK, type ResultStatus } from '../lib/result-status';
import { dayCells, SERVICES_UPTIME } from '../lib/uptime-data';

const HISTORY: ResultStatus[] = [
  'succeeded',
  'succeeded',
  'failed',
  'succeeded',
  'skipped',
  'succeeded',
  'timed-out',
  'succeeded',
  'canceled',
  'succeeded',
  'queued',
  'succeeded',
];

const results = (list: ResultStatus[], onClick?: (i: number) => void): StatusBarCell[] =>
  list.map((status, i) => ({
    tone: RESULT_TICK[status],
    label: `Backup ${String(130 + i)}, ${status.replace('-', ' ')}`,
    onClick: onClick && (() => onClick(130 + i)),
  }));

export const Example = () => (
  <Block caption="One tick per day, newest on the right. Hover or focus a tick for its tooltip; arrow keys move between ticks.">
    <div className="w-full max-w-2xl">
      <StatusBar
        fill
        name="Public API"
        summary="99.98%"
        label="Last 45 days of Public API"
        cells={dayCells(45, 3)}
      />
    </div>
  </Block>
);

const TONES: [StatusBarTone, string][] = [
  ['success', 'Up'],
  ['warning', 'Degraded: shorter'],
  ['destructive', 'Down: notched'],
  ['info', 'Maintenance'],
  ['primary', 'In progress'],
  ['muted', 'Skipped: short'],
  ['pending', 'Waiting: hollow'],
  ['empty', 'No data: faint'],
];

export const Variants = () => (
  <Block caption="Each state differs by shape as well as colour, so the bar reads without colour.">
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {TONES.map(([tone, label]) => (
        <span key={tone} className="flex items-center gap-2 text-xs text-muted-foreground">
          <StatusBar label={label} cells={[{ tone, label }]} />
          {label}
        </span>
      ))}
    </div>
  </Block>
);

export const Sizes = () => (
  <div className="space-y-5">
    <Block caption="Size md has 7 by 28 px ticks for a status page or a monitor.">
      <StatusBar label="Last 30 days" cells={dayCells(30, 1)} />
    </Block>
    <Block caption="Size sm is a compact strip; slots pads the left with no-data ticks.">
      <StatusBar
        size="sm"
        label="Last 12 results of Nightly backup"
        cells={results(HISTORY.slice(4))}
        slots={12}
      />
    </Block>
  </div>
);

export const States = () => {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <Block caption="Ticks with onClick are buttons. A pulsing tick marks a result that is still in progress.">
      <div className="flex items-center gap-4">
        <StatusBar
          size="sm"
          label="Open one result"
          cells={[
            ...results(HISTORY.slice(0, 7), setPicked),
            { tone: 'primary', label: 'Backup 137, in progress', pulse: true },
          ]}
        />
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {picked === null ? 'Click a tick' : `Opened backup ${String(picked)}`}
        </span>
      </div>
    </Block>
  );
};

export const Composition = () => (
  <Block caption="A status matrix is rows of StatusBar with one tick width: the columns line up, and the name column stays in place when the matrix scrolls sideways.">
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
      <div className="w-max min-w-full">
        <div className="sticky top-0 flex h-8 items-center border-b border-border text-xs text-muted-foreground">
          <span className="sticky left-0 z-10 w-40 shrink-0 bg-card px-3">Service</span>
          <span className="flex w-[479px] justify-between pr-1">
            <span>60 days ago</span>
            <span>30 days ago</span>
            <span>Today</span>
          </span>
        </div>
        {SERVICES_UPTIME.map((s) => (
          <div
            key={s.name}
            className="flex h-9 items-center border-b border-border last:border-b-0"
          >
            <span className="sticky left-0 z-10 w-40 shrink-0 truncate bg-card px-3 text-ui">
              {s.name}
            </span>
            <StatusBar label={`Last 60 days of ${s.name}`} cells={dayCells(60, s.seed)} />
            <span className="px-3 text-xs tabular-nums text-muted-foreground">{s.uptime}</span>
          </div>
        ))}
      </div>
    </div>
  </Block>
);
