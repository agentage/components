'use client';
import { useState } from 'react';
import {
  Button,
  Chip,
  Conversation,
  DescriptionDetail,
  DescriptionList,
  DescriptionTerm,
  IconButton,
  Sheet,
} from '../../../src';
import { Block } from '../../components/demo';
import { ChatIcon, Composer, PresetHeader } from './chat.parts';
import { PROMPT, SERVERS } from '../../lib/chat-data';

// Docked on wide screens; below 760 px the docked sheet is a full-screen dialog, so start closed.
const wide = (): boolean =>
  typeof window === 'undefined' || window.matchMedia('(min-width: 761px)').matches;

const AgentPage = ({ onAsk, asking }: { onAsk: () => void; asking: boolean }) => (
  <div className="flex min-w-0 flex-1 flex-col">
    <div className="flex h-12 flex-none items-center justify-between gap-2 border-b border-border px-3">
      <span className="truncate font-mono text-ui text-muted-foreground">
        Agents / <span className="text-foreground">Release notes writer</span>
      </span>
      <Button onClick={onAsk} aria-pressed={asking} className="flex-none">
        <ChatIcon name="spark" />
        Ask
      </Button>
    </div>
    <div className="min-h-0 flex-1 overflow-auto p-4">
      <h3 className="m-0 text-xl font-bold">Release notes writer</h3>
      <p className="m-0 mt-1 max-w-[60ch] text-ui text-muted-foreground">
        Drafts the weekly release notes from merged pull requests and opens them as a pull request.
      </p>
      <DescriptionList className="mt-4 max-w-md">
        <DescriptionTerm>Model</DescriptionTerm>
        <DescriptionDetail>Large</DescriptionDetail>
        <DescriptionTerm>Next run</DescriptionTerm>
        <DescriptionDetail>in 6 d</DescriptionDetail>
        <DescriptionTerm>MCP servers</DescriptionTerm>
        <DescriptionDetail>
          <span className="flex flex-wrap gap-1">
            {SERVERS.map((s) => (
              <Chip key={s} size="sm" className="font-mono text-foreground">
                {s}
              </Chip>
            ))}
          </span>
        </DescriptionDetail>
      </DescriptionList>
    </div>
  </div>
);

export const Example = () => {
  const [open, setOpen] = useState(wide);
  const [prompt, setPrompt] = useState(PROMPT);
  return (
    <Block caption="Ask opens a docked chat beside the page. The preset chips say what it starts with; the prompt is filled and waits for Send.">
      <div className="flex h-[640px] overflow-hidden rounded-lg border border-border bg-background">
        <AgentPage onAsk={() => setOpen(!open)} asking={open} />
        <Sheet
          mode="docked"
          open={open}
          onOpenChange={setOpen}
          title="Ask on Release notes writer"
          defaultWidth={420}
          actions={
            <IconButton
              icon={<ChatIcon name="plus" />}
              aria-label="New chat"
              onClick={() => setPrompt('')}
            />
          }
        >
          <div className="-mx-[18px] -my-4 flex h-[calc(100%+32px)] flex-col">
            <PresetHeader removable />
            <Conversation>
              <div className="flex flex-col gap-1.5 py-2">
                <b className="text-sm font-semibold">Ask about Release notes writer</b>
                <p className="m-0 text-muted-foreground">
                  The chat starts with the servers and context above. Check the prompt, then send
                  it.
                </p>
              </div>
            </Conversation>
            <Composer
              percent={13}
              value={prompt}
              onValueChange={setPrompt}
              onSubmit={() => setPrompt('')}
              placeholder="Ask a follow-up"
              footer="Not sent yet"
            />
          </div>
        </Sheet>
      </div>
    </Block>
  );
};
