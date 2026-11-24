'use client';
import { ScoreCard, RelativeTime } from '../../src';
import { Block } from '../components/demo';

const NPS = [
  { label: 'Detractors', from: 0, to: 30, color: 'var(--color-destructive)' },
  { label: 'Passives', from: 30, to: 50, color: 'var(--color-warning)' },
  { label: 'Promoters', from: 50, to: 100, color: 'var(--color-success)' },
];

export const Example = () => (
  <Block caption="A score from 0 to max over coloured bands. A marker shows the position and a pill names the band.">
    <div className="max-w-xs">
      <ScoreCard
        title="NPS"
        score={47}
        max={100}
        bands={NPS}
        description="Last 30 days, 482 responses"
      />
    </div>
  </Block>
);

export const Variants = () => (
  <Block caption="A custom max for a 5-point scale, and a default max of 100 for a health score.">
    <div className="grid grid-cols-2 gap-3">
      <ScoreCard
        title="CSAT"
        score={4.2}
        max={5}
        bands={[
          { label: 'Poor', from: 0, to: 2, color: 'var(--color-destructive)' },
          { label: 'OK', from: 2, to: 4, color: 'var(--color-warning)' },
          { label: 'Great', from: 4, to: 5, color: 'var(--color-success)' },
        ]}
        description="Survey average, 1.2K responses"
      />
      <ScoreCard
        title="Health"
        score={82}
        bands={[
          { label: 'Critical', from: 0, to: 50, color: 'var(--color-destructive)' },
          { label: 'Warning', from: 50, to: 75, color: 'var(--color-warning)' },
          { label: 'Healthy', from: 75, to: 100, color: 'var(--color-success)' },
        ]}
        description={
          <>
            All services checked <RelativeTime value={Date.now() - 30_000} />
          </>
        }
      />
    </div>
  </Block>
);
