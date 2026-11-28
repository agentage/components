'use client';
import { useState } from 'react';
import { Button, Conversation, Message } from '../../src';
import { Block } from '../components/demo';

const REPLIES = [
  'The nightly gate passed on the second try.',
  'Two flaky tests timed out on the first run; both pass alone.',
  'I opened a task to raise their timeout.',
];

export const Example = () => {
  const [turns, setTurns] = useState(4);
  return (
    <Block caption="The column stays at the newest message while you are at the bottom. Scroll up and it holds still; the round button jumps back.">
      <div className="flex h-[320px] flex-col rounded-lg border border-border bg-card">
        <Conversation>
          {Array.from({ length: turns }, (_, i) =>
            i % 2 === 0 ? (
              <Message key={i} from="user">
                Did the nightly gate pass? ({String(i / 2 + 1)})
              </Message>
            ) : (
              <Message key={i}>{REPLIES[Math.floor(i / 2) % REPLIES.length]}</Message>
            )
          )}
        </Conversation>
      </div>
      <Button variant="outline" className="mt-2" onClick={() => setTurns((n) => n + 2)}>
        Add a turn
      </Button>
    </Block>
  );
};
