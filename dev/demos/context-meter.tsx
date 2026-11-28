'use client';
import { ContextMeter, meterTone, cn } from '../../src';
import { Block, Row } from '../components/demo';

const Level = ({ value }: { value: number }) => (
  <span className="flex items-center gap-1.5 text-xs">
    <ContextMeter value={value} />
    <span className={cn('tabular-nums', meterTone(value))}>{value}%</span>
  </span>
);

export const Example = () => (
  <Block caption="A ring for the context window: neutral, warning from 75 %, danger from 90 %. The accessible name carries the percent.">
    <Row className="gap-5">
      <Level value={13} />
      <Level value={75} />
      <Level value={92} />
    </Row>
  </Block>
);

export const Sizes = () => (
  <Block caption="sm 14 px for a status strip, md 64 px for a panel.">
    <Row className="gap-5">
      <ContextMeter value={60} />
      <ContextMeter value={60} size="md" />
      <ContextMeter value={80} size="md" />
      <ContextMeter value={95} size="md" />
    </Row>
  </Block>
);
