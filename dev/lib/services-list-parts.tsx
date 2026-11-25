'use client';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  StatusBar,
  StatusGlyph,
  Switch,
  type DataViewColumn,
  type StatusBarCell,
  RelativeTime,
} from '../../src';
import { KindIcon, type KindIconName } from './kind-icons';
import { TRIGGER_LABEL, type DemoService, type Trigger } from './services-data';
import { RESULT_GLYPH, RESULT_TICK } from './result-status';
import { ItemCard } from './item-card';

/** Docs-only: the cells, columns, filters and sorts of the services list demos. */
const LOADED = Date.now();

export const TRIGGER_ICON: Record<Trigger, KindIconName> = {
  cron: 'clock',
  event: 'spark',
  manual: 'hand',
};

export const ticks = (a: DemoService): StatusBarCell[] =>
  a.history.map((s, i) => ({
    tone: RESULT_TICK[s],
    pulse: RESULT_GLYPH[s].pulse === true,
    label: `result ${String(i + 1)}, ${RESULT_GLYPH[s].label.toLowerCase()}`,
  }));

const success = (a: DemoService): string => {
  const done = a.history.filter((s) => !RESULT_GLYPH[s].pulse && !s.startsWith('waiting'));
  if (done.length === 0) return '-';
  const ok = done.filter((s) => s === 'succeeded').length;
  return `${String(Math.round((ok / done.length) * 100))}%`;
};

type Props = { service: DemoService };

export const StateDot = ({ service: s }: Props) => (
  <StatusGlyph
    shape={s.enabled ? 'dot' : 'ring'}
    tone={s.enabled ? 'success' : 'muted'}
    label={s.enabled ? 'Enabled' : 'Paused'}
  />
);

export const TriggerCell = ({ service: s }: Props) => (
  <span className="flex min-w-0 items-center gap-1.5 [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground">
    <KindIcon name={TRIGGER_ICON[s.trigger]} />
    <span className="truncate">{s.triggerText}</span>
  </span>
);

export const LastCell = ({ service: s }: Props) => {
  const last = s.history.at(-1);
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      {last && <StatusGlyph {...RESULT_GLYPH[last]} />}
      {s.lastAgo === null ? s.lastText : <RelativeTime value={LOADED - s.lastAgo * 60_000} />}
    </span>
  );
};

const OUTCOME_TEXT = { report: 'Report', file: 'File export' } as const;

export const OutcomeCell = ({ service: s }: Props) => (
  <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground [&_svg]:size-3.5">
    {s.outcome ? (
      <>
        <KindIcon name={s.outcome === 'file' ? 'file' : 'send'} />
        <span className="truncate">{OUTCOME_TEXT[s.outcome]}</span>
      </>
    ) : (
      '-'
    )}
  </span>
);

export const serviceMenu = (a: DemoService) => (
  <>
    <DropdownMenuItem>Start now</DropdownMenuItem>
    <DropdownMenuItem>Open settings</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete {a.name}</DropdownMenuItem>
  </>
);

export const HistoryCell = ({ service: s }: Props) => (
  <StatusBar size="sm" label={`Recent results of ${s.name}`} cells={ticks(s)} slots={8} />
);

const MUTED = 'text-muted-foreground';

export const serviceColumns = (
  twoLine: boolean,
  onEnabled: (id: string, on: boolean) => void
): DataViewColumn<DemoService>[] => [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    searchable: true,
    twoLine,
    grow: true,
    cell: (a) => (
      <span className="flex min-w-0 flex-col gap-px">
        <span className="flex min-w-0 items-center gap-2 text-ui font-semibold">
          <StateDot service={a} />
          <span className="truncate">{a.name}</span>
        </span>
        {twoLine && (
          <span className={`truncate pl-4 text-xs font-normal ${MUTED}`}>{a.description}</span>
        )}
      </span>
    ),
  },
  { key: 'description', header: 'Description', visibility: 'none', searchable: true },
  { key: 'triggerText', header: 'Trigger text', visibility: 'none', searchable: true },
  {
    key: 'trigger',
    header: 'Trigger',
    hideBelow: 680,
    className: 'min-w-34',
    filter: 'multi',
    groupable: true,
    formatValue: (v) => TRIGGER_LABEL[v as Trigger],
    cell: (a) => <TriggerCell service={a} />,
  },
  {
    key: 'next',
    header: 'Next',
    nowrap: true,
    className: 'min-w-20',
    sortable: true,
    compare: (a, b) => (a.nextIn ?? 1e9) - (b.nextIn ?? 1e9) || a.name.localeCompare(b.name),
    cell: (a) => <span className={MUTED}>{a.nextText}</span>,
  },
  {
    key: 'last',
    header: 'Last result',
    nowrap: true,
    className: 'min-w-26',
    hideBelow: 560,
    sortable: true,
    compare: (a, b) => (a.lastAgo ?? 1e9) - (b.lastAgo ?? 1e9),
    cell: (a) => <LastCell service={a} />,
  },
  {
    key: 'strip',
    header: 'Recent results',
    className: 'min-w-24',
    hideBelow: 560,
    cell: (a) => <HistoryCell service={a} />,
  },
  {
    key: 'success',
    header: 'Success',
    hideBelow: 1000,
    className: 'min-w-16',
    cell: (a) => <span className={MUTED}>{success(a)}</span>,
  },
  {
    key: 'owner',
    header: 'Owner',
    searchable: true,
    hideBelow: 1100,
    className: 'min-w-28',
    filter: 'multi',
    groupable: true,
    cell: (a) => <span className={MUTED}>{a.owner}</span>,
  },
  {
    key: 'on',
    header: 'On',
    label: 'Status',
    align: 'right',
    filter: 'multi',
    groupable: true,
    value: (a) => (a.enabled ? 'enabled' : 'paused'),
    formatValue: (v) => (v === 'enabled' ? 'Enabled' : 'Paused'),
    cell: (a) => (
      <Switch
        checked={a.enabled}
        onCheckedChange={(on) => onEnabled(a.id, on)}
        aria-label={`${a.enabled ? 'Pause' : 'Enable'} ${a.name}`}
      />
    ),
  },
];

export interface ServiceCardProps {
  service: DemoService;
  selected: boolean;
  onSelectedChange: (on: boolean) => void;
  onEnabledChange: (on: boolean) => void;
  onOpen: () => void;
}

export const ServiceCard = ({ service: s, ...p }: ServiceCardProps) => (
  <ItemCard
    title={s.name}
    indicator={<StateDot service={s} />}
    description={s.description}
    facts={[
      { label: 'Trigger', value: <TriggerCell service={s} /> },
      { label: 'Next', value: s.nextText },
      { label: 'Last result', value: <LastCell service={s} /> },
      { label: 'Owner', value: s.owner },
    ]}
    footer={
      <>
        <HistoryCell service={s} />
        <span>{s.history.length} results</span>
      </>
    }
    selected={p.selected}
    onSelectedChange={p.onSelectedChange}
    enabled={s.enabled}
    onEnabledChange={p.onEnabledChange}
    menu={serviceMenu(s)}
    onOpen={p.onOpen}
  />
);
