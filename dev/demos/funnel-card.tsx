'use client';
import { FunnelCard } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="A vertical funnel with the drop-off between stages. Bar width is relative to the top of the funnel.">
    <div className="max-w-md">
      <FunnelCard
        title="Signup to paid"
        stages={[
          { label: 'Landing visit', value: 18420 },
          { label: 'Signup started', value: 4210 },
          { label: 'Email verified', value: 3680 },
          { label: 'First report created', value: 2140 },
          { label: 'Paid subscriber', value: 312 },
        ]}
      />
    </div>
  </Block>
);

export const Variants = () => (
  <Block caption="A shorter funnel with small counts.">
    <div className="max-w-md">
      <FunnelCard
        title="Hiring pipeline"
        stages={[
          { label: 'Applications', value: 264 },
          { label: 'Phone screen', value: 71 },
          { label: 'Onsite', value: 22 },
          { label: 'Offer extended', value: 8 },
          { label: 'Hired', value: 5 },
        ]}
      />
    </div>
  </Block>
);
