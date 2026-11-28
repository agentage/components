'use client';
import { ToolCall } from '../../src';
import { Block } from '../components/demo';
import { PULLS_INPUT, PULLS_OUTPUT } from '../lib/chat-data';

const COL = 'flex max-w-[460px] flex-col gap-1.5';

export const Example = () => (
  <Block
    caption="One 32 px row: status, name with the server dimmed, summary and duration. Open it for the input and output."
    className={COL}
  >
    <ToolCall
      name="repos.list_pulls"
      summary="merged since v14.0.0"
      status="succeeded"
      duration="1.7 s"
      input={PULLS_INPUT}
      output={PULLS_OUTPUT}
      defaultOpen
    />
  </Block>
);

export const States = () => (
  <Block
    caption="Running, succeeded, failed and waiting. A failed call shows its error in the danger tone."
    className={COL}
  >
    <ToolCall name="repos.compare" summary="v14.0.0...master" status="running" />
    <ToolCall
      name="tasks.search"
      summary="label: release, open"
      status="succeeded"
      duration="0.8 s"
      input={{ limit: 10 }}
      output={[]}
    />
    <ToolCall
      name="repos.get_pull"
      summary="Not found"
      status="failed"
      duration="0.8 s"
      input={{ number: 418 }}
      output="404: pull request #418 was closed without a merge"
      defaultOpen
    />
    <ToolCall name="chat.post_message" summary="#releases" status="waiting" />
  </Block>
);
