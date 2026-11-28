'use client';
import { IconButton, Message } from '../../src';
import { Block } from '../components/demo';
import { ChatIcon } from './patterns/chat.parts';

export const Example = () => (
  <Block caption="A user turn is a bubble on the right; an assistant turn is flat text across the column.">
    <div className="flex max-w-[460px] flex-col gap-3">
      <Message from="user">Summarize the open pull requests.</Message>
      <Message>There are four open pull requests; two wait for review.</Message>
    </div>
  </Block>
);

export const Variants = () => (
  <Block caption="The actions slot puts small icon buttons under the message, for example Copy and Retry.">
    <div className="max-w-[460px]">
      <Message
        actions={
          <>
            <IconButton
              size="sm"
              icon={<ChatIcon name="copy" />}
              aria-label="Copy answer"
              onClick={() => undefined}
            />
            <IconButton
              size="sm"
              icon={<ChatIcon name="retry" />}
              aria-label="Retry"
              onClick={() => undefined}
            />
          </>
        }
      >
        The draft is posted to #releases.
      </Message>
    </div>
  </Block>
);
