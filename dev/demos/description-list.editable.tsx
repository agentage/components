'use client';
import { useState } from 'react';
import {
  PRIORITY_LABEL,
  Property,
  PropertyDate,
  DescriptionList,
  PropertyMultiSelect,
  PropertySelect,
  PropertyText,
  type Priority,
  RelativeTime,
} from '../../src';
import { Block } from '../components/demo';
import {
  GROUPS,
  GroupDot,
  LABELS,
  PEOPLE,
  PRIORITIES,
  PersonAvatar,
  PriorityIcon,
  STATUSES,
  STATUS_LABEL,
  StatusIcon,
  personName,
  type ItemStatus,
} from '../lib/items-data';

const STATUS_OPTIONS = STATUSES.map((s) => ({
  value: s,
  label: STATUS_LABEL[s],
  icon: <StatusIcon status={s} />,
}));
const PRIORITY_OPTIONS = PRIORITIES.map((p) => ({
  value: p,
  label: PRIORITY_LABEL[p],
  icon: <PriorityIcon p={p} />,
}));
const PEOPLE_OPTIONS = [
  { value: '', label: 'No assignee', icon: <PersonAvatar k={null} /> },
  ...PEOPLE.map((p) => ({ value: p.k, label: personName(p.k), icon: <PersonAvatar k={p.k} /> })),
];
const GROUP_OPTIONS = GROUPS.map((g) => ({ value: g.k, label: g.n, icon: <GroupDot k={g.k} /> }));
const LABEL_OPTIONS = LABELS.map((l) => ({ value: l, label: l }));

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[360px] max-w-full rounded-lg border border-border bg-card px-4 py-3.5">
    {children}
  </div>
);

const UPDATED = Date.now() - 3 * 60_000;

const Editors = () => {
  const [title, setTitle] = useState('Draft the release notes');
  const [status, setStatus] = useState<ItemStatus>('progress');
  const [priority, setPriority] = useState<Priority>('high');
  const [assignee, setAssignee] = useState('ak');
  const [labels, setLabels] = useState(['feature']);
  const [due, setDue] = useState<Date | null>(new Date('2026-11-25T12:00:00Z'));
  return (
    <Block caption="Editable rows show each value as a 24 px button that opens its editor.">
      <Panel>
        <DescriptionList variant="editable">
          <Property label="Title">
            <PropertyText value={title} onValueChange={setTitle} />
          </Property>
          <Property label="Status">
            <PropertySelect
              value={status}
              onValueChange={(v) => {
                setStatus(v as ItemStatus);
              }}
              options={STATUS_OPTIONS}
            />
          </Property>
          <Property label="Priority">
            <PropertySelect
              value={priority}
              onValueChange={(v) => {
                setPriority(v as Priority);
              }}
              options={PRIORITY_OPTIONS}
            />
          </Property>
          <Property label="Assignee">
            <PropertySelect value={assignee} onValueChange={setAssignee} options={PEOPLE_OPTIONS} />
          </Property>
          <Property label="Labels">
            <PropertyMultiSelect
              value={labels}
              onValueChange={setLabels}
              options={LABEL_OPTIONS}
              placeholder="Add label"
            />
          </Property>
          <Property label="Due">
            <PropertyDate value={due} onValueChange={setDue} />
          </Property>
        </DescriptionList>
      </Panel>
    </Block>
  );
};

const ReadOnly = () => {
  const [group, setGroup] = useState('web');
  return (
    <Block caption="Plain children make a read-only row that lines up with the editors; a disabled editor shows the value and does not open.">
      <Panel>
        <DescriptionList variant="editable">
          <Property label="Group">
            <PropertySelect value={group} onValueChange={setGroup} options={GROUP_OPTIONS} />
          </Property>
          <Property label="Status">
            <PropertySelect
              disabled
              value="done"
              onValueChange={() => {}}
              options={STATUS_OPTIONS}
            />
          </Property>
          <Property label="Owner">Ada Lovelace</Property>
          <Property label="Updated">
            <RelativeTime value={UPDATED} />
          </Property>
        </DescriptionList>
      </Panel>
    </Block>
  );
};

/** Docs-only: the editable DescriptionList demos. */
export const Editable = () => (
  <div className="space-y-5">
    <Editors />
    <ReadOnly />
  </div>
);
