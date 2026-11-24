'use client';
import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Chip,
  PageHeader,
  RelativeTime,
  Step,
  StepList,
  Textarea,
  ToggleGroup,
  type StepStatus,
} from '../../../src';
import { Block } from '../../components/demo';
import { TIMELINE, type TimelineUpdate } from '../../lib/monitor-data';

type Status = TimelineUpdate['status'];

const LABEL: Record<Status, string> = {
  investigating: 'Investigating',
  identified: 'Identified',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
};

const OPTIONS = (Object.keys(LABEL) as Status[]).map((value) => ({ value, label: LABEL[value] }));
const BADGE = {
  investigating: 'outline-warning',
  identified: 'outline-warning',
  monitoring: 'outline-info',
  resolved: 'outline-success',
} as const;

const offset = (at: number, start: number): string => {
  const m = Math.round((at - start) / 60_000);
  return `+${String(Math.floor(m / 60))}:${String(m % 60).padStart(2, '0')}`;
};

const stepStatus = (u: TimelineUpdate, last: boolean): StepStatus =>
  last && u.status !== 'resolved' ? 'running' : 'ok';

const Composer = ({ onPost }: { onPost: (status: Status, text: string) => void }) => {
  const [status, setStatus] = useState<Status>('monitoring');
  const [text, setText] = useState('');
  return (
    <div className="space-y-2 border-t border-border p-4">
      <ToggleGroup
        variant="segmented"
        aria-label="Status of the update"
        options={OPTIONS}
        value={status}
        onValueChange={setStatus}
      />
      <Textarea
        aria-label="Update text"
        placeholder="Write what changed"
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        size="sm"
        disabled={text.trim() === ''}
        onClick={() => {
          onPost(status, text.trim());
          setText('');
        }}
      >
        Post update
      </Button>
    </div>
  );
};

export const Example = () => {
  const [updates, setUpdates] = useState(TIMELINE);
  const start = updates[0].at;
  const current = updates[updates.length - 1];
  const minutes = Math.max(1, Math.round((current.at - start) / 60_000));
  const post = (status: Status, text: string) =>
    setUpdates((l) => [
      ...l,
      { id: `u-${String(l.length + 1)}`, status, author: 'Ada Park', text, at: Date.now() },
    ]);
  return (
    <Block caption="Post an update to add it to the end of the timeline. The new step opens in place and the earlier steps stay where they are.">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <PageHeader
          variant="detail"
          title="Slow job pickup"
          className="border-b border-border px-4"
          meta={
            <>
              <Badge variant={BADGE[current.status]}>{LABEL[current.status]}</Badge>
              <Badge variant="warning">Minor</Badge>
              <Chip size="sm" variant="outline">
                Scheduler
              </Chip>
              <Chip size="sm" variant="outline">
                Workers
              </Chip>
              <span>{`Duration ${String(minutes)} min`}</span>
            </>
          }
        />
        <div className="p-4">
          <StepList glyphs aria-label="Incident updates">
            {updates.map((u, i) => (
              <Step
                key={u.id}
                mono={false}
                defaultOpen
                offset={offset(u.at, start)}
                label={LABEL[u.status]}
                status={stepStatus(u, i === updates.length - 1)}
                duration={<RelativeTime value={u.at} />}
              >
                <span className="flex items-start gap-2">
                  <Avatar name={u.author} size="xs" />
                  <span>
                    <span className="text-foreground">{u.author}</span>
                    {` - ${u.text}`}
                  </span>
                </span>
              </Step>
            ))}
          </StepList>
        </div>
        <Composer onPost={post} />
      </div>
    </Block>
  );
};
