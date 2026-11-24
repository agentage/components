'use client';
import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  DescriptionDetail,
  DescriptionGroup,
  DescriptionList,
  DescriptionTerm,
  Heading,
  Input,
  StatusGlyph,
  ToggleGroup,
} from '../../../src';
import { Block } from '../../components/demo';
import { KindIcon } from '../../lib/kind-icons';
import { RESULT_GLYPH, type ResultStatus } from '../../lib/result-status';
import { TimelineSteps } from '../step-list';

type Mode = 'input' | 'permission' | 'review' | 'failed';

const STATUS: Record<Mode, ResultStatus> = {
  input: 'waiting-input',
  permission: 'waiting-permission',
  review: 'succeeded',
  failed: 'failed',
};

const MODES: { value: Mode; label: string }[] = [
  { value: 'input', label: 'Question' },
  { value: 'permission', label: 'Allow or Deny' },
  { value: 'review', label: 'Review' },
  { value: 'failed', label: 'Failed' },
];

const Waiting = ({ mode }: { mode: Mode }) => {
  const [reply, setReply] = useState('');
  if (mode === 'input')
    return (
      <Alert variant="primary" title="Needs attention" className="my-3 flex-col">
        <p className="m-0 mb-2.5">Include the Friday database outage in the handover?</p>
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <Input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write an answer"
            aria-label="Answer"
          />
          <Button type="submit" disabled={!reply}>
            Send
          </Button>
        </form>
      </Alert>
    );
  if (mode === 'permission')
    return (
      <Alert
        variant="primary"
        title="Approval needed"
        className="my-3"
        actions={
          <>
            <Button>Allow</Button>
            <Button variant="outline">Deny</Button>
          </>
        }
      >
        Send the handover to <code className="font-mono text-xs">support-team@example.com</code>?
      </Alert>
    );
  return null;
};

const Outcome = ({ mode }: { mode: Mode }) => (
  <Card padding="sm" className="flex flex-col gap-2 text-ui">
    <div className="flex flex-wrap items-center gap-2 [&_svg]:size-3.5">
      <KindIcon name="send" />
      <span>Report to the support team</span>
      {mode === 'failed' ? (
        <Badge variant="outline-destructive">Blocked</Badge>
      ) : mode === 'review' ? (
        <Badge variant="outline-primary">Needs review</Badge>
      ) : (
        <Badge variant="outline-success">Delivered</Badge>
      )}
    </div>
    {mode === 'review' && (
      <div className="flex gap-2">
        <Button>Approve</Button>
        <Button variant="outline">Skip</Button>
      </div>
    )}
    {mode === 'failed' && (
      <span className="text-xs text-muted-foreground">
        The mail address does not exist. Fix it, then start again.
      </span>
    )}
  </Card>
);

export const Example = () => {
  const [mode, setMode] = useState<Mode>('input');
  const glyph = RESULT_GLYPH[STATUS[mode]];
  return (
    <Block caption="Pick a state above the pane and the header, waiting block and details follow.">
      <div className="space-y-3 rounded-lg border border-border bg-background p-4">
        <ToggleGroup
          aria-label="Event state"
          value={mode}
          onValueChange={setMode}
          columns={4}
          className="max-w-xl"
          options={MODES}
        />
        <aside
          aria-label="Event 0142"
          className="w-[380px] max-w-full rounded-lg border border-border bg-card px-4 py-3.5 text-card-foreground"
        >
          <div className="flex flex-wrap items-center gap-2 text-ui">
            <StatusGlyph {...glyph} size="md" />
            <b className="font-semibold">{glyph.label}</b>
            <a href="#service" className="text-muted-foreground hover:text-primary-emphasis">
              Shift handover
            </a>
            <span className="ml-auto flex gap-1.5">
              <Button size="sm" variant="outline-primary">
                Start again
              </Button>
              {mode === 'input' || mode === 'permission' ? (
                <Button size="sm" variant="ghost">
                  Cancel
                </Button>
              ) : null}
            </span>
          </div>
          <Waiting mode={mode} />
          <Heading as="h4" className="mb-2 mt-5">
            Outcome
          </Heading>
          <Outcome mode={mode} />
          <DescriptionGroup title="Details" className="mt-5">
            <DescriptionList labelWidth="md">
              <DescriptionTerm>Event</DescriptionTerm>
              <DescriptionDetail mono copy truncate>
                evt_0142_8f2a91c4e7
              </DescriptionDetail>
              <DescriptionTerm>Trigger</DescriptionTerm>
              <DescriptionDetail>Schedule, Mondays 08:30</DescriptionDetail>
              <DescriptionTerm>Started</DescriptionTerm>
              <DescriptionDetail>22 Nov 2026, 08:30:04</DescriptionDetail>
              <DescriptionTerm>Size</DescriptionTerm>
              <DescriptionDetail>2 KB, 1 attachment</DescriptionDetail>
              <DescriptionTerm>Folder</DescriptionTerm>
              <DescriptionDetail mono copy truncate href="#folder">
                shared/handovers/2026-11-22
              </DescriptionDetail>
            </DescriptionList>
          </DescriptionGroup>
          <Heading as="h4" className="mb-2 mt-5">
            Steps
          </Heading>
          <TimelineSteps glyphs />
        </aside>
      </div>
    </Block>
  );
};
