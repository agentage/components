'use client';
import { useState } from 'react';
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../src';
import { Block } from '../components/demo';

const FAILED = ['Nightly backup', 'Weekly digest', 'Release notes'];
const FRAME = 'max-w-md overflow-hidden rounded-lg border border-border p-1';

export const Example = () => (
  <Block caption="A 28 px trigger with a turning chevron over a body that animates its height. The body is inert while shut, and instant under reduced motion.">
    <Collapsible defaultOpen className={FRAME}>
      <CollapsibleTrigger>Details</CollapsibleTrigger>
      <CollapsibleContent className="px-2 pb-2 pl-7">
        <p className="text-ui text-muted-foreground">
          Shows the extra detail for this item. Hide it to keep the page short.
        </p>
      </CollapsibleContent>
    </Collapsible>
  </Block>
);

export const States = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="space-y-5">
      <Block caption="Controlled with open and onOpenChange; count adds a quiet number after the label.">
        <Collapsible open={open} onOpenChange={setOpen} className={FRAME}>
          <CollapsibleTrigger count={FAILED.length}>Failed items</CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="space-y-px pb-1">
              {FAILED.map((r) => (
                <li key={r} className="flex h-7 items-center rounded-md pl-7 pr-2 text-ui">
                  {r}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </Block>
      <Block caption="Without the chevron, the trigger is a plain label.">
        <Collapsible className={FRAME}>
          <CollapsibleTrigger chevron={false}>Show more</CollapsibleTrigger>
          <CollapsibleContent className="px-2 pb-2">
            <p className="text-ui text-muted-foreground">More text.</p>
          </CollapsibleContent>
        </Collapsible>
      </Block>
    </div>
  );
};

export const Composition = () => (
  <Block caption="With asChild any control becomes the trigger and gets the open state and aria ids.">
    <Collapsible className={FRAME}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          Advanced options
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2 pb-2">
        <p className="text-ui text-muted-foreground">Any control can drive the same body.</p>
      </CollapsibleContent>
    </Collapsible>
  </Block>
);
