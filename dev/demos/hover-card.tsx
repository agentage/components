'use client';
import { Avatar, Badge, Button, HoverCard, RelativeTime, StatusGlyph } from '../../src';
import { Block, Row } from '../components/demo';

const Preview = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Avatar name="Ada Lovelace" size="sm" />
      <span className="text-ui font-semibold">Ada Lovelace</span>
      <StatusGlyph shape="dot" tone="success" label="Active" />
    </div>
    <p className="m-0 text-xs text-muted-foreground">
      Team lead, last seen <RelativeTime value={Date.now() - 2 * 60_000} />.
    </p>
    <div className="flex gap-2">
      <Badge variant="success">Active</Badge>
      <Badge variant="outline">5 reports</Badge>
    </div>
  </div>
);

export const Example = () => (
  <Block caption="A preview card on hover or focus. It opens after a short delay, so a pass-by does not flash it.">
    <HoverCard trigger={<Button variant="link">@ada</Button>}>
      <Preview />
    </HoverCard>
  </Block>
);

export const Variants = () => (
  <Block caption="Open above or below the trigger with side. Start-aligned by default.">
    <Row className="gap-4">
      <HoverCard trigger={<Button variant="link">Opens above</Button>} side="top">
        <p className="m-0 text-xs text-muted-foreground">Shown above the trigger.</p>
      </HoverCard>
      <HoverCard trigger={<Button variant="link">Opens below</Button>} side="bottom">
        <p className="m-0 text-xs text-muted-foreground">Shown below the trigger.</p>
      </HoverCard>
    </Row>
  </Block>
);
