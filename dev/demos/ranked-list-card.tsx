'use client';
import { RankedListCard } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="A rank, a label and a value per row, with an optional hint. Use it for top teams, busiest services or hottest queries.">
    <div className="max-w-md">
      <RankedListCard
        title="Top teams by report count"
        items={[
          { label: 'Design', value: 184, hint: '2.1 s average' },
          { label: 'Support', value: 152, hint: '3.4 s average' },
          { label: 'Finance', value: 98, hint: '5.8 s average' },
          { label: 'Legal', value: 67, hint: '12.3 s average' },
          { label: 'Sales', value: 41, hint: '0.8 s average' },
        ]}
      />
    </div>
  </Block>
);

export const Variants = () => (
  <Block caption="Values can be formatted strings, such as percentages.">
    <div className="max-w-md">
      <RankedListCard
        title="Busiest services, 24 hours"
        items={[
          { label: 'billing-api', value: '94%', hint: '8 workers' },
          { label: 'search', value: '67%', hint: '5 workers' },
          { label: 'exports', value: '42%', hint: '3 workers' },
          { label: 'mailer', value: '18%', hint: '1 worker' },
        ]}
      />
    </div>
  </Block>
);
