'use client';
import { useState, type ReactNode } from 'react';
import {
  Avatar,
  Checkbox,
  DataTable,
  StatusGlyph,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type DataTableColumn,
} from '../../src';
import { Block, Row } from '../components/demo';
import { UiIcon } from '../lib/ui-icons';

interface Host {
  id: string;
  name: string;
  region: string;
}
const HOSTS: Host[] = [
  { id: 'h1', name: 'alpha', region: 'eu' },
  { id: 'h2', name: 'bravo', region: 'eu' },
  { id: 'h3', name: 'charlie', region: 'us' },
  { id: 'h4', name: 'backup', region: 'us' },
];
const COLS: DataTableColumn<Host>[] = [
  { key: 'name', header: 'Host', sortable: true, grow: true },
  { key: 'region', header: 'Region', width: 80 },
];

const Framed = ({ children }: { children: ReactNode }) => (
  <div className="overflow-hidden rounded-lg border border-border">{children}</div>
);

export const Example = () => {
  const [tab, setTab] = useState('installed');
  const [on, setOn] = useState(true);
  const [multi, setMulti] = useState<string[]>(['h2']);
  return (
    <div className="space-y-5">
      <Block caption='Tabs with variant="pill" and a count on each trigger.'>
        <Tabs value={tab} onValueChange={setTab} variant="pill">
          <TabsList aria-label="Sections">
            <TabsTrigger value="installed" count={7}>
              Installed
            </TabsTrigger>
            <TabsTrigger value="market" count={8}>
              Market
            </TabsTrigger>
            <TabsTrigger value="sources" count={2}>
              Sources
            </TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className="mt-2 text-ui text-muted-foreground">
            Showing {tab}.
          </TabsContent>
        </Tabs>
      </Block>
      <Block caption='Avatar with shape="square" and an icon, next to round avatars with initials, at 2xs, xs and sm.'>
        <Row>
          <Avatar shape="square" icon={<UiIcon name="bot" />} aria-label="Assistant" />
          <Avatar shape="square" size="xs" icon={<UiIcon name="flask" />} aria-label="Lab" />
          <Avatar shape="square" size="2xs" icon={<UiIcon name="store" />} aria-label="Store" />
          <Avatar size="2xs" name="Ada Lovelace" tone="primary" />
          <Avatar size="xs" name="Grace Hopper" />
        </Row>
      </Block>
      <Block caption='Checkbox with size="sm" (13 px): checked, unchecked and mixed, next to the 16 px default.'>
        <Row>
          <Checkbox size="sm" checked={on} onCheckedChange={setOn} aria-label="Small, checked" />
          <Checkbox size="sm" aria-label="Small, unchecked" />
          <Checkbox size="sm" indeterminate aria-label="Small, mixed" />
          <Checkbox checked aria-label="Default, 16 px" />
        </Row>
      </Block>
      <Block caption="StatusGlyph progress shapes, from not started to done, and the dot shape in each tone.">
        <Row className="gap-4">
          <StatusGlyph shape="dashed" label="Backlog" />
          <StatusGlyph shape="ring" label="To do" />
          <StatusGlyph shape="half" tone="primary" label="In progress" />
          <StatusGlyph shape="three-quarters" tone="info" label="In review" />
          <StatusGlyph shape="check" tone="success" label="Done" />
          <StatusGlyph shape="slash" label="Canceled" />
          <StatusGlyph shape="dot" tone="success" label="Active" />
          <StatusGlyph shape="dot" tone="warning" label="Paused" />
          <StatusGlyph shape="dot" tone="destructive" label="Failed" />
        </Row>
      </Block>
      <div className="grid gap-4 md:grid-cols-2">
        <Block caption='DataTable with selection="single": click a row.'>
          <Framed>
            <DataTable
              columns={COLS}
              rows={HOSTS}
              rowKey={(h) => h.id}
              selection="single"
              defaultSelectedKeys={['h1']}
            />
          </Framed>
        </Block>
        <Block caption="Multi selection: select all shows mixed, and Shift-click picks a range.">
          <Framed>
            <DataTable
              columns={COLS}
              rows={HOSTS}
              rowKey={(h) => h.id}
              rowLabel={(h) => h.name}
              selection="multi"
              selectedKeys={multi}
              onSelectedKeysChange={setMulti}
            />
          </Framed>
        </Block>
      </div>
    </div>
  );
};
