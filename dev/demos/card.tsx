'use client';
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
  ToggleGroup,
  type CardState,
} from '../../src';
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
            onRetry={() => setState('loading')}
            error={{ message: 'Could not load requests', reference: 'req_8f2a91' }}
            skeleton={
              <div className="space-y-2">
                <Skeleton className="h-7 w-28" />
                <Skeleton variant="text" className="w-3/4" />
              </div>
            }
          >
            <CardHeader>
              <CardTitle>Requests</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="m-0 text-xl font-semibold tabular-nums">12,408</p>
              <p className="m-0 text-xs text-muted-foreground">Up 4% on the day before</p>
            </CardContent>
            <CardFooter
              source="Edge logs"
              updatedAt={UPDATED}
              onRefresh={refresh}
              refreshing={refreshing}
            />
          </Card>
          <Card state={state === 'ready' ? 'ready' : 'loading'} minHeight={188}>
            <CardHeader>
              <CardTitle>Error rate</CardTitle>
              <CardDescription>Default skeleton</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="m-0 text-xl font-semibold tabular-nums">0.12%</p>
            </CardContent>
            <CardFooter updatedAt={UPDATED} />
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

export const Composition = () => (
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
