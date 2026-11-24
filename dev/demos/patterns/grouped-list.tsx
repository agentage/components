'use client';
import { useState } from 'react';
import {
  Badge,
  DataTable,
  DisplayMenu,
  FilterMenu,
  ActiveFilters,
  ListToolbar,
  ListToolbarEnd,
  StatusGlyph,
  ToolbarSearch,
  ToolbarToggle,
  useListControls,
  type DataTableColumn,
  type ListApplyConfig,
  type ListFilterGroup,
  RelativeTime,
} from '../../../src';
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
const OUTCOME_TONE = {
  delivered: 'outline-success',
  'needs-review': 'outline-primary',
  blocked: 'outline-destructive',
} as const;
const nameOf = (id: string) => serviceById(id)?.name ?? id;
const ownerOf = (e: DemoEvent) => serviceById(e.serviceId)?.owner ?? 'Nobody';
const MUTED = 'text-xs text-muted-foreground';
const STATUSES = [...new Set(EVENTS.map((e) => e.status))];

const CONFIG: ListApplyConfig<DemoEvent> = {
  search: (e) => `${e.id} ${e.summary} ${e.question ?? ''} ${nameOf(e.serviceId)}`,
  filters: { status: (e) => e.status },
  flags: { needs: needsAttention },
  sorts: { ago: (e) => e.ago },
  groups: {
    day: (e) => dayOf(e.ago),
    owner: (e) => ({ key: ownerOf(e), label: ownerOf(e) }),
    status: (e) => ({ key: e.status, label: RESULT_GLYPH[e.status].label }),
  },
};

const FILTERS: ListFilterGroup[] = [
  {
    id: 'status',
    label: 'Status',
    options: STATUSES.map((s) => ({
      value: s,
      label: RESULT_GLYPH[s].label,
      icon: <StatusGlyph {...RESULT_GLYPH[s]} label={undefined} />,
      count: EVENTS.filter((e) => e.status === s).length,
    })),
  },
];

const COLUMNS: DataTableColumn<DemoEvent>[] = [
  {
    key: 'id',
    header: 'Event',
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
    header: 'Service',
    className: 'min-w-34',
    hideBelow: 760,
    cell: (e) => (
      <span className="block truncate text-muted-foreground">{nameOf(e.serviceId)}</span>
    ),
  },
  {
    key: 'summary',
    header: 'Summary',
    grow: true,
    cell: (e) => (
      <span className={e.question ? 'truncate text-primary-emphasis' : 'truncate'}>
        {e.question ?? e.summary}
      </span>
    ),
  },
  {
    key: 'trigger',
    header: 'Trigger',
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
    header: 'Outcome',
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
    header: 'Started',
    className: 'min-w-16',
    align: 'right',
    nowrap: true,
    cell: (e) => <RelativeTime value={LOADED - e.ago * 60_000} className={MUTED} />,
  },
  {
    key: 'duration',
    header: 'Duration',
    className: 'min-w-18',
    align: 'right',
    nowrap: true,
    hideBelow: 880,
    cell: (e) => <span className={MUTED}>{e.duration}</span>,
  },
];

export const Example = () => {
  const [opened, setOpened] = useState<string | null>(null);
  const c = useListControls({ groupBy: 'day', sort: { key: 'ago', dir: 'asc' } });
  const { state } = c;
  const result = c.apply(EVENTS, CONFIG);
  const needs = state.flags.needs ?? false;
  return (
    <Block caption="Events grouped by day under sticky headers; click a header to collapse it.">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <ListToolbar aria-label="Event controls">
          <ToolbarSearch
            value={state.query}
            onValueChange={c.setQuery}
            placeholder="Search events"
          />
          <FilterMenu
            groups={FILTERS}
            value={state.filters}
            onToggle={c.toggleFilter}
            onClear={c.clearFilters}
          />
          <ActiveFilters groups={FILTERS} value={state.filters} onRemove={c.toggleFilter} />
          <ListToolbarEnd>
            <ToolbarToggle pressed={needs} onPressedChange={(on) => c.setFlag('needs', on)}>
              Needs attention
            </ToolbarToggle>
            <DisplayMenu
              groupOptions={[
                { value: 'day', label: 'Day' },
                { value: 'owner', label: 'Owner' },
                { value: 'status', label: 'Status' },
              ]}
              groupBy={state.groupBy}
              onGroupByChange={c.setGroupBy}
            />
          </ListToolbarEnd>
        </ListToolbar>
        <div className="h-[480px] overflow-auto">
          <DataTable
            columns={COLUMNS}
            rows={result.rows}
            showHeader={false}
            overflowX="visible"
            rowKey={(e) => e.id}
            groupBy={result.groupOf}
            groupIcon={
              state.groupBy === 'status'
                ? (k) => <StatusGlyph {...RESULT_GLYPH[k as ResultStatus]} label={undefined} />
                : undefined
            }
            onRowClick={(e) => setOpened(e.id)}
            isRowSelected={(e) => e.id === opened}
            empty={<p className="m-0 p-6 text-ui text-muted-foreground">No events match.</p>}
          />
        </div>
      </div>
    </Block>
  );
};
