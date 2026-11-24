'use client';
import { Progress, UsageMeter } from '../../src';
import { Block } from '../components/demo';

const mb = (v: number, m: number) => `${String(v)} MB / ${String(m)} MB`;

export const Example = () => (
  <Block
    caption="Deprecated: UsageMeter is now a preset over Progress. The two rows below render the same meter."
    className="max-w-md space-y-4"
  >
    <UsageMeter label="Storage" value={84} max={100} formatValue={mb} />
    <Progress
      role="meter"
      labelPosition="top"
      showValue
      thresholds={{}}
      label="Storage"
      value={84}
      max={100}
      formatValue={mb}
    />
  </Block>
);
