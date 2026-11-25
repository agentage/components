'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src';
import { Block } from '../components/demo';

const Panel = ({ children }: { children: string }) => (
  <p className="pt-3 text-ui text-muted-foreground">{children}</p>
);

export const Example = () => {
  const [tab, setTab] = useState('overview');
  return (
    <Block caption="Line tabs have a 2 px bar under the active tab. Arrow keys, Home and End move between tabs.">
      <Tabs value={tab} onValueChange={setTab} variant="line">
        <TabsList aria-label="Report">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Panel>Overview panel.</Panel>
        </TabsContent>
        <TabsContent value="details">
          <Panel>Details panel.</Panel>
        </TabsContent>
        <TabsContent value="history">
          <Panel>History panel.</Panel>
        </TabsContent>
      </Tabs>
    </Block>
  );
};

export const Variants = () => {
  const [line, setLine] = useState('overview');
  const [pill, setPill] = useState('overview');
  return (
    <div className="space-y-5">
      <Block caption="The line variant is for page-level navigation: a 38 px list over a rule.">
        <Tabs value={line} onValueChange={setLine} variant="line">
          <TabsList aria-label="Line tabs">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
        </Tabs>
      </Block>
      <Block caption="The pill variant is a compact tray of 28 px pills for switching a view.">
        <Tabs value={pill} onValueChange={setPill} variant="pill">
          <TabsList aria-label="Pill tabs">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
        </Tabs>
      </Block>
    </div>
  );
};

export const States = () => {
  const [line, setLine] = useState('config');
  const [pill, setPill] = useState('config');
  return (
    <div className="space-y-5">
      <Block caption="A tab can carry a quiet count and a dot that marks unsaved changes.">
        <Tabs value={line} onValueChange={setLine} variant="line">
          <TabsList aria-label="Tabs with counts">
            <TabsTrigger value="config" dirty>
              Configuration
            </TabsTrigger>
            <TabsTrigger value="history" count={13}>
              History
            </TabsTrigger>
            <TabsTrigger value="files" count={4}>
              Files
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Block>
      <Block caption="A disabled tab dims and is skipped by the arrow keys.">
        <Tabs value={pill} onValueChange={setPill} variant="pill">
          <TabsList aria-label="Tabs with a disabled tab">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="archive" disabled>
              Archive
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Block>
    </div>
  );
};
