'use client';
import { MultiStatCard } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="Several closely related stats in one card with a shared header. It avoids a noisy four-up row.">
    <div className="max-w-md">
      <MultiStatCard
        title="Revenue composition"
        stats={[
          { label: 'New', value: '$620K', trend: { value: '+22%', up: true } },
          { label: 'Expansion', value: '$380K', trend: { value: '+11%', up: true } },
          { label: 'Churn', value: '-$100K', trend: { value: '-4%', up: false } },
        ]}
        description="Last 12 months, monthly average"
      />
    </div>
  </Block>
);

export const Variants = () => (
  <Block caption="Four stats, with trends on only some of them.">
    <div className="max-w-md">
      <MultiStatCard
        title="Orders today"
        stats={[
          { label: 'Submitted', value: 142 },
          { label: 'In progress', value: 8 },
          { label: 'Done', value: 127, trend: { value: '+12', up: true } },
          { label: 'Failed', value: 7, trend: { value: '-3', up: true } },
        ]}
      />
    </div>
  </Block>
);
