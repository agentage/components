'use client';
import {
  Avatar,
  Badge,
  DropdownMenuItem,
  RelativeTime,
  StatusGlyph,
  type DataViewColumn,
} from '../../src';
import {} from '../components/demo';
import {} from './logs-data';
import { RESULT_GLYPH, type ResultStatus } from './result-status';

export interface Build {
  id: string;
  title: string;
  status: ResultStatus;
  branch: string;
  seconds: number;
  min: number;
  author: string;
}

const STATUSES: ResultStatus[] = ['succeeded', 'failed', 'active', 'succeeded', 'canceled'];
const AUTHORS = ['Ada Park', 'Lee Moreno', 'Sam Okafor'];
const TITLES = [
  'Update the search index job',
  'Fix the retry delay',
  'Add the export button',
  'Raise the upload limit',
  'Clean up old images',
];
export const NOW = Date.now();
export const BUILDS: Build[] = Array.from({ length: 14 }, (_, i) => ({
  id: `#${String(1042 - i)}`,
  title: TITLES[i % TITLES.length],
  status: i === 0 ? 'active' : STATUSES[i % STATUSES.length],
  branch: i % 3 ? 'main' : `fix/item-${String(30 + i)}`,
  seconds: 40 + ((i * 37) % 300),
  min: 3 + i * 47,
  author: AUTHORS[i % AUTHORS.length],
}));

export const duration = (s: number) => `${String(Math.floor(s / 60))}m ${String(s % 60)}s`;
const label = (s: ResultStatus) => RESULT_GLYPH[s].label;

export const COLUMNS: DataViewColumn<Build>[] = [
  {
    key: 'status',
    header: 'Status',
    filter: 'multi',
    formatValue: (v) => label(v as ResultStatus),
    valueIcon: (v) => <StatusGlyph {...RESULT_GLYPH[v as ResultStatus]} />,
    cell: (b) => <StatusGlyph {...RESULT_GLYPH[b.status]} />,
    width: 64,
  },
  {
    key: 'title',
    header: 'Change',
    grow: true,
    cell: (b) => (
      <span className="truncate">
        <span className="mr-2 font-mono text-xs text-muted-foreground">{b.id}</span>
        {b.title}
      </span>
    ),
  },
  {
    key: 'branch',
    header: 'Branch',
    filter: 'multi',
    cell: (b) => (
      <Badge variant="outline" className="font-mono">
        {b.branch}
      </Badge>
    ),
  },
  {
    key: 'seconds',
    header: 'Duration',
    sortable: true,
    align: 'right',
    cell: (b) => <span className="tabular-nums">{duration(b.seconds)}</span>,
  },
  {
    key: 'min',
    header: 'Started',
    sortable: true,
    cell: (b) => <RelativeTime value={NOW - b.min * 60_000} className="text-muted-foreground" />,
  },
  {
    key: 'author',
    header: 'Author',
    filter: 'multi',
    hideBelow: 640,
    cell: (b) => (
      <span className="flex items-center gap-2">
        <Avatar size="xs" name={b.author} />
        {b.author}
      </span>
    ),
  },
];

export const menu = (b: Build) => (
  <>
    <DropdownMenuItem>Retry {b.id}</DropdownMenuItem>
    <DropdownMenuItem>Copy link</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Cancel</DropdownMenuItem>
  </>
);
