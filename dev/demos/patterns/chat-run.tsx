'use client';
import { Conversation, Message } from '../../../src';
import { Block } from '../../components/demo';
import { ChatPanel, Composer, PresetHeader } from './chat.parts';
import { ANSWER_START, ApprovalCall, RunAnswer, RunStart } from './chat.run';

/** A run in flight, and the same run stopped on a call that needs approval. */
export const Example = () => (
  <Block caption="Left: a run with thinking, a folded group of steps, an open call, a failed call and the answer as it starts to stream. Right: the run waits on a call that posts to a channel.">
    <div className="grid gap-4 min-[960px]:grid-cols-2">
      <ChatPanel className="h-[900px]">
        <PresetHeader />
        <Conversation>
          <RunStart open="tasks" />
          <RunAnswer text={ANSWER_START} />
        </Conversation>
        <Composer
          percent={74}
          clock="0:18"
          status="running"
          onStop={() => undefined}
          placeholder="You can write the next message when the run ends"
          footer="Working"
        />
      </ChatPanel>
      <ChatPanel className="h-[900px]">
        <PresetHeader />
        <Conversation>
          <RunStart open="none" />
          <RunAnswer />
          <Message>Now I post the draft to #releases.</Message>
          <ApprovalCall />
        </Conversation>
        <Composer
          percent={75}
          clock="0:26"
          status="running"
          onStop={() => undefined}
          placeholder="Answer the approval above to go on"
          footer="Waiting for your approval"
        />
      </ChatPanel>
    </div>
  </Block>
);
