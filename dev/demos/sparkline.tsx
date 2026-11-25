'use client';
import { MiniBars, Progress, Sparkline, StatCard } from '../../src';
import { Block } from '../components/demo';

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid max-w-3xl grid-cols-3 gap-3">{children}</div>
);

export const Example = () => (
  <Block caption="A sparkline under the value of a StatCard shows the trend of the number above it.">
    <div className="max-w-xs">
      <StatCard title="Active users" value="8,432" trend={{ value: '+5.2%', direction: 'up' }}>
        <Sparkline
          data={[40, 55, 50, 65, 60, 72, 78, 82, 88, 92]}
          showLastDot
          chartLabel="Active users, rising over 10 days."
        />
      </StatCard>
    </div>
  </Block>
);

export const Variants = () => (
  <Block caption="MiniBars for counts per period; a tone gives the bars a meaning. Progress covers part of a target.">
    <Grid>
      <StatCard title="Orders per day" value={142}>
        <MiniBars data={[12, 18, 9, 24, 16, 22, 19, 28, 31, 25, 33, 38]} />
      </StatCard>
      <StatCard title="Errors per hour" value={61}>
        <MiniBars data={[3, 2, 4, 2, 3, 6, 5, 4, 7, 5, 6, 8]} tone="destructive" />
      </StatCard>
      <StatCard title="Storage used" value="3.2 / 5 GB" hint="64% of the plan">
        <Progress value={64} label="Storage used" />
      </StatCard>
    </Grid>
  </Block>
);

export const Composition = () => (
  <Block caption="A breakdown is a Progress with segments and a legend; the sparkline sits above it.">
    <Grid>
      <StatCard title="Services" value={42}>
        <Progress
          legend
          segments={[
            { key: 'active', label: 'Active', count: 28, tone: 'success' },
            { key: 'paused', label: 'Paused', count: 10, tone: 'warning' },
            { key: 'offline', label: 'Offline', count: 4, tone: 'muted' },
          ]}
        />
      </StatCard>
      <StatCard title="Revenue" value="$1.2M" trend={{ value: '+18%', direction: 'up' }}>
        <Sparkline data={[8, 9, 9, 10, 11, 11, 12]} chartLabel="Revenue, rising." />
      </StatCard>
    </Grid>
  </Block>
);
