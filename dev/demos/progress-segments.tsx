'use client';
import { useState } from 'react';
import { Button, Progress, type ProgressSegment } from '../../src';
import { Block } from '../components/demo';
import { STATUS_LABEL, StatusIcon, type ItemStatus } from '../lib/items-data';

const TONE = {
  backlog: 'muted',
  todo: 'subtle',
  progress: 'primary',
  review: 'info',
  done: 'success',
} as const;

type Counts = Record<keyof typeof TONE, number>;
const START: Counts = { backlog: 1, todo: 2, progress: 1, review: 1, done: 2 };

const segments = (c: Counts): ProgressSegment[] =>
  (Object.keys(TONE) as (keyof typeof TONE)[]).map((k) => ({
    key: k,
    label: STATUS_LABEL[k as ItemStatus],
    count: c[k],
    tone: TONE[k],
    glyph: <StatusIcon status={k as ItemStatus} />,
  }));

const SegExample = () => (
  <Block
    caption="Segments are an 8 px bar sized by count, with a legend of glyph, name and count."
    className="max-w-[520px]"
  >
    <Progress segments={segments(START)} legend />
  </Block>
);

const SegVariants = () => (
  <div className="space-y-5">
    <Block
      caption="Without a legend the bar uses semantic tones only; screen readers get a text summary."
      className="max-w-[320px]"
    >
      <Progress
        segments={[
          { key: 'ok', label: 'Passed', count: 39, tone: 'success' },
          { key: 'fail', label: 'Failed', count: 2, tone: 'destructive' },
          { key: 'skip', label: 'Skipped', count: 4, tone: 'muted' },
        ]}
      />
    </Block>
  </div>
);

const SegStates = () => {
  const [c, setC] = useState(START);
  const step = () =>
    setC((x) =>
      x.todo > 0
        ? { ...x, todo: x.todo - 1, progress: x.progress + 1 }
        : x.progress > 0
          ? { ...x, progress: x.progress - 1, done: x.done + 1 }
          : START
    );
  return (
    <Block caption="Counts animate: move an item and the segments slide. A zero segment shrinks to nothing and keeps its node.">
      <div className="max-w-[520px] space-y-3">
        <Progress segments={segments(c)} legend />
        <Button variant="outline" onClick={step}>
          Move one item forward
        </Button>
      </div>
    </Block>
  );
};

/** Progress with `segments`: the part-of-whole bar. */
export const Segments = () => (
  <div className="space-y-5">
    <SegExample />
    <SegVariants />
    <SegStates />
  </div>
);
