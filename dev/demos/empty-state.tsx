'use client';
import { Button, EmptyState } from '../../src';
import { Block } from '../components/demo';
import { InfoIcon, ServerIcon } from '../lib/icons';

const FRAME = 'rounded-lg border border-border';

export const Example = () => (
  <Block
    caption="Centered: an icon, a title, a line of help and one action. Use it for a whole empty surface."
    className={FRAME}
  >
    <EmptyState
      icon={<ServerIcon />}
      title="No servers found"
      description="Connect a machine to see it here."
      action={<Button size="sm">Get started</Button>}
    />
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block
      caption="Start alignment is a compact, left-aligned block for inside a list."
      className={FRAME}
    >
      <EmptyState
        align="start"
        icon={<InfoIcon />}
        title="No items match these filters"
        description="Clear a filter or add an item."
        action={
          <Button size="sm" variant="outline">
            Clear filters
          </Button>
        }
      />
    </Block>
    <Block
      caption="Without an icon or an action, a title and a description are enough."
      className={FRAME}
    >
      <EmptyState
        title="Nothing here yet"
        description="New documents will appear in this folder."
      />
    </Block>
  </div>
);
