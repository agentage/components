'use client';
import { useState } from 'react';
import { RelativeTime } from '../../src';
import { Block } from '../components/demo';

const MIN = 60_000;
const OFFSETS: [string, number][] = [
  ['Just now', 10_000],
  ['Minutes', 5 * MIN],
  ['Hours', 3 * 60 * MIN],
  ['Days', 2 * 24 * 60 * MIN],
  ['Older than 7 days', 12 * 24 * 60 * MIN],
];

export const Example = () => {
  const [now] = useState(() => Date.now());
  return (
    <Block caption="Every RelativeTime on the page updates on one shared timer. Hover for the exact time.">
      <dl className="m-0 grid grid-cols-[160px_1fr] gap-y-2 text-ui">
        {OFFSETS.map(([label, ms]) => (
          <div key={label} className="contents">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="m-0">
              <RelativeTime value={now - ms} />
            </dd>
          </div>
        ))}
      </dl>
    </Block>
  );
};

export const Variants = () => {
  const [now] = useState(() => Date.now());
  return (
    <Block caption="Format absolute is a mono clock for logs and timelines, with the date in the title.">
      <span className="text-xs text-muted-foreground">
        <RelativeTime value={now - 42_000} format="absolute" />
      </span>
    </Block>
  );
};
