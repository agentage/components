'use client';
import { useState } from 'react';
import { ApprovalBar, type ApprovalDecision, Button, ToolCall } from '../../src';
import { Block } from '../components/demo';
import { POST_INPUT } from '../lib/chat-data';

export const Example = () => {
  const [value, setValue] = useState<ApprovalDecision | null>(null);
  return (
    <Block
      caption="Four choices. After a decision the buttons stay where they are, disabled, with the choice marked."
      className="max-w-[460px] space-y-2"
    >
      <ToolCall
        name="chat.post_message"
        summary="#releases"
        status={value ? 'succeeded' : 'waiting'}
        input={POST_INPUT}
        defaultOpen
      >
        <ApprovalBar value={value} onValueChange={setValue}>
          Posts a message that other people can see in <b>#releases</b>.
        </ApprovalBar>
      </ToolCall>
      <Button variant="outline" onClick={() => setValue(null)}>
        Reset
      </Button>
    </Block>
  );
};

export const Sizes = () => (
  <Block caption="Below 416 px the buttons form a 2 x 2 grid, so Skip never sits alone on a line. Shown at 360 and 460 px.">
    <div className="flex flex-wrap items-start gap-4">
      {[360, 460].map((w) => (
        <div
          key={w}
          style={{ width: w, maxWidth: '100%' }}
          className="rounded-lg border border-border p-2.5"
        >
          <ApprovalBar defaultValue={w === 460 ? 'session' : null}>Writes to memory.</ApprovalBar>
        </div>
      ))}
    </div>
  </Block>
);
