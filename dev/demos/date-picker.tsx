'use client';
import { useState } from 'react';
import { DatePicker, type DateRange } from '../../src';
import { Block, Row } from '../components/demo';

export const Example = () => {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <Block
      caption={`A date field with a calendar popover. Picked: ${date ? date.toLocaleDateString() : 'none'}.`}
    >
      <div className="max-w-xs">
        <DatePicker value={date} onValueChange={setDate} placeholder="Pick a date" />
      </div>
    </Block>
  );
};

export const Variants = () => {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <Block
      caption={`Range mode takes a preset, 15m, 6h, 2d, now-6h or two dates. A relative pick stays relative. Picked: ${range ? (range.expression ?? `${range.from.toLocaleString()} to ${range.to.toLocaleString()}`) : 'none'}.`}
    >
      <DatePicker mode="range" value={range} onValueChange={setRange} placeholder="Last 24 hours" />
    </Block>
  );
};

export const Sizes = () => (
  <Block caption="Size md is 30 px tall and the default; sm is 26 px.">
    <Row>
      <DatePicker size="md" placeholder="Medium" className="w-44" />
      <DatePicker size="sm" placeholder="Small" className="w-44" />
    </Row>
  </Block>
);

export const States = () => (
  <div className="max-w-xs space-y-5">
    <Block caption="Error marks the field invalid.">
      <DatePicker error placeholder="Pick a date" />
    </Block>
    <Block caption="Disabled dims the field and blocks opening.">
      <DatePicker disabled value={new Date('2026-11-22T12:00:00Z')} />
    </Block>
  </div>
);
