'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardMeta,
  CardTitle,
  DatePicker,
  IconButton,
  PageHeader,
  StatusBar,
  type CardState,
  type DateRange,
} from '../../../src';
import { Block } from '../../components/demo';
import { ago, checkCells } from '../../lib/monitor-data';
import { UiIcon } from '../../lib/ui-icons';

interface Panel {
  id: string;
  title: string;
  state: CardState;
  value: string;
}

const PANELS: Panel[] = [
  { id: 'uptime', title: 'Uptime', state: 'ready', value: '99.98%' },
  { id: 'latency', title: 'Response time', state: 'loading', value: '182 ms' },
  { id: 'errors', title: 'Failed checks', state: 'empty', value: '0' },
  { id: 'regions', title: 'Regions', state: 'error', value: '3' },
  { id: 'jobs', title: 'Jobs waiting', state: 'stale', value: '14' },
  { id: 'checks', title: 'Checks per hour', state: 'ready', value: '1,440' },
];

const HOUR = 3_600_000;
const initial = (): DateRange => ({
  from: new Date(Date.now() - 24 * HOUR),
  to: new Date(),
  label: 'Last 24 hours',
});

export const Example = () => {
  const [range, setRange] = useState<DateRange>(initial);
  const [panels, setPanels] = useState(PANELS);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (!refreshing) return;
    const t = setTimeout(() => {
      setPanels((l) => l.map((p) => ({ ...p, state: 'ready' })));
      setRefreshing(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [refreshing]);
  const refresh = () => {
    setPanels((l) => l.map((p) => ({ ...p, state: 'loading' })));
    setRefreshing(true);
  };
  const retry = (id: string) =>
    setPanels((l) => l.map((p) => (p.id === id ? { ...p, state: 'ready' } : p)));
  return (
    <Block caption="All cards reserve the same height, so the grid never moves when a state changes. Retry fixes one card. Refresh sets every card to loading and then back to ready.">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <PageHeader title="Overview" className="border-b border-border px-4">
          <DatePicker mode="range" value={range} onValueChange={setRange} />
          <IconButton
            icon={<UiIcon name="refresh" />}
            title="Refresh all cards"
            disabled={refreshing}
            onClick={refresh}
          />
        </PageHeader>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 p-4">
          {panels.map((p) => (
            <Card
              key={p.id}
              state={p.state}
              minHeight={188}
              fallback={{
                error: { message: 'This card could not be loaded.', reference: `req-${p.id}-7c1d` },
                onRetry: () => retry(p.id),
                empty: 'No data in this period.',
              }}
            >
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xl font-semibold tabular-nums">{p.value}</div>
                <StatusBar
                  fill
                  size="sm"
                  label={`Last 24 checks of ${p.title}`}
                  cells={checkCells(24)}
                />
              </CardContent>
              <CardFooter>
                <CardMeta source="Region: EU West" updatedAt={ago(p.state === 'stale' ? 180 : 2)} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Block>
  );
};
