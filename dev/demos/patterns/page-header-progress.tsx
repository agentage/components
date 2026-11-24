'use client';
import { useState } from 'react';
import { Avatar, Badge, CheckItem, CheckList, MetaItem, PageHeader, Progress } from '../../../src';
import { Block } from '../../components/demo';
import { GroupDot, ITEMS, STATUS_LABEL, StatusIcon, type ItemStatus } from '../../lib/items-data';

const TONE = {
  backlog: 'muted',
  todo: 'subtle',
  progress: 'primary',
  review: 'info',
  done: 'success',
} as const;
type Shown = keyof typeof TONE;
const LIST = ['ITM-2', 'ITM-4', 'ITM-5', 'ITM-7'];

export const Example = () => {
  const [rows, setRows] = useState(ITEMS.filter((t) => t.group === 'web'));
  const count = (s: ItemStatus) => rows.filter((t) => t.status === s).length;
  const done = count('done');
  const list = rows.filter((t) => LIST.includes(t.id));
  const toggle = (id: string, on: boolean) =>
    setRows((l) => l.map((x) => (x.id === id ? { ...x, status: on ? 'done' : 'todo' } : x)));
  return (
    <Block caption="Tick an item in the list and it moves to Done (untick moves it back to Todo): the progress, the counts and the segment widths follow.">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="px-4 pb-3.5 pt-1">
          <PageHeader
            variant="detail"
            icon={<GroupDot k="web" />}
            title="Website"
            subtitle="The public website: the status page, sign-in, the help pages and the release notes."
            className="border-0 p-0"
            meta={
              <>
                <Badge variant="outline-success">Active</Badge>
                <MetaItem label="Lead">
                  <Avatar size="2xs" name="Ada Lovelace" tone="primary" aria-hidden="true" />
                  Ada Lovelace
                </MetaItem>
                <MetaItem label="Target">Dec 4</MetaItem>
                <Progress
                  className="w-48"
                  label={`${String(done)} of ${String(rows.length)} done`}
                  showValue
                  size="sm"
                  variant="info"
                  value={done}
                  max={rows.length}
                />
              </>
            }
          />
          <Progress
            className="mt-3 max-w-[520px]"
            legend
            label="Items by status"
            segments={(Object.keys(TONE) as Shown[]).map((s) => ({
              key: s,
              label: STATUS_LABEL[s],
              count: count(s),
              tone: TONE[s],
              glyph: <StatusIcon status={s} />,
            }))}
          />
        </div>
        <div className="border-t border-border px-4 py-3.5">
          <CheckList variant="plain" title="Milestone items" summary className="max-w-sm">
            {list.map((t) => (
              <CheckItem
                key={t.id}
                label={t.title}
                checked={t.status === 'done'}
                onCheckedChange={(on) => toggle(t.id, on)}
              />
            ))}
          </CheckList>
        </div>
      </div>
    </Block>
  );
};
