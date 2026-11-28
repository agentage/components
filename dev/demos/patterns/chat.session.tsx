'use client';
import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  DescriptionDetail,
  DescriptionList,
  DescriptionTerm,
  StatusGlyph,
  Step,
  StepList,
  Switch,
} from '../../../src';
import { MUTED_ON_ACCENT } from '../../../src/lib/utils';
import { ChatIcon } from './chat.parts';
import { FOLLOW_UPS, PROMPT, SERVERS, SESSION_STEPS, TOOLS } from '../../lib/chat-data';

const Label = ({ children, end }: { children: string; end?: string }) => (
  <div className="flex h-5 items-center justify-between text-2xs uppercase tracking-[0.08em] text-muted-foreground">
    <span>{children}</span>
    {end && <span>{end}</span>}
  </div>
);

/** What the run produced, and where it went. */
export const OutcomeCard = () => (
  <Card padding="sm" className="gap-2">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <StatusGlyph shape="check" tone="success" label="Done" />
        Outcome
      </CardTitle>
    </CardHeader>
    <CardContent>
      <DescriptionList>
        <DescriptionTerm>Produced</DescriptionTerm>
        <DescriptionDetail>Release notes: kit 14.1.0, 9 changes</DescriptionDetail>
        <DescriptionTerm>Posted</DescriptionTerm>
        <DescriptionDetail>#releases in chat</DescriptionDetail>
        <DescriptionTerm>Saved</DescriptionTerm>
        <DescriptionDetail mono>releases/kit-14.1.0.md</DescriptionDetail>
      </DescriptionList>
    </CardContent>
    <CardFooter className="flex-row flex-wrap gap-1.5">
      <Button variant="outline">
        <ChatIcon name="link" />
        Open message
      </Button>
      <Button variant="outline">
        <ChatIcon name="db" />
        Open in memory
      </Button>
    </CardFooter>
  </Card>
);

/** Next prompts to try; a click puts the text in the composer. */
export const FollowUps = ({ onPick }: { onPick: (text: string) => void }) => (
  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Follow-up suggestions">
    {FOLLOW_UPS.map((f) => (
      <Chip key={f} onClick={() => onPick(f)} className="h-7 px-2.5 text-xs font-normal">
        {f}
      </Chip>
    ))}
  </div>
);

/** The servers and their tools, each one switchable. */
export const ToolsTab = () => {
  const [off, setOff] = useState<string[]>(
    TOOLS.flatMap((s) => s.off.map((t) => `${s.server}.${t}`))
  );
  const toggle = (id: string) =>
    setOff((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
  return (
    <div className="flex flex-col gap-3">
      {TOOLS.map((s) => (
        <div key={s.server} className="overflow-hidden rounded-lg border border-border">
          <div className={`flex h-8 items-center gap-2 bg-accent px-2.5 ${MUTED_ON_ACCENT}`}>
            <b className="font-mono text-xs font-semibold">{s.server}</b>
            <span className="flex-1 text-xs text-muted-foreground">
              {[...s.tools, ...s.off].filter((t) => !off.includes(`${s.server}.${t}`)).length} of{' '}
              {s.tools.length + s.off.length} on
            </span>
          </div>
          {[...s.tools, ...s.off].map((t) => {
            const id = `${s.server}.${t}`;
            return (
              <div
                key={id}
                className="flex h-7 items-center gap-2 border-t border-border pl-6 pr-2.5"
              >
                <span className="min-w-0 flex-1 truncate font-mono text-xs">{t}</span>
                <Switch
                  size="sm"
                  checked={!off.includes(id)}
                  onCheckedChange={() => toggle(id)}
                  aria-label={`Use ${id}`}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** How the chat started and every step it took. */
export const SessionTab = () => (
  <div className="flex flex-col gap-3">
    <DescriptionList>
      <DescriptionTerm>Started by</DescriptionTerm>
      <DescriptionDetail>Ask button</DescriptionDetail>
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
      <DescriptionTerm>Status</DescriptionTerm>
      <DescriptionDetail>
        <span className="flex items-center gap-1.5">
          <StatusGlyph shape="check" tone="success" />
          Done
        </span>
      </DescriptionDetail>
      <DescriptionTerm>Duration</DescriptionTerm>
      <DescriptionDetail>0:29</DescriptionDetail>
      <DescriptionTerm>Tool calls</DescriptionTerm>
      <DescriptionDetail>8, 1 failed</DescriptionDetail>
      <DescriptionTerm>Tokens</DescriptionTerm>
      <DescriptionDetail>150K in, 3.2K out</DescriptionDetail>
    </DescriptionList>
    <div>
      <Label>Prompt</Label>
      <p className="m-0 mt-1 border-l-2 border-border px-2.5 py-1.5 text-xs leading-normal">
        {PROMPT}
      </p>
    </div>
    <div className="flex flex-col gap-1">
      <Label end={String(SESSION_STEPS.length)}>Steps</Label>
      <StepList size="sm" glyphs>
        {SESSION_STEPS.map((s) => (
          <Step
            key={s.at}
            offset={s.at}
            label={s.name}
            mono
            duration={s.duration}
            status={s.ok ? 'ok' : 'error'}
          />
        ))}
      </StepList>
    </div>
  </div>
);
