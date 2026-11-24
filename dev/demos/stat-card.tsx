'use client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  MiniBars,
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
  ERRORS,
  errorsCard,
  latencyCard,
  REQUESTS,
  requestsCard,
  RICH_CARDS,
} from '../lib/stat-data';

const GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3';
const PAIR = 'grid grid-cols-1 gap-3 sm:grid-cols-2';

export const Example = () => (
  <Block caption="Each card carries a period, a trend, a comparison, a chart or facts, a breakdown or history, and its source.">
    <div className={PAIR}>
      {RICH_CARDS.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="A title and a value alone keep the plain card; an icon and a description are optional.">
      <div className={GRID}>
        <StatCard title="Documents today" value={47} />
        <StatCard
          icon={<ServerIcon />}
          iconColor="bg-success/10 text-success"
          title="Servers"
          value="4 / 5 online"
          description="One is offline"
        />
        <StatCard
          icon={<UserIcon />}
          iconColor="bg-info/10 text-info"
          title="People"
          value={12}
          description="Across 3 teams"
        />
      </div>
    </Block>
    <Block caption="With chart: a sparkline or mini bars at a fixed size right of the value, under it when the card is narrow.">
      <div className={GRID}>
        <StatCard
          title="Requests"
          value="48.2k"
          chart={<Sparkline data={REQUESTS} showLastDot />}
          chartLabel="Requests per hour, rising."
        />
        <StatCard
          title="Errors"
          value={61}
          chart={<MiniBars data={ERRORS} tone="destructive" />}
          chartLabel="Errors per hour, highest in the last hour."
        />
        <div className="max-w-56">
          <StatCard
            title="Narrow card"
            value="1,204"
            chart={<Sparkline data={REQUESTS} />}
            chartLabel="Rising."
          />
        </div>
      </div>
    </Block>
    <Block caption="With comparison: the earlier figure and the change; the sentiment decides if a rise is good.">
      <div className={GRID}>
        <StatCard
          title="Signups"
          value={47}
          trend={{ value: '+12%', up: true }}
          comparison={{ previous: 42, label: 'yesterday', delta: '+5' }}
        />
        <StatCard
          title="Response time"
          value="182 ms"
          trend={{ value: '+9 ms', up: true, sentiment: 'down-is-good' }}
          comparison={{ previous: '173 ms', label: 'last week', delta: '+9 ms' }}
        />
        <StatCard
          title="Queue length"
          value={14}
          trend={{ value: '-3', up: false, sentiment: 'neutral' }}
          comparison={{ previous: 17, label: 'an hour ago', delta: '-3' }}
        />
      </div>
    </Block>
    <Block caption="With facts: two to four small pairs in one row, in two columns when the card is narrow.">
      <div className={GRID}>
        <StatCard title={latencyCard.title} value={latencyCard.value} facts={latencyCard.facts} />
        <StatCard
          title={requestsCard.title}
          value={requestsCard.value}
          facts={requestsCard.facts}
        />
        <StatCard
          title="Disk"
          value="6.2 / 16 GB"
          facts={[
            { label: 'Used', value: '39%' },
            { label: 'Free', value: '9.8 GB' },
          ]}
          progress={39}
          progressLabel="Disk used"
        />
      </div>
    </Block>
    <Block caption="With breakdown: part of whole with a legend, read as one summary.">
      <div className={PAIR}>
        <StatCard title={backupCard.title} value="47 results" breakdown={backupCard.breakdown} />
        <StatCard title={errorsCard.title} value="362 errors" breakdown={errorsCard.breakdown} />
      </div>
    </Block>
    <Block caption="With history: a compact strip of recent results; each tick names its result.">
      <div className={PAIR}>
        <StatCard
          title="Nightly backup"
          value="96%"
          indicator={<StatusGlyph shape="check" tone="success" label="Last result done" />}
          history={backupCard.history}
        />
        <StatCard
          title="Health checks"
          value="23 / 24"
          period="Last 24 h"
          history={<StatusBar fill size="sm" label="Last 24 checks" cells={checkCells(24)} />}
        />
      </div>
    </Block>
  </div>
);

export const States = () => (
  <div className="space-y-5">
    <Block caption="Loading, empty and error cover the body at its ready height; stale badges the footer.">
      <div className={PAIR}>
        <StatCard {...requestsCard} state="loading" />
        <StatCard {...requestsCard} state="empty" />
        <StatCard
          {...requestsCard}
          state="error"
          error={{ message: 'Could not load this data.', reference: 'req-7c1d' }}
          onRetry={() => undefined}
        />
        <StatCard
          {...requestsCard}
          state="stale"
          updatedAt={ago(180)}
          onRefresh={() => undefined}
        />
      </div>
    </Block>
    <Block caption="Pressable renders the title as the one button; links in the footer stay separate.">
      <div className={GRID}>
        <StatCard
          pressable
          icon={<InfoIcon />}
          iconColor="bg-warning/10 text-warning"
          title="Alerts"
          value={3}
          comparison={{
            previous: 5,
            label: 'yesterday',
            delta: '-2',
            up: false,
            sentiment: 'down-is-good',
          }}
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
    <Block caption="An overview strip: four cards with a value, a comparison and a sparkline.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STRIP.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            comparison={{
              previous: 'vs yesterday',
              delta: s.delta,
              up: s.up,
              sentiment: s.bad || s.title === 'Response time' ? 'down-is-good' : 'up-is-good',
            }}
            chart={<Sparkline data={s.data} />}
            chartLabel={`${s.title} over the last 24 hours.`}
          />
        ))}
      </div>
    </Block>
    <Block caption="In a dashboard grid the cards stretch to the row and keep their footers on one line.">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="grid gap-3">
          <StatCard {...latencyCard} history={undefined} />
          <StatCard {...backupCard} history={undefined} />
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
          <CardFooter source="Health checks" updatedAt={ago(2)} />
        </Card>
      </div>
    </Block>
  </div>
);
