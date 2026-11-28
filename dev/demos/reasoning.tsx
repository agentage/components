'use client';
import { Reasoning } from '../../src';
import { Block } from '../components/demo';
import { THOUGHT } from '../lib/chat-data';

export const Example = () => (
  <Block caption="One 28 px line. Open it to read the thought." className="max-w-[460px]">
    <Reasoning seconds={6} defaultOpen>
      {THOUGHT}
    </Reasoning>
  </Block>
);

export const States = () => (
  <Block
    caption="Thinking N s while it runs, then Thought for N s."
    className="flex max-w-[460px] flex-col gap-1"
  >
    <Reasoning seconds={3} status="running" />
    <Reasoning seconds={6} />
  </Block>
);
