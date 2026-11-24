'use client';
import { useState } from 'react';
import {
  Badge,
  Button,
  MetaItem,
  StatusBar,
  PageHeader,
  StatusGlyph,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type StatusBarCell,
} from '../../src';
import { Block } from '../components/demo';
import { EditIcon, InfoIcon, ServerIcon } from '../lib/icons';

const TICKS: StatusBarCell[] = [
  { tone: 'success', label: 'Backup 1, done' },
  { tone: 'success', label: 'Backup 2, done' },
  { tone: 'destructive', label: 'Backup 3, failed' },
  { tone: 'success', label: 'Backup 4, done' },
  { tone: 'primary', pulse: true, label: 'Backup 5, in progress' },
];

const Bar = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-border bg-background px-3">{children}</div>
);

export const Example = () => (
  <Block caption="The default bar is 48 px tall: an icon box, a title, a muted subtitle and 28 px actions.">
    <Bar>
      <PageHeader
        icon={<ServerIcon />}
        title="Services"
        subtitle="Everything installed on your machines"
        actions={[{ icon: <EditIcon />, title: 'New service', onClick: () => {} }]}
      />
    </Bar>
  </Block>
);

export const Variants = () => {
  const [tab, setTab] = useState('overview');
  return (
    <div className="space-y-5">
      <Block caption="The detail variant adds a larger title, a meta line and a docked tab list.">
        <Tabs
          value={tab}
          onValueChange={setTab}
          variant="line"
          className="rounded-lg border border-border bg-background px-4"
        >
          <PageHeader
            variant="detail"
            title="Nightly backup"
            subtitle="Copies every folder to cold storage and posts a report when it finishes."
            meta={
              <>
                <span className="flex items-center gap-1.5">
                  <StatusGlyph shape="disc" tone="success" />
                  Active
                </span>
                <MetaItem label="Next at">02:00</MetaItem>
                <StatusBar
                  size="sm"
                  cells={TICKS}
                  slots={10}
                  label="Last 10 results of Nightly backup"
                />
              </>
            }
            tabs={
              <TabsList aria-label="Service">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history" count={24}>
                  History
                </TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
            }
          >
            <Button size="sm" variant="outline">
              Start now
            </Button>
          </PageHeader>
          {(['overview', 'history', 'files'] as const).map((v) => (
            <TabsContent key={v} value={v} className="py-3 text-ui text-muted-foreground">
              {`Content of ${v}.`}
            </TabsContent>
          ))}
        </Tabs>
      </Block>
    </div>
  );
};

export const States = () => (
  <Block caption="Actions take a tone and can be disabled; children render after them, for example a badge.">
    <Bar>
      <PageHeader
        icon={<InfoIcon />}
        title="Report 2048"
        subtitle="Created by Ada Lovelace"
        actions={[
          { icon: <InfoIcon />, title: 'Details', onClick: () => {} },
          { icon: <EditIcon />, title: 'Edit', onClick: () => {}, disabled: true },
          { icon: <EditIcon />, title: 'Cancel', onClick: () => {}, variant: 'destructive' },
        ]}
      >
        <Badge variant="success">Done</Badge>
      </PageHeader>
    </Bar>
  </Block>
);
