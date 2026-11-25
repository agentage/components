'use client';
import { useState } from 'react';
import { Badge, Button } from '../../src';
import { Block, Row } from '../components/demo';

export const Example = () => (
  <Block caption="A badge is a 20 px static label for a state or a category.">
    <Row>
      <Badge>Default</Badge>
      <Badge variant="success">Active</Badge>
    </Row>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="Tinted fills for general labels.">
      <Row>
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Failed</Badge>
        <Badge variant="success">Active</Badge>
        <Badge variant="warning">Paused</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="solid">New</Badge>
      </Row>
    </Block>
    <Block caption="Status pills: a tinted rule and text in one tone, no fill.">
      <Row>
        <Badge variant="outline-success">Done</Badge>
        <Badge variant="outline-primary">Pending</Badge>
        <Badge variant="outline-destructive">Blocked</Badge>
        <Badge variant="outline-muted">Not started</Badge>
        <Badge variant="outline-warning">Degraded</Badge>
        <Badge variant="outline-info">Draft</Badge>
      </Row>
    </Block>
  </div>
);

export const States = () => {
  const [count, setCount] = useState(3);
  return (
    <div className="space-y-5">
      <Block caption="The count prop renders a solid number pill and shows nothing at 0.">
        <Row>
          <Badge count={3} />
          <Badge count={0} />
          <span className="text-xs text-muted-foreground">Zero renders nothing.</span>
        </Row>
      </Block>
      <Block caption="Above max (99 by default) the badge reads max+.">
        <Row>
          <Badge count={99} />
          <Badge count={120} />
          <Badge count={12} max={9} />
        </Row>
      </Block>
      <Block caption="A live count updates in place and disappears when it returns to 0.">
        <Row>
          <span className="inline-flex items-center gap-1.5 text-ui">
            Reports <Badge count={count} />
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCount(count + 1);
            }}
          >
            Add
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setCount(0);
            }}
          >
            Clear
          </Button>
        </Row>
      </Block>
    </div>
  );
};

export const Composition = () => (
  <Block caption="A badge beside a row title marks its state.">
    <div className="flex max-w-sm items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-ui">
      <span className="flex-1 truncate font-medium">Nightly backup</span>
      <Badge variant="outline-success">Done</Badge>
      <Badge count={2} />
    </div>
  </Block>
);
