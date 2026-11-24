'use client';
import { Separator } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="A horizontal separator is a 1 px rule across its container.">
    <div className="space-y-3 text-ui">
      <span>Above</span>
      <Separator />
      <span>Below</span>
    </div>
  </Block>
);

export const Variants = () => (
  <Block caption="A vertical separator fills the height of its row; set decorative to false to expose it to screen readers.">
    <div className="flex h-5 items-center gap-4 text-ui">
      <span>Left</span>
      <Separator orientation="vertical" />
      <span>Center</span>
      <Separator orientation="vertical" decorative={false} />
      <span>Right</span>
    </div>
  </Block>
);

export const Composition = () => (
  <Block caption="Separators split the groups of a toolbar or a card.">
    <div className="max-w-xs rounded-lg border border-border bg-card p-3 text-ui">
      <div className="font-medium">Nightly backup</div>
      <div className="text-xs text-muted-foreground">Last updated today</div>
      <Separator className="my-3" />
      <div className="flex h-4 items-center gap-3 text-xs text-muted-foreground">
        <span>Owner</span>
        <Separator orientation="vertical" />
        <span>Team</span>
      </div>
    </div>
  </Block>
);
