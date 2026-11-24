'use client';
import { useState } from 'react';
import { Slider } from '../../src';
import { Block } from '../components/demo';

export const Example = () => {
  const [value, setValue] = useState(40);
  return (
    <Block caption="Drag the thumb or use the arrow keys.">
      <div className="max-w-sm space-y-2">
        <Slider value={value} onValueChange={setValue} aria-label="Volume" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>{value}</span>
          <span>100</span>
        </div>
      </div>
    </Block>
  );
};

export const Variants = () => (
  <Block caption="Min, max and step set the range; this one spans 0 to 10 in steps of 2.">
    <div className="max-w-sm">
      <Slider defaultValue={4} min={0} max={10} step={2} aria-label="Priority level" />
    </div>
  </Block>
);

export const States = () => (
  <div className="max-w-sm space-y-5">
    <Block caption="Error marks the thumb as invalid.">
      <Slider error defaultValue={90} aria-label="Limit" />
    </Block>
    <Block caption="Disabled dims the slider and ignores input.">
      <Slider disabled defaultValue={30} aria-label="Locked limit" />
    </Block>
  </div>
);
