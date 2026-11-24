'use client';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../../src';
import { Block } from '../components/demo';

export const Example = () => {
  const [value, setValue] = useState('weekly');
  return (
    <Block caption="One choice from a short list; arrow keys move the selection.">
      <RadioGroup value={value} onValueChange={setValue} aria-label="Frequency">
        <RadioGroupItem value="daily">Daily</RadioGroupItem>
        <RadioGroupItem value="weekly">Weekly</RadioGroupItem>
        <RadioGroupItem value="monthly">Monthly</RadioGroupItem>
      </RadioGroup>
    </Block>
  );
};

export const States = () => (
  <div className="space-y-5">
    <Block caption="A disabled option stays visible but cannot be picked.">
      <RadioGroup defaultValue="daily" aria-label="Frequency with disabled option">
        <RadioGroupItem value="daily">Daily</RadioGroupItem>
        <RadioGroupItem value="weekly" disabled>
          Weekly
        </RadioGroupItem>
      </RadioGroup>
    </Block>
    <Block caption="Error marks the group when no valid choice was made.">
      <RadioGroup error aria-label="Required frequency">
        <RadioGroupItem value="daily">Daily</RadioGroupItem>
        <RadioGroupItem value="weekly">Weekly</RadioGroupItem>
      </RadioGroup>
    </Block>
  </div>
);
