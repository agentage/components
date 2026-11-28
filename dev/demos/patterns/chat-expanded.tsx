'use client';
import { useState } from 'react';
import { Conversation, Tabs, TabsContent, TabsList, TabsTrigger } from '../../../src';
import { Block } from '../../components/demo';
import { Composer, PresetHeader } from './chat.parts';
import { RunStart } from './chat.run';
import { ContextBreakdown, ContextItems } from './chat.context';
import { OutcomeCard, SessionTab, ToolsTab } from './chat.session';

const TABS = ['Context', 'Tools', 'Session', 'Outcome'] as const;

/** Expanded: the chat takes the page and the support panel sits beside it. */
export const Example = () => {
  const [tab, setTab] = useState<string>('Context');
  return (
    <Block caption="Expanded: the conversation takes the main area and the support panel shows the context window, the tools, the session and the outcome in tabs.">
      <div className="flex h-[640px] overflow-hidden rounded-lg border border-border bg-background max-[760px]:h-auto max-[760px]:flex-col">
        <div className="flex min-h-[640px] min-w-0 flex-1 flex-col">
          <PresetHeader />
          <Conversation>
            <RunStart />
          </Conversation>
          <Composer percent={75} placeholder="Ask a follow-up" className="bg-card" />
        </div>
        <aside
          aria-label="Session"
          className="flex w-[380px] flex-none flex-col border-l border-border bg-card max-[760px]:h-[640px] max-[760px]:w-full max-[760px]:border-l-0 max-[760px]:border-t"
        >
          <div className="flex h-12 flex-none items-center border-b border-border px-3.5 text-sm font-semibold">
            Session
          </div>
          <Tabs
            value={tab}
            onValueChange={setTab}
            variant="line"
            className="flex min-h-0 flex-1 flex-col"
          >
            <TabsList aria-label="Session details" className="flex-none px-2">
              {TABS.map((t) => (
                <TabsTrigger key={t} value={t}>
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="min-h-0 flex-1 overflow-auto px-3.5 pb-5 pt-3">
              <TabsContent value="Context">
                <div className="flex flex-col gap-4">
                  <ContextBreakdown />
                  <ContextItems />
                </div>
              </TabsContent>
              <TabsContent value="Tools">
                <ToolsTab />
              </TabsContent>
              <TabsContent value="Session">
                <SessionTab />
              </TabsContent>
              <TabsContent value="Outcome">
                <OutcomeCard />
              </TabsContent>
            </div>
          </Tabs>
        </aside>
      </div>
    </Block>
  );
};
