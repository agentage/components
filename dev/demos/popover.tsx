'use client';
import { useState } from 'react';
import { Button, Popover } from '../../src';
import { Block, Row } from '../components/demo';

const Card = ({ side }: { side: 'top' | 'bottom' }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      side={side}
      trigger={
        <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
          Open {side}
        </Button>
      }
      content={
        <div className="space-y-1">
          <p className="m-0 text-ui font-medium">Nightly backup</p>
          <p className="m-0 text-xs text-muted-foreground">Every day at 02:00, 3 copies kept.</p>
        </div>
      }
      open={open}
      onOpenChange={() => setOpen(false)}
    />
  );
};

export const Example = () => {
  const [open, setOpen] = useState(false);
  return (
    <Block caption="An anchored surface that opens on click and closes on Escape or an outside click.">
      <Popover
        trigger={
          <Button variant="outline" onClick={() => setOpen(!open)}>
            Show details
          </Button>
        }
        content={
          <div className="space-y-1">
            <p className="m-0 text-ui font-medium">Service details</p>
            <p className="m-0 text-xs text-muted-foreground">Linux, 4 cores, Active</p>
          </div>
        }
        open={open}
        onOpenChange={() => setOpen(false)}
      />
    </Block>
  );
};

export const Variants = () => (
  <Block caption="The preferred side is top by default. It flips when there is no room.">
    <Row className="gap-4">
      <Card side="top" />
      <Card side="bottom" />
    </Row>
  </Block>
);
