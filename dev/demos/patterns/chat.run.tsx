'use client';
import { useState } from 'react';
import {
  ApprovalBar,
  type ApprovalDecision,
  Markdown,
  Message,
  Reasoning,
  ToolCall,
  ToolGroup,
} from '../../../src';
import {
  ANSWER,
  EARLY_STEPS,
  PLAN,
  POST_INPUT,
  PROMPT,
  PULLS_INPUT,
  PULLS_OUTPUT,
  THOUGHT,
} from '../../lib/chat-data';

/** The first part of every run: prompt, thinking, plan and the tool steps. */
export const RunStart = ({ open = 'pulls' }: { open?: 'tasks' | 'pulls' | 'none' }) => (
  <>
    <Message from="user">{PROMPT}</Message>
    <Reasoning seconds={6}>{THOUGHT}</Reasoning>
    <Message>{PLAN}</Message>
    <ToolGroup status="succeeded" duration="3.1 s">
      {EARLY_STEPS.map((s) => (
        <ToolCall key={s.name} status="succeeded" {...s} />
      ))}
    </ToolGroup>
    <ToolCall
      name="tasks.search"
      summary="label: release, open"
      status="succeeded"
      duration="0.8 s"
      input={{ query: 'label:release state:open', limit: 10 }}
      output={[]}
      defaultOpen={open === 'tasks'}
    />
    <ToolCall
      name="repos.list_pulls"
      summary="merged since v14.0.0"
      status="succeeded"
      duration="1.7 s"
      input={PULLS_INPUT}
      output={PULLS_OUTPUT}
      defaultOpen={open === 'pulls'}
    />
    <ToolCall
      name="repos.get_pull"
      summary="Not found"
      status="failed"
      duration="0.8 s"
      input={{ repo: 'agentage/platform', number: 418 }}
      output="404: pull request #418 was closed without a merge"
    />
  </>
);

/** The answer streamed as markdown, with a code block and a table. */
export const RunAnswer = ({ text = ANSWER }: { text?: string }) => (
  <Message>
    <Markdown>{text}</Markdown>
  </Message>
);

/** The first lines of the answer, as they look while it still streams. */
export const ANSWER_START = ANSWER.slice(0, ANSWER.indexOf('\n')).trim();

/** A call that waits for the user: the approval bar sits in the open call. */
export const ApprovalCall = ({ decided }: { decided?: ApprovalDecision }) => {
  const [value, setValue] = useState<ApprovalDecision | null>(decided ?? null);
  return (
    <ToolCall
      name="chat.post_message"
      summary="#releases"
      status={value === null ? 'waiting' : value === 'skip' ? 'failed' : 'succeeded'}
      duration={value === null || value === 'skip' ? undefined : '0.9 s'}
      input={POST_INPUT}
      output={
        value === null
          ? undefined
          : value === 'skip'
            ? 'Skipped by you'
            : { ok: true, url: 'chat://releases/m/7731' }
      }
      defaultOpen
    >
      <ApprovalBar value={value} onValueChange={setValue}>
        Posts a message that other people can see in <b>#releases</b>.
      </ApprovalBar>
    </ToolCall>
  );
};
