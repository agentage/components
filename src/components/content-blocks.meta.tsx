'use client';

import * as React from 'react';
import { checkSummary } from './check-list';
import { DiffStat, diffStats, diffText } from './content-block.diff';
import { toLogLine } from './log-view.model';
import type { ContentBlockData } from './content-blocks';

const Svg = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 24 24"
    className="fill-none stroke-current stroke-2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

export const ICON = {
  text: <Svg d="M4 6h16M4 12h16M4 18h10" />,
  facts: <Svg d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  steps: <Svg d="M10 6h10M10 12h10M10 18h10M4 4v4M3 18h2.5L3 21h3" />,
  checks: <Svg d="M9 11l3 3 8-8M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />,
  diff: <Svg d="M12 3v14M5 10h14M5 21h14" />,
  log: <Svg d="M4 17l6-6-6-6M12 19h8" />,
};

export const TITLE = {
  text: 'Note',
  facts: 'Details',
  steps: 'Steps',
  checks: 'Checks',
  diff: 'Changes',
  log: 'Log',
};

export const asText = (b: ContentBlockData): string => {
  switch (b.type) {
    case 'text':
      return b.text;
    case 'facts':
      return b.rows
        .map((r) => `${r.label}: ${typeof r.value === 'string' ? r.value : ''}`)
        .join('\n');
    case 'steps':
      return b.steps.map((s, i) => `${String(i + 1)}. ${s.title}`).join('\n');
    case 'checks':
      return b.rows
        .map((r) => `${r.status ?? 'ok'} ${r.label}${r.value ? ` (${r.value})` : ''}`)
        .join('\n');
    case 'diff':
      return diffText(b.files);
    case 'log':
      return b.lines.map((l, i) => toLogLine(l, i).message).join('\n');
    default:
      return '';
  }
};

export const summaryOf = (b: ContentBlockData): React.ReactNode => {
  if (b.type === 'checks') return checkSummary(b.rows.map((r) => r.status ?? 'ok'));
  if (b.type === 'diff') {
    const files = `${String(b.files.length)} ${b.files.length === 1 ? 'file' : 'files'}`;
    return (
      <>
        <DiffStat {...diffStats(b.files)} /> in {files}
      </>
    );
  }
  if (b.type === 'log') return `${String(b.lines.length)} lines`;
  if (b.type === 'steps') {
    const done = b.steps.filter((s) => s.state === 'done').length;
    return `${String(done)} of ${String(b.steps.length)} done`;
  }
  if (b.type === 'facts') return `${String(b.rows.length)} items`;
  return undefined;
};
