'use client';
import { useState } from 'react';
import { CheckItem, CheckList } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block
    caption="Card variant: 36 px status rows with a glyph, a label and a quiet value. The header counts the rows, and a row with children expands."
    className="max-w-xl"
  >
    <CheckList title="Checks">
      <CheckItem label="verify" value="2 min 04 s" />
      <CheckItem label="upload limit" status="fail" value="40 of 41">
        Expected status 413, received 502.
      </CheckItem>
      <CheckItem label="review" status="running" value="reading 4 files" />
      <CheckItem label="deploy" status="pending" value="waits for the checks" />
      <CheckItem label="screenshots" status="skipped" value="no UI change" />
    </CheckList>
  </Block>
);

export const Variants = () => {
  const [items, setItems] = useState([
    { t: 'Write the change', done: true },
    { t: 'Add tests', done: false },
    { t: 'Open a pull request', done: false },
  ]);
  return (
    <div className="space-y-5">
      <Block
        caption="Without a heading the list is just rows, for the body of a larger block."
        className="max-w-xl"
      >
        <CheckList className="max-w-xl">
          <CheckItem label="Rounding has a test" value="fixed" />
          <CheckItem label="Mirror never force pushes" value="fixed" />
          <CheckItem label="3 smaller findings" value="fixed" />
        </CheckList>
      </Block>
      <Block
        caption="The plain variant gives 28 px checkbox rows; a done row is muted and struck through."
        className="max-w-sm"
      >
        <CheckList variant="plain" title="Before release">
          {items.map((it, i) => (
            <CheckItem
              key={it.t}
              label={it.t}
              checked={it.done}
              onCheckedChange={(on) =>
                setItems((l) => l.map((x, j) => (j === i ? { ...x, done: on } : x)))
              }
            />
          ))}
          <CheckItem
            label="Deploy (waits for review)"
            checked={false}
            onCheckedChange={() => {}}
            disabled
          />
        </CheckList>
      </Block>
    </div>
  );
};

export const States = () => (
  <Block
    caption="Every status has its own glyph: passed, failed, in progress, pending and skipped."
    className="max-w-xl"
  >
    <CheckList title="All statuses" summary="5 states">
      <CheckItem label="Passed" status="ok" />
      <CheckItem label="Failed" status="fail" />
      <CheckItem label="In progress" status="running" />
      <CheckItem label="Pending" status="pending" />
      <CheckItem label="Skipped" status="skipped" />
    </CheckList>
  </Block>
);
