'use client';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  EntityList,
  IconButton,
  ListRow,
  StatusGlyph,
  type ListItem,
  RelativeTime,
} from '../../src';
import { Block } from '../components/demo';
import { EditIcon } from '../lib/icons';
import { UiIcon } from '../lib/ui-icons';

type Tone = 'success' | 'destructive' | 'primary';

const NOW = Date.now();

const DEPLOYMENTS: { id: string; title: string; description: string; tone: Tone; min: number }[] = [
  {
    id: 'd1',
    title: 'Billing service',
    description: 'master, fix rounding',
    tone: 'success',
    min: 2,
  },
  {
    id: 'd2',
    title: 'Dashboard',
    description: 'feature branch, new filters',
    tone: 'primary',
    min: 18,
  },
  {
    id: 'd3',
    title: 'Landing site',
    description: 'master, update pricing',
    tone: 'success',
    min: 60,
  },
  {
    id: 'd4',
    title: 'Reports API',
    description: 'hotfix, timeout',
    tone: 'destructive',
    min: 180,
  },
];

const dot = (tone: Tone) => <StatusGlyph shape="dot" tone={tone} label={tone} />;

const Actions = () => (
  <DropdownMenu
    trigger={<IconButton icon={<EditIcon />} onClick={() => {}} title="Actions" size="sm" />}
  >
    <DropdownMenuLabel>Deployment</DropdownMenuLabel>
    <DropdownMenuItem>View logs</DropdownMenuItem>
    <DropdownMenuItem>Redeploy</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenu>
);

const ALERTS: ListItem[] = [
  {
    id: 'a1',
    kind: 'Approval',
    icon: <UiIcon name="shield" />,
    iconTone: 'primary',
    emphasized: true,
    title: 'Approve the access request',
    description: 'Ada Lovelace asks for write access.',
    alert: 'waiting 4 min',
  },
  {
    id: 'a2',
    kind: 'Question',
    icon: <UiIcon name="help" />,
    iconTone: 'primary',
    emphasized: true,
    title: 'Which region should we use?',
    description: 'The setup stops until you pick one.',
    meta: '12 min',
  },
  {
    id: 'a3',
    kind: 'Review',
    icon: <UiIcon name="eye" />,
    iconTone: 'muted',
    emphasized: true,
    title: 'Report ready for review',
    description: '5 sections, 2 charts.',
    meta: '18 min',
  },
  {
    id: 'a4',
    kind: 'Failure',
    icon: <UiIcon name="alert" />,
    iconTone: 'destructive',
    title: 'Nightly backup failed',
    description: 'The target folder is full.',
    meta: '1 h',
  },
  {
    id: 'a5',
    kind: 'Done',
    icon: <UiIcon name="checkCircle" />,
    iconTone: 'success',
    title: 'Import finished',
    description: '1,204 records added.',
    meta: '2 h',
  },
  {
    id: 'a6',
    kind: 'Note',
    icon: <UiIcon name="info" />,
    iconTone: 'muted',
    title: 'Settings were updated',
    description: 'One value changed.',
    meta: '5 h',
  },
];

const GROUP_OF: Record<string, { key: string; label: string }> = {
  Approval: { key: 'act', label: 'Needs attention' },
  Question: { key: 'act', label: 'Needs attention' },
  Review: { key: 'review', label: 'To review' },
  Failure: { key: 'review', label: 'To review' },
  Done: { key: 'info', label: 'Information' },
  Note: { key: 'info', label: 'Information' },
};

export const Example = () => (
  <Block caption="Children mode: a bordered frame of ListRows. A row link stretches over the whole row, and trailing actions stay clickable above it.">
    <EntityList>
      {DEPLOYMENTS.map((d) => (
        <ListRow
          key={d.id}
          href="#"
          leading={dot(d.tone)}
          title={d.title}
          description={d.description}
          meta={<RelativeTime value={NOW - d.min * 60_000} />}
          actions={<Actions />}
        />
      ))}
    </EntityList>
  </Block>
);

export const Variants = () => {
  const [sel, setSel] = useState('a1');
  return (
    <div className="space-y-5">
      <Block caption="One-line rows are 36 px; a description makes the row 52 px.">
        <EntityList>
          {DEPLOYMENTS.slice(0, 2).map((d) => (
            <ListRow
              key={d.id}
              href="#"
              leading={dot(d.tone)}
              title={d.title}
              meta={<RelativeTime value={NOW - d.min * 60_000} />}
            />
          ))}
          <ListRow
            href="#"
            leading={dot('success')}
            title="Docs build"
            description="master, update guide"
            meta="now"
          />
        </EntityList>
      </Block>
      <Block
        caption="Data mode with the 54 px row variant: rows with a dot, a kind icon, a bold emphasized title and an amber alert. Up, Down, j and k move; Enter opens."
        className="max-w-[420px]"
      >
        <EntityList
          label="Alerts"
          variant="stacked"
          items={ALERTS.slice(0, 4)}
          value={sel}
          onValueChange={setSel}
          className="rounded-lg border border-border"
        />
      </Block>
    </div>
  );
};

export const States = () => {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="space-y-5">
      <Block caption="Flat data mode with a selected row. Selection is controlled with value and onValueChange.">
        <EntityList
          label="Deployments"
          items={DEPLOYMENTS.map((d) => ({
            id: d.id,
            title: d.title,
            description: d.description,
            leading: dot(d.tone),
            meta: <RelativeTime value={NOW - d.min * 60_000} />,
          }))}
          value={sel}
          onValueChange={setSel}
          className="rounded-lg border border-border"
        />
      </Block>
      <Block caption="A selected ListRow in children mode.">
        <EntityList>
          <ListRow selected title="Billing service" meta="2 min ago" />
          <ListRow title="Dashboard" meta="18 min ago" />
        </EntityList>
      </Block>
    </div>
  );
};

export const Composition = () => {
  const [sel, setSel] = useState('a2');
  const [opened, setOpened] = useState<string | null>(null);
  return (
    <Block
      caption={`Grouped data mode inside a scroller: sticky 32 px group headers with counts collapse, and storageKey keeps them collapsed after a reload. Opened: ${opened ?? 'none'}.`}
      className="h-[340px] max-w-[420px] overflow-auto rounded-lg border border-border"
    >
      <EntityList
        label="Grouped alerts"
        variant="stacked"
        items={ALERTS}
        groupBy={(i) => GROUP_OF[i.kind ?? 'Note']}
        groupOrder={['act', 'review', 'info']}
        value={sel}
        onValueChange={setSel}
        onOpen={setOpened}
        defaultCollapsedGroups={['info']}
        storageKey="ds-docs-list-groups"
      />
    </Block>
  );
};
