'use client';
import { Badge, DataView, RelativeTime, StatusGlyph, type DataViewColumn } from '../../../src';
import { Block } from '../../components/demo';
import { KindIcon } from '../../lib/kind-icons';
import {
  dayOf,
  EVENTS,
  needsAttention,
  OUTCOME_LABEL,
  serviceById,
  TRIGGER_LABEL,
  type DemoEvent,
} from '../../lib/services-data';
import { TRIGGER_ICON } from '../../lib/services-list-parts';
import { RESULT_GLYPH, type ResultStatus } from '../../lib/result-status';

const LOADED = Date.now();
const DAY_LABEL = new Map(EVENTS.map((e) => [dayOf(e.ago).key, dayOf(e.ago).label]));
const OUTCOME_TONE = {
  delivered: 'outline-success',
  'needs-review': 'outline-primary',
  blocked: 'outline-destructive',
} as const;
const nameOf = (id: string) => serviceById(id)?.name ?? id;
const ownerOf = (e: DemoEvent) => serviceById(e.serviceId)?.owner ?? 'Nobody';
const MUTED = 'text-xs text-muted-foreground';

// No column header: the list reads as rows under day headers. Hidden columns group and filter.
const COLUMNS: DataViewColumn<DemoEvent>[] = [
  {
    key: 'id',
    searchable: true,
    header: '',
    label: 'Event',
    className: 'min-w-24',
    nowrap: true,
    cell: (e) => (
      <span className="flex items-center gap-2.5">
        <StatusGlyph {...RESULT_GLYPH[e.status]} />
        <span className="font-mono text-xs text-muted-foreground">#{e.id}</span>
      </span>
    ),
  },
  {
    key: 'service',
    header: '',
    label: 'Service',
    className: 'min-w-34',
    hideBelow: 760,
    cell: (e) => (
      <span className="block truncate text-muted-foreground">{nameOf(e.serviceId)}</span>
    ),
  },
  {
    key: 'summary',
    searchable: true,
    value: (e) => `${e.summary} ${e.question ?? ''} ${nameOf(e.serviceId)}`,
    header: '',
    label: 'Summary',
    grow: true,
    cell: (e) => (
      <span className={e.question ? 'truncate text-primary-emphasis' : 'truncate'}>
        {e.question ?? e.summary}
      </span>
    ),
  },
  {
    key: 'trigger',
    header: '',
    label: 'Trigger',
    className: 'min-w-8',
    cell: (e) => (
      <span
        className="flex text-muted-foreground [&_svg]:size-3.5"
        role="img"
        aria-label={TRIGGER_LABEL[e.trigger]}
      >
        <KindIcon name={TRIGGER_ICON[e.trigger]} />
      </span>
    ),
  },
  {
    key: 'outcome',
    searchable: true,
    value: (e) => (e.outcome ? OUTCOME_LABEL[e.outcome] : ''),
    header: '',
    label: 'Outcome',
    className: 'min-w-34',
    hideBelow: 760,
    cell: (e) => (
      <span className="block">
        {e.outcome && <Badge variant={OUTCOME_TONE[e.outcome]}>{OUTCOME_LABEL[e.outcome]}</Badge>}
      </span>
    ),
  },
  {
    key: 'ago',
    sortable: true,
    header: '',
    label: 'Started',
    className: 'min-w-16',
    align: 'right',
    nowrap: true,
    cell: (e) => <RelativeTime value={LOADED - e.ago * 60_000} className={MUTED} />,
  },
  {
    key: 'duration',
    header: '',
    label: 'Duration',
    className: 'min-w-18',
    align: 'right',
    nowrap: true,
    hideBelow: 880,
    cell: (e) => <span className={MUTED}>{e.duration}</span>,
  },
  {
    key: 'day',
    header: '',
    label: 'Day',
    visibility: 'none',
    groupable: true,
    value: (e) => dayOf(e.ago).key,
    formatValue: (k) => DAY_LABEL.get(k) ?? k,
  },
  {
    key: 'owner',
    header: '',
    label: 'Owner',
    visibility: 'none',
    groupable: true,
    value: ownerOf,
  },
  {
    key: 'status',
    header: '',
    label: 'Status',
    visibility: 'none',
    groupable: true,
    filter: 'multi',
    formatValue: (v) => RESULT_GLYPH[v as ResultStatus].label,
    valueIcon: (v) => <StatusGlyph {...RESULT_GLYPH[v as ResultStatus]} label={undefined} />,
  },
  {
    key: 'needs',
    header: '',
    label: 'Needs attention',
    visibility: 'none',
    filter: 'toggle',
    value: needsAttention,
  },
];

export const Example = () => (
  <Block caption="Events grouped by day under sticky headers; click a header to collapse it.">
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <DataView
        aria-label="Events"
        className="h-[525px]"
        rows={EVENTS}
        columns={COLUMNS}
        getRowId={(e) => e.id}
        defaultState={{ groupBy: 'day', sort: { key: 'ago', dir: 'asc' } }}
        actions={{ open: () => undefined }}
        empty={<p className="m-0 p-6 text-ui text-muted-foreground">No events match.</p>}
      />
    </div>
  </Block>
);
