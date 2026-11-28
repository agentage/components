'use client';
import { ToolCall, ToolGroup } from '../../src';
import { Block } from '../components/demo';
import { EARLY_STEPS } from '../lib/chat-data';

const COL = 'flex max-w-[460px] flex-col gap-1.5';

export const Example = () => (
  <Block caption="Done: Completed N steps. Open it for one flat row per call." className={COL}>
    <ToolGroup status="succeeded" duration="3.1 s" defaultOpen>
      {EARLY_STEPS.map((s) => (
        <ToolCall key={s.name} status="succeeded" {...s} />
      ))}
    </ToolGroup>
  </Block>
);

export const States = () => (
  <Block
    caption="Running: Step N of M with the current call; failed: Stopped at step N."
    className={COL}
  >
    <ToolGroup status="running" total={3}>
      <ToolCall status="succeeded" {...EARLY_STEPS[0]!} />
      <ToolCall status="running" name="repos.list_tags" />
    </ToolGroup>
    <ToolGroup status="failed" duration="1.4 s">
      <ToolCall status="succeeded" {...EARLY_STEPS[0]!} />
      <ToolCall status="failed" name="repos.list_tags" summary="Timed out" />
    </ToolGroup>
  </Block>
);
