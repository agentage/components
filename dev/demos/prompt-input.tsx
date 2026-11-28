'use client';
import { useState } from 'react';
import { IconButton, PromptInput } from '../../src';
import { Block } from '../components/demo';
import { ChatIcon } from './patterns/chat.parts';
import { PROMPT } from '../lib/chat-data';

const Attach = () => (
  <IconButton icon={<ChatIcon name="clip" />} aria-label="Add context" onClick={() => undefined} />
);

export const Example = () => {
  const [sent, setSent] = useState<string[]>([]);
  return (
    <Block
      caption="Enter sends, Shift+Enter adds a line. The field grows with the text up to 8 rows, then scrolls."
      className="max-w-[460px]"
    >
      <PromptInput
        placeholder="Ask a follow-up"
        attach={<Attach />}
        footer={sent.length ? `Sent ${String(sent.length)}` : 'Not sent yet'}
        onSubmit={(v) => setSent((s) => [...s, v])}
      />
    </Block>
  );
};

export const States = () => {
  const [running, setRunning] = useState(true);
  return (
    <div className="max-w-[460px] space-y-5">
      <Block caption="Filled: the text waits for Send.">
        <PromptInput defaultValue={PROMPT} attach={<Attach />} footer="Not sent yet" />
      </Block>
      <Block caption="Running: Send turns into Stop, and Enter does not send.">
        <PromptInput
          status={running ? 'running' : 'ready'}
          onStop={() => setRunning(false)}
          placeholder="You can write the next message when the run ends"
          attach={<Attach />}
          footer={running ? 'Working' : 'Stopped'}
        />
      </Block>
    </div>
  );
};
