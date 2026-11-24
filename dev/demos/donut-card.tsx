'use client';
import { DonutCard } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="A donut shows composition, such as a storage breakdown. It pairs with a legend, and the centre label is optional.">
    <div className="max-w-sm">
      <DonutCard
        title="Storage by type"
        segments={[
          { label: 'Documents', value: 1240, color: 'var(--color-primary)' },
          { label: 'Images', value: 820, color: 'var(--color-info)' },
          { label: 'Attachments', value: 380, color: 'var(--color-warning)' },
          { label: 'Other', value: 110, color: 'var(--color-muted-foreground)' },
        ]}
        centerLabel="2.55 GB"
        centerSubLabel="of 5 GB"
      />
    </div>
  </Block>
);

export const Variants = () => (
  <Block caption="Segment colours come from semantic tokens. A source mix with a different centre label.">
    <div className="grid grid-cols-2 gap-3">
      <DonutCard
        title="Traffic source"
        segments={[
          { label: 'Direct', value: 42, color: 'var(--color-primary)' },
          { label: 'Search', value: 28, color: 'var(--color-info)' },
          { label: 'Referral', value: 18, color: 'var(--color-success)' },
          { label: 'Social', value: 12, color: 'var(--color-warning)' },
        ]}
        centerLabel="14.2K"
        centerSubLabel="visits in 7 days"
      />
      <DonutCard
        title="Status split"
        segments={[
          { label: 'Done', value: 64, color: 'var(--color-success)' },
          { label: 'In progress', value: 22, color: 'var(--color-info)' },
          { label: 'Failed', value: 6, color: 'var(--color-destructive)' },
        ]}
      />
    </div>
  </Block>
);
