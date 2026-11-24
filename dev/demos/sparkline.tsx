'use client';
import {
  MiniBars,
  Sparkline,
  StatBreakdown,
  StatCard,
  StatComparison,
  StatProgress,
} from '../../src';
import { Block } from '../components/demo';

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid max-w-3xl grid-cols-3 gap-3">{children}</div>
);

export const Example = () => (
  <Block caption="A sparkline in the StatCard description slot shows the trend of the number above it.">
    <div className="max-w-xs">
      <StatCard
        title="Active users"
        value="8,432"
        trend={{ value: '+5.2%', up: true }}
        description={<Sparkline data={[40, 55, 50, 65, 60, 72, 78, 82, 88, 92]} showLastDot />}
      />
    </div>
  </Block>
);

export const Variants = () => (
  <Block caption="Inline add-ons for the description slot: mini bars, a comparison with the previous period, and progress toward a target.">
    <Grid>
      <StatCard
        title="Orders per day"
        value={142}
        description={<MiniBars data={[12, 18, 9, 24, 16, 22, 19, 28, 31, 25, 33, 38]} />}
      />
      <StatCard
        title="Revenue"
        value="$48.2K"
        description={
          <StatComparison
            current={48200}
            previous={42300}
            format={(n) => `$${(n / 1000).toFixed(1)}K`}
          />
        }
      />
      <StatCard
        title="Storage used"
        value="3.2 / 5 GB"
        description={
          <StatProgress
            current={3200}
            target={5000}
            format={(n) => `${(n / 1000).toFixed(1)} GB`}
          />
        }
      />
    </Grid>
  </Block>
);

export const Composition = () => (
  <Block caption="A segmented breakdown, with its legend or without it.">
    <Grid>
      <StatCard
        title="Services"
        value={42}
        description={
          <StatBreakdown
            segments={[
              { label: 'Active', value: 28, color: 'bg-success' },
              { label: 'Paused', value: 10, color: 'bg-warning' },
              { label: 'Offline', value: 4, color: 'bg-muted-foreground/60' },
            ]}
          />
        }
      />
      <StatCard
        title="Revenue by source"
        value="$1.2M"
        trend={{ value: '+18%', up: true }}
        description={
          <StatBreakdown
            showLegend={false}
            segments={[
              { label: 'New', value: 620, color: 'bg-primary' },
              { label: 'Expansion', value: 380, color: 'bg-info' },
              { label: 'Churn', value: 100, color: 'bg-destructive' },
            ]}
          />
        }
      />
    </Grid>
  </Block>
);
