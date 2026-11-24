'use client';
import { GaugeCard } from '../../src';
import { Block } from '../components/demo';

const pct = (n: number): string => `${n}%`;

export const Example = () => (
  <Block caption="A semicircle gauge. Use it when crossing a limit matters, such as capacity or error rate.">
    <div className="max-w-xs">
      <GaugeCard
        title="CPU"
        value={34}
        thresholds={{ warning: 60, critical: 85 }}
        format={pct}
        description="4 cores, linux/amd64"
      />
    </div>
  </Block>
);

export const Variants = () => (
  <Block caption="Threshold zones colour the arc: below warning is healthy, then warning, then critical. A custom max and format suit non-percent values.">
    <div className="grid grid-cols-3 gap-3">
      <GaugeCard
        title="Disk"
        value={72}
        thresholds={{ warning: 70, critical: 90 }}
        format={pct}
        description="11.5 of 16 GB used"
      />
      <GaugeCard
        title="Quota"
        value={93}
        thresholds={{ warning: 70, critical: 90 }}
        format={pct}
        description="Close to the limit"
      />
      <GaugeCard
        title="p99 latency"
        value={420}
        max={1000}
        thresholds={{ warning: 300, critical: 700 }}
        format={(n) => `${n} ms`}
        description="Last 5 minutes"
      />
    </div>
  </Block>
);
