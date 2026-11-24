import {
  applyListControls,
  type ListApplyConfig,
  type ListControlsState,
  type ListFilterGroup,
} from '../../src';
import type { ResultStatus } from './result-status';

/** Docs-only sample services and their recent events for the list pattern demos. */
export type Trigger = 'cron' | 'event' | 'manual';
export type OutcomeState = 'delivered' | 'needs-review' | 'blocked';

export interface DemoService {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: Trigger;
  triggerText: string;
  /** Minutes until the next start; null when there is none. */
  nextIn: number | null;
  nextText: string;
  /** Minutes since the last start; null when it never started. */
  lastAgo: number | null;
  lastText: string;
  history: ResultStatus[];
  outcome: 'report' | 'file' | null;
  owner: string;
}

export interface DemoEvent {
  id: string;
  serviceId: string;
  status: ResultStatus;
  summary: string;
  question?: string;
  trigger: Trigger;
  /** Minutes ago. */
  ago: number;
  agoText: string;
  duration: string;
  size: string;
  outcome?: OutcomeState;
}

export const TRIGGER_LABEL: Record<Trigger, string> = {
  cron: 'Schedule',
  event: 'Event',
  manual: 'Manual',
};

export const OUTCOME_LABEL: Record<OutcomeState, string> = {
  delivered: 'Delivered',
  'needs-review': 'Needs review',
  blocked: 'Blocked',
};

const S = (s: DemoService): DemoService => s;

export const SERVICES: DemoService[] = [
  S({
    id: 'nightly-backup',
    name: 'Nightly backup',
    description: 'Copies the document store to cold storage every night',
    enabled: true,
    trigger: 'cron',
    triggerText: 'Every day 02:00',
    nextIn: 1140,
    nextText: 'in 19 h',
    lastAgo: 180,
    lastText: '3 h ago',
    history: ['succeeded', 'succeeded', 'succeeded', 'skipped', 'succeeded', 'failed'],
    outcome: 'file',
    owner: 'Platform',
  }),
  S({
    id: 'record-sync',
    name: 'Record sync',
    description: 'Copies new customer records into the reporting database',
    enabled: true,
    trigger: 'event',
    triggerText: 'On record created',
    nextIn: null,
    nextText: 'On event',
    lastAgo: 1,
    lastText: 'now',
    history: ['succeeded', 'succeeded', 'timed-out', 'succeeded', 'succeeded', 'active'],
    outcome: null,
    owner: 'Platform',
  }),
  S({
    id: 'release-report',
    name: 'Release report',
    description: 'Writes the release summary when a version ships and waits for a review',
    enabled: true,
    trigger: 'event',
    triggerText: 'On version shipped',
    nextIn: null,
    nextText: 'On event',
    lastAgo: 42,
    lastText: '42 min ago',
    history: ['succeeded', 'succeeded', 'waiting-permission'],
    outcome: 'report',
    owner: 'Documentation',
  }),
  S({
    id: 'invoice-export',
    name: 'Invoice export',
    description: 'Exports the invoices of the week to one spreadsheet',
    enabled: false,
    trigger: 'cron',
    triggerText: 'Fridays 16:07',
    nextIn: null,
    nextText: 'Paused',
    lastAgo: 4320,
    lastText: '3 d ago',
    history: ['succeeded', 'failed', 'succeeded', 'canceled'],
    outcome: 'file',
    owner: 'Finance',
  }),
  S({
    id: 'shift-handover',
    name: 'Shift handover',
    description: 'Asks the person on duty what to include, then writes the handover',
    enabled: true,
    trigger: 'cron',
    triggerText: 'Mondays 08:30',
    nextIn: 2900,
    nextText: 'in 2 d',
    lastAgo: 95,
    lastText: '1 h ago',
    history: ['succeeded', 'succeeded', 'waiting-input'],
    outcome: 'report',
    owner: 'Support',
  }),
  S({
    id: 'link-check',
    name: 'Link check',
    description: 'Finds broken links in the help center',
    enabled: true,
    trigger: 'cron',
    triggerText: 'Every 6 h',
    nextIn: 75,
    nextText: 'in 1 h',
    lastAgo: 285,
    lastText: '5 h ago',
    history: ['succeeded', 'succeeded', 'succeeded', 'succeeded', 'succeeded', 'succeeded'],
    outcome: null,
    owner: 'Documentation',
  }),
  S({
    id: 'support-digest',
    name: 'Support digest',
    description: 'Weekly summary of support tickets by theme',
    enabled: false,
    trigger: 'manual',
    triggerText: 'Manual',
    nextIn: null,
    nextText: 'Manual',
    lastAgo: null,
    lastText: 'Not started',
    history: [],
    outcome: 'report',
    owner: 'Support',
  }),
];

export const serviceById = (id: string): DemoService | undefined =>
  SERVICES.find((a) => a.id === id);

const E = (e: DemoEvent): DemoEvent => e;

export const EVENTS: DemoEvent[] = [
  E({
    id: '0157',
    serviceId: 'record-sync',
    status: 'active',
    summary: 'Copying record 812',
    trigger: 'event',
    ago: 1,
    agoText: 'now',
    duration: '12s',
    size: '4 KB',
  }),
  E({
    id: '0156',
    serviceId: 'release-report',
    status: 'waiting-permission',
    summary: 'Report ready',
    question: 'Publish the 2.4 release report to the help center?',
    trigger: 'event',
    ago: 42,
    agoText: '42 min',
    duration: '1m 05s',
    size: '18 KB',
    outcome: 'needs-review',
  }),
  E({
    id: '0155',
    serviceId: 'shift-handover',
    status: 'waiting-input',
    summary: 'Waiting',
    question: 'Include the Friday database outage in the handover?',
    trigger: 'cron',
    ago: 95,
    agoText: '1 h',
    duration: '38s',
    size: '2 KB',
  }),
  E({
    id: '0154',
    serviceId: 'nightly-backup',
    status: 'failed',
    summary: 'Copy written, upload to cold storage failed',
    trigger: 'cron',
    ago: 180,
    agoText: '3 h',
    duration: '44s',
    size: '1.2 GB',
    outcome: 'blocked',
  }),
  E({
    id: '0153',
    serviceId: 'link-check',
    status: 'succeeded',
    summary: 'No broken links in 412 pages',
    trigger: 'cron',
    ago: 285,
    agoText: '5 h',
    duration: '2m 10s',
    size: '36 KB',
  }),
  E({
    id: '0152',
    serviceId: 'record-sync',
    status: 'succeeded',
    summary: 'Copied record 809',
    trigger: 'event',
    ago: 340,
    agoText: '6 h',
    duration: '9s',
    size: '3 KB',
    outcome: 'delivered',
  }),
  E({
    id: '0151',
    serviceId: 'record-sync',
    status: 'timed-out',
    summary: 'The reporting database did not answer in 60s',
    trigger: 'event',
    ago: 1500,
    agoText: '1 d',
    duration: '1m 00s',
    size: '0 KB',
  }),
  E({
    id: '0150',
    serviceId: 'nightly-backup',
    status: 'succeeded',
    summary: 'Copied 23 folders',
    trigger: 'cron',
    ago: 1620,
    agoText: '1 d',
    duration: '41s',
    size: '1.1 GB',
    outcome: 'delivered',
  }),
  E({
    id: '0149',
    serviceId: 'link-check',
    status: 'succeeded',
    summary: 'Fixed 2 links in the setup guide',
    trigger: 'cron',
    ago: 1700,
    agoText: '1 d',
    duration: '2m 31s',
    size: '35 KB',
    outcome: 'delivered',
  }),
  E({
    id: '0148',
    serviceId: 'release-report',
    status: 'succeeded',
    summary: 'Published the 2.3.1 report',
    trigger: 'manual',
    ago: 1880,
    agoText: '1 d',
    duration: '58s',
    size: '16 KB',
    outcome: 'delivered',
  }),
  E({
    id: '0147',
    serviceId: 'invoice-export',
    status: 'canceled',
    summary: 'Canceled by hand',
    trigger: 'manual',
    ago: 4320,
    agoText: '3 d',
    duration: '12s',
    size: '0 KB',
  }),
  E({
    id: '0146',
    serviceId: 'nightly-backup',
    status: 'skipped',
    summary: 'No changes since the last copy',
    trigger: 'cron',
    ago: 4400,
    agoText: '3 d',
    duration: '3s',
    size: '0 KB',
  }),
  E({
    id: '0145',
    serviceId: 'invoice-export',
    status: 'failed',
    summary: 'The spreadsheet template is missing',
    trigger: 'cron',
    ago: 4500,
    agoText: '3 d',
    duration: '1m 48s',
    size: '0 KB',
    outcome: 'blocked',
  }),
];

/** Day buckets: Today, Yesterday, then the weekday. */
export const dayOf = (ago: number): { key: string; label: string } =>
  ago < 600
    ? { key: 'd0', label: 'Today' }
    : ago < 2040
      ? { key: 'd1', label: 'Yesterday' }
      : { key: 'd3', label: 'Thu, Nov 19' };

export const needsAttention = (e: DemoEvent): boolean =>
  e.status === 'waiting-input' || e.status === 'waiting-permission' || e.outcome === 'needs-review';

const STATUS_TEXT = { enabled: 'Enabled', paused: 'Paused' } as const;
const owners = [...new Set(SERVICES.map((s) => s.owner))];

/** Search, filters, sorts and groups of the services list, for `useListControls().apply`. */
export const SERVICE_CONFIG: ListApplyConfig<DemoService> = {
  search: (s) => `${s.name} ${s.description}`,
  filters: {
    status: (s) => (s.enabled ? 'enabled' : 'paused'),
    trigger: (s) => s.trigger,
    owner: (s) => s.owner,
  },
  sorts: {
    name: (s) => s.name,
    next: { compare: (a, b) => (a.nextIn ?? 1e9) - (b.nextIn ?? 1e9) },
    last: { compare: (a, b) => (a.lastAgo ?? 1e9) - (b.lastAgo ?? 1e9) },
  },
  groups: {
    status: (s) =>
      s.enabled ? { key: 'enabled', label: 'Enabled' } : { key: 'paused', label: 'Paused' },
    trigger: (s) => ({ key: s.trigger, label: TRIGGER_LABEL[s.trigger] }),
    owner: (s) => ({ key: s.owner, label: s.owner }),
  },
};

/** Filter groups with counts of the rows that pass the search and the other groups. */
export const serviceFilters = (
  rows: DemoService[],
  state: ListControlsState
): ListFilterGroup[] => {
  const opts: Record<string, [string, string][]> = {
    status: Object.entries(STATUS_TEXT),
    trigger: Object.entries(TRIGGER_LABEL),
    owner: owners.map((o) => [o, o]),
  };
  const label = { status: 'Status', trigger: 'Trigger', owner: 'Owner' } as Record<string, string>;
  return Object.entries(opts).map(([id, list]) => {
    const others = { ...state, filters: { ...state.filters, [id]: [] }, groupBy: null };
    const kept = applyListControls(rows, others, SERVICE_CONFIG).rows;
    const of = SERVICE_CONFIG.filters?.[id];
    return {
      id,
      label: label[id],
      options: list.map(([value, text]) => ({
        value,
        label: text,
        count: kept.filter((r) => of?.(r) === value).length,
      })),
    };
  });
};
