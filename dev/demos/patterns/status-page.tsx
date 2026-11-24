'use client';
import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Disclosure,
  GroupHeader,
  List,
  RelativeTime,
  StatusBar,
  StatusGlyph,
  type StatusGlyphProps,
} from '../../../src';
import { Block } from '../../components/demo';
import {
  INCIDENTS,
  STATE_TEXT,
  STATUS_SERVICES,
  type ServiceState,
  type StatusService,
} from '../../lib/monitor-data';
import { dayCells } from '../../lib/uptime-data';

const GLYPH: Record<ServiceState, Pick<StatusGlyphProps, 'shape' | 'tone'>> = {
  up: { shape: 'check', tone: 'success' },
  degraded: { shape: 'alert', tone: 'warning' },
  down: { shape: 'cross', tone: 'destructive' },
};

const worst = (list: StatusService[]): ServiceState =>
  list.some((s) => s.state === 'down')
    ? 'down'
    : list.some((s) => s.state === 'degraded')
      ? 'degraded'
      : 'up';

const BANNER = {
  up: { variant: 'success', title: 'All systems operational' },
  degraded: { variant: 'warning', title: 'Degraded performance' },
  down: { variant: 'destructive', title: 'Service outage' },
} as const;

const Matrix = ({ service }: { service: StatusService }) => (
  <div className="overflow-x-auto rounded-md border border-border">
    <div className="w-max min-w-full">
      <div className="flex h-8 items-center border-b border-border text-xs text-muted-foreground">
        <span className="sticky left-0 z-10 w-40 shrink-0 bg-card px-3">Component</span>
        <span className="flex w-[239px] justify-between pr-1">
          <span>30 days ago</span>
          <span>Today</span>
        </span>
      </div>
      {service.parts.map((p) => (
        <div key={p.name} className="flex h-9 items-center border-b border-border last:border-b-0">
          <span className="sticky left-0 z-10 w-40 shrink-0 truncate bg-card px-3 text-ui">
            {p.name}
          </span>
          <StatusBar label={`Last 30 days of ${p.name}`} cells={dayCells(30, p.seed)} />
        </div>
      ))}
    </div>
  </div>
);

const ServiceRow = ({
  service,
  open,
  onToggle,
}: {
  service: StatusService;
  open: boolean;
  onToggle: (open: boolean) => void;
}) => (
  <div className="py-1">
    <GroupHeader
      variant="section"
      level={3}
      label={service.name}
      icon={<StatusGlyph {...GLYPH[service.state]} label={STATE_TEXT[service.state]} />}
      summary={`${STATE_TEXT[service.state]}, ${service.uptime} uptime`}
      open={open}
      onOpenChange={onToggle}
      controls={`matrix-${service.id}`}
    />
    <div className="px-1 pb-2">
      <StatusBar
        fill
        label={`Last 30 days of ${service.name}`}
        cells={dayCells(30, service.parts[0].seed)}
      />
    </div>
    <Disclosure id={`matrix-${service.id}`} open={open} className="px-1 pb-3">
      <Matrix service={service} />
    </Disclosure>
  </div>
);

export const Example = () => {
  const [open, setOpen] = useState<string[]>([]);
  const overall = worst(STATUS_SERVICES);
  const all = open.length === STATUS_SERVICES.length;
  const set = (id: string, on: boolean) =>
    setOpen((l) => (on ? [...l, id] : l.filter((x) => x !== id)));
  return (
    <Block caption="The banner follows the worst service state. Open a row to see its components.">
      <div className="space-y-4 rounded-lg border border-border bg-background p-4">
        <Alert variant={BANNER[overall].variant} title={BANNER[overall].title}>
          {overall === 'up'
            ? 'Every service is running normally.'
            : 'One service is slower than usual.'}
        </Alert>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Services</CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpen(all ? [] : STATUS_SERVICES.map((s) => s.id))}
            >
              {all ? 'Collapse all' : 'Expand all'}
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {STATUS_SERVICES.map((s) => (
              <ServiceRow
                key={s.id}
                service={s}
                open={open.includes(s.id)}
                onToggle={(on) => set(s.id, on)}
              />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <List
              label="Recent incidents"
              items={INCIDENTS.map((i) => ({
                id: i.id,
                leading: (
                  <StatusGlyph
                    shape={i.resolved ? 'check' : 'alert'}
                    tone={i.resolved ? 'success' : 'warning'}
                    label={i.resolved ? 'Resolved' : 'Ongoing'}
                  />
                ),
                title: i.title,
                description: i.service,
                meta: <RelativeTime value={i.at} />,
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </Block>
  );
};
