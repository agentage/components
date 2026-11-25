'use client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardMeta,
  CardTitle,
  MiniBars,
  Progress,
  Sparkline,
  StatCard,
  StatusBar,
  StatusGlyph,
} from '../../src';
import { Block } from '../components/demo';
import { InfoIcon, ServerIcon, UserIcon } from '../lib/icons';
import { ago, checkCells } from '../lib/monitor-data';
import { dayCells } from '../lib/uptime-data';
import {
  backupCard,
  Breakdown,
  ERRORS,
  errorsCard,
  Facts,
  latencyCard,
  REQUESTS,
  requestsCard,
  RICH_CARDS,
} from '../lib/stat-data';

const GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';
const PAIR = 'grid grid-cols-1 gap-3 sm:grid-cols-2';
const TILE = 'flex size-6 items-center justify-center rounded-md bg-warning/10 text-warning';

export const Example = () => (
  <Block caption="Title, value, trend and one hint line; a chart, facts, a breakdown or a history strip go in as children, the source in the footer.">
    <div className={PAIR}>
      {RICH_CARDS.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="A title and a value alone keep the plain card; an icon and a hint are optional.">
      <div className={GRID}>
        <StatCard title="Documents today" value={47} />
        <StatCard
          icon={
            <span className="flex size-6 items-center justify-center rounded-md bg-success/10 text-success">
              <ServerIcon />
            </span>
          }
          title="Servers"
          value="4 / 5 online"
          hint="One is offline"
        />
        <StatCard
          icon={
            <span className="flex size-6 items-center justify-center rounded-md bg-info/10 text-info">
              <UserIcon />
            </span>
          }
          title="People"
          value={12}
          hint="Across 3 teams"
        />
      </div>
    </Block>
    <Block caption="With a chart: a Sparkline or MiniBars as a child, full width under the value.">
      <div className={GRID}>
        <StatCard title="Requests" value="48.2k">
          <Sparkline data={REQUESTS} showLastDot chartLabel="Requests per hour, rising." />
        </StatCard>
        <StatCard title="Errors" value={61}>
          <MiniBars
            data={ERRORS}
            tone="destructive"
            chartLabel="Errors per hour, highest in the last hour."
          />
        </StatCard>
        <div className="max-w-56">
          <StatCard title="Narrow card" value="1,204">
            <Sparkline data={REQUESTS} chartLabel="Rising." />
          </StatCard>
        </div>
      </div>
    </Block>
    <Block caption="With a trend: the change in the header, the earlier figure as the hint; the sentiment decides if a rise is good.">
      <div className={GRID}>
        <StatCard
          title="Signups"
          value={47}
          trend={{ value: '+12%', direction: 'up' }}
          hint="42 yesterday"
        />
        <StatCard
          title="Response time"
          value="182 ms"
          trend={{ value: '+9 ms', direction: 'up', sentiment: 'down-is-good' }}
          hint="173 ms last week"
        />
        <StatCard
          title="Queue length"
          value={14}
          trend={{ value: '-3', direction: 'down', sentiment: 'neutral' }}
          hint="17 an hour ago"
        />
      </div>
    </Block>
    <Block caption="With facts: a DescriptionList inline, one row when wide, two columns when narrow; a Progress under it.">
      <div className={GRID}>
        <StatCard title="Response time" value="182 ms">
          <Facts
            facts={[
              ['p50', '96 ms'],
              ['p95', '182 ms'],
              ['p99', '410 ms'],
            ]}
          />
        </StatCard>
        <StatCard title="Requests" value="48.2k">
          <Facts
            facts={[
              ['Peak', '3.1k/min'],
              ['Median', '1.9k/min'],
              ['Low', '0.4k/min'],
            ]}
          />
        </StatCard>
        <StatCard title="Disk" value="6.2 / 16 GB">
          <Facts
            facts={[
              ['Used', '39%'],
              ['Free', '9.8 GB'],
            ]}
          />
          <Progress value={39} label="Disk used" />
        </StatCard>
      </div>
    </Block>
    <Block caption="With a breakdown: a Progress with segments and a legend, read as one summary.">
      <div className={PAIR}>
        <StatCard title="Nightly backup" value="47 results">
          <Breakdown
            segments={[
              { key: 'done', label: 'Done', count: 45, tone: 'success' },
              { key: 'failed', label: 'Failed', count: 2, tone: 'destructive' },
            ]}
          />
        </StatCard>
        <StatCard title="Error rate" value="362 errors">
          <Breakdown
            segments={[
              { key: 'client', label: 'Client errors', count: 312, tone: 'warning' },
              { key: 'server', label: 'Server errors', count: 41, tone: 'destructive' },
              { key: 'timeout', label: 'Timeouts', count: 9, tone: 'muted' },
            ]}
          />
        </StatCard>
      </div>
    </Block>
    <Block caption="With history: a compact StatusBar of recent results; each tick names its result.">
      <div className={PAIR}>
        <StatCard
          title="Nightly backup"
          value="96%"
          icon={<StatusGlyph shape="check" tone="success" label="Last result done" />}
        >
          {backupCard.children}
        </StatCard>
        <StatCard title="Health checks" value="23 / 24" hint="Last 24 h">
          <StatusBar fill size="sm" label="Last 24 checks" cells={checkCells(24)} />
        </StatCard>
      </div>
    </Block>
  </div>
);

export const States = () => (
  <div className="space-y-5">
    <Block caption="Loading, empty and error cover the body at its ready height; stale marks the CardMeta in the footer.">
      <div className={PAIR}>
        <StatCard {...requestsCard} state="loading" />
        <StatCard {...requestsCard} state="empty" />
        <StatCard
          {...requestsCard}
          state="error"
          fallback={{
            error: { message: 'Could not load this data.', reference: 'req-7c1d' },
            onRetry: () => undefined,
          }}
        />
        <StatCard
          {...requestsCard}
          state="stale"
          footer={
            <CardMeta source="Edge gateway" updatedAt={ago(180)} onRefresh={() => undefined} />
          }
        />
      </div>
    </Block>
    <Block caption="With onClick the title is the one button; links in the footer stay separate.">
      <div className={GRID}>
        <StatCard
          icon={
            <span className={TILE}>
              <InfoIcon />
            </span>
          }
          title="Alerts"
          value={3}
          trend={{ value: '-2', direction: 'down', sentiment: 'down-is-good' }}
          hint="5 yesterday"
          onClick={() => undefined}
        />
      </div>
    </Block>
  </div>
);
const STRIP = [
  { title: 'Requests', value: '48.2k', delta: '+2.8k', up: true, data: REQUESTS },
  { title: 'Error rate', value: '0.42%', delta: '+0.08 pt', up: true, data: ERRORS, bad: true },
  { title: 'Response time', value: '182 ms', delta: '-12 ms', up: false, data: [9, 8, 8, 7, 7, 6] },
  { title: 'Uptime', value: '99.98%', delta: '+0.01 pt', up: true, data: [7, 8, 8, 9, 9, 9] },
];

const REGIONS = [
  { name: 'EU West', seed: 3, summary: '99.99%' },
  { name: 'US East', seed: 7, summary: '99.95%' },
  { name: 'Asia Pacific', seed: 11, summary: '99.81%' },
  { name: 'South America', seed: 13, summary: '99.93%' },
  { name: 'Africa', seed: 17, summary: '99.88%' },
];

export const Composition = () => (
  <div className="space-y-5">
    <Block caption="An overview strip: four cards with a value, a trend and a sparkline.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STRIP.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            trend={{
              value: s.delta,
              direction: s.up ? 'up' : 'down',
              sentiment: s.bad || s.title === 'Response time' ? 'down-is-good' : 'up-is-good',
            }}
            hint="vs yesterday"
          >
            <Sparkline data={s.data} chartLabel={`${s.title} over the last 24 hours.`} />
          </StatCard>
        ))}
      </div>
    </Block>
    <Block caption="In a dashboard grid the cards stretch to the row and keep their footers on one line.">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="grid gap-3">
          <StatCard {...latencyCard} />
          <StatCard {...errorsCard} />
        </div>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Uptime by region</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {REGIONS.map((r) => (
              <StatusBar
                key={r.name}
                fill
                name={r.name}
                summary={r.summary}
                label={`Last 30 days of ${r.name}`}
                cells={dayCells(30, r.seed)}
              />
            ))}
          </CardContent>
          <CardFooter>
            <CardMeta source="Health checks" updatedAt={ago(2)} />
          </CardFooter>
        </Card>
      </div>
    </Block>
  </div>
);
