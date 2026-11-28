'use client';
import { useState } from 'react';
import {
  ContextMeter,
  Conversation,
  Message,
  Popover,
  ToolCall,
  meterTone,
  cn,
} from '../../../src';
import { Block } from '../../components/demo';
import { AnswerActions, ChatPanel, Composer, PresetHeader } from './chat.parts';
import { ApprovalCall, RunAnswer } from './chat.run';
import { CONTEXT_PERCENT, ContextBreakdown } from './chat.context';
import { FollowUps, OutcomeCard } from './chat.session';

/** The context ring in the strip opens the breakdown in a popover. */
const ContextButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label="Context window"
      className="w-[min(420px,calc(100vw-32px))]"
      trigger={
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-6 items-center gap-1.5 rounded-md px-1.5 hover:bg-accent hover:text-foreground focus-ring"
          aria-label={`Context window ${String(CONTEXT_PERCENT)}%, show details`}
        >
          <ContextMeter value={CONTEXT_PERCENT} aria-hidden />
          <span className={cn('min-w-[26px] tabular-nums', meterTone(CONTEXT_PERCENT))}>
            {CONTEXT_PERCENT}%
          </span>
        </button>
      }
      content={<ContextBreakdown popover />}
    />
  );
};

export const Example = () => {
  const [prompt, setPrompt] = useState('');
  return (
    <Block caption="Left: the run is done. The outcome card says what was produced and where it went, and the follow-ups fill the prompt. Right: the compact strip; the ring opens the context breakdown.">
      <div className="grid gap-4 min-[960px]:grid-cols-2">
        <ChatPanel>
          <PresetHeader />
          <Conversation>
            <ApprovalCall decided="once" />
            <ToolCall
              name="memory.write"
              summary="releases/kit-14.1.0.md"
              status="succeeded"
              duration="0.7 s"
              input={{ path: 'releases/kit-14.1.0.md' }}
              output={{ ok: true }}
            />
            <Message actions={<AnswerActions />}>
              Done. The draft is posted to #releases and saved to memory.
              <OutcomeCard />
            </Message>
            <FollowUps onPick={setPrompt} />
          </Conversation>
          <Composer
            percent={75}
            clock="0:29"
            value={prompt}
            onValueChange={setPrompt}
            onSubmit={() => setPrompt('')}
            placeholder="Ask a follow-up"
          />
        </ChatPanel>
        <ChatPanel>
          <Conversation>
            <RunAnswer />
          </Conversation>
          <Composer
            percent={CONTEXT_PERCENT}
            clock="0:29"
            meter={<ContextButton />}
            placeholder="Ask a follow-up"
          />
        </ChatPanel>
      </div>
    </Block>
  );
};
