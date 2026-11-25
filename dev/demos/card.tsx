'use client';
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMeta,
  CardTitle,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Skeleton,
  StatusBar,
  StatusGlyph,
  ToggleGroup,
  type CardState,
  type StatusBarCell,
} from '../../src';
import { ItemCard } from '../lib/item-card';
import { Block } from '../components/demo';
import { useState } from 'react';

const STATES: CardState[] = ['ready', 'loading', 'empty', 'error', 'stale'];
const UPDATED = Date.now() - 4 * 60_000;

const CardStates = () => {
  const [state, setState] = useState<CardState>('ready');
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };
  return (
    <Block caption="Each state swaps only the body: loading, empty, error with Retry, and stale.">
      <div className="space-y-3">
        <ToggleGroup
          variant="segmented"
          value={state}
          onValueChange={setState}
          aria-label="Card state"
          options={STATES.map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }))}
        />
        <div className={GRID}>
          <Card
            state={state}
            minHeight={188}
            fallback={{
              onRetry: () => setState('loading'),
              error: { message: 'Could not load requests', reference: 'req_8f2a91' },
              loading: (
                <div className="space-y-2">
                  <Skeleton className="h-7 w-28" />
                  <Skeleton variant="text" className="w-3/4" />
                </div>
              ),
            }}
          >
            <CardHeader>
              <CardTitle>Requests</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="m-0 text-xl font-semibold tabular-nums">12,408</p>
              <p className="m-0 text-xs text-muted-foreground">Up 4% on the day before</p>
            </CardContent>
            <CardFooter>
              <CardMeta
                source="Edge logs"
                updatedAt={UPDATED}
                onRefresh={refresh}
                refreshing={refreshing}
              />
            </CardFooter>
          </Card>
          <Card state={state === 'ready' ? 'ready' : 'loading'} minHeight={188}>
            <CardHeader>
              <CardTitle>Error rate</CardTitle>
              <CardDescription>Default skeleton</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="m-0 text-xl font-semibold tabular-nums">0.12%</p>
            </CardContent>
            <CardFooter>
              <CardMeta updatedAt={UPDATED} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </Block>
  );
};

const GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2';

export const Example = () => (
  <Block caption="One flat surface with a border and no shadow. Header, title, description, content and footer are plain parts you stack.">
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Team settings</CardTitle>
        <CardDescription>Who can see and edit this folder.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-ui">Three people have access.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  </Block>
);

export const Sizes = () => (
  <Block caption="Padding sm is the default (12/14 px); md (16/20 px) suits a card that leads a page.">
    <div className={GRID}>
      <Card padding="sm">
        <p className="m-0 text-ui font-semibold">Small padding</p>
        <p className="m-0 text-xs text-muted-foreground">The default dense surface.</p>
      </Card>
      <Card padding="md">
        <p className="m-0 text-ui font-semibold">Medium padding</p>
        <p className="m-0 text-xs text-muted-foreground">More room around the content.</p>
      </Card>
    </div>
  </Block>
);

export const States = () => (
  <div className="space-y-5">
    <Block caption="Interactive lights the border on hover; selected gives the primary border.">
      <div className={GRID}>
        <Card interactive tabIndex={0}>
          <p className="m-0 text-ui font-semibold">Interactive</p>
          <p className="m-0 text-xs text-muted-foreground">Hover or focus this card.</p>
        </Card>
        <Card selected>
          <p className="m-0 text-ui font-semibold">Selected</p>
          <p className="m-0 text-xs text-muted-foreground">Primary border.</p>
        </Card>
      </div>
    </Block>
    <CardStates />
  </div>
);

const TICKS: StatusBarCell[] = [
  { tone: 'success', label: 'Backup 1, done' },
  { tone: 'success', label: 'Backup 2, done' },
  { tone: 'destructive', label: 'Backup 3, failed' },
  { tone: 'success', label: 'Backup 4, done' },
  { tone: 'success', label: 'Backup 5, done' },
];

const MENU = (
  <>
    <DropdownMenuItem>Open</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </>
);

const ItemCards = () => {
  const [selected, setSelected] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [opened, setOpened] = useState(0);
  return (
    <Block
      caption={`Item card: a Card with an indicator, a title button that opens the item (${String(opened)} opens), a checkbox, a switch, a menu, facts and a footer. Controls sit above the stretched title. The cards and board views of DataView use the same card by default.`}
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
        <ItemCard
          title="Nightly backup"
          indicator={<StatusGlyph shape="dot" tone="success" label="Active" />}
          description="Copies the main folder to the archive disk every morning."
          facts={[
            { label: 'Schedule', value: 'Every day 09:00' },
            { label: 'Next', value: 'in 19 h' },
            { label: 'Target', value: 'Main folder' },
            { label: 'Success', value: '83%' },
          ]}
          footer={
            <>
              <StatusBar
                size="sm"
                label="Last 5 results of Nightly backup"
                cells={TICKS}
                slots={8}
              />
              <span>5 results</span>
            </>
          }
          menu={MENU}
          onOpen={() => setOpened((n) => n + 1)}
        />
        <ItemCard
          title="Weekly digest"
          indicator={
            <StatusGlyph
              shape="dot"
              tone={enabled ? 'success' : 'muted'}
              label={enabled ? 'Active' : 'Paused'}
            />
          }
          description="Sends a summary of the week to the team."
          facts={[
            { label: 'Schedule', value: 'Mondays 08:00' },
            { label: 'Next', value: 'in 3 d' },
          ]}
          selected={selected}
          onSelectedChange={setSelected}
          enabled={enabled}
          onEnabledChange={setEnabled}
          menu={MENU}
          onOpen={() => setOpened((n) => n + 1)}
        />
      </div>
    </Block>
  );
};

export const Composition = () => (
  <div className="space-y-5">
    <ItemCards />
    <ActionCard />
  </div>
);

const ActionCard = () => (
  <Block caption="CardAction puts a control at the right of the header, next to the title.">
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what reaches you.</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-ui text-muted-foreground">Email is on. Push is off.</p>
      </CardContent>
    </Card>
  </Block>
);
