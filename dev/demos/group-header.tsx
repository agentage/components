'use client';
import { useState } from 'react';
import { Button, Disclosure, GroupHeader, StatusGlyph } from '../../src';
import { Block } from '../components/demo';

const FRAME = 'overflow-hidden rounded-lg border border-border';

const Body = ({ items }: { items: string[] }) => (
  <ul className="m-0 list-none p-0">
    {items.map((i) => (
      <li key={i} className="flex h-9 items-center border-b border-border px-3 text-ui">
        {i}
      </li>
    ))}
  </ul>
);

export const Example = () => (
  <Block caption="A static 32 px group header: label and a quiet count.">
    <div className={FRAME}>
      <GroupHeader label="Active" count={3} />
    </div>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="The group variant is 32 px with a card background.">
      <div className={FRAME}>
        <GroupHeader
          label="Active"
          count={3}
          icon={<StatusGlyph shape="dot" tone="success" label="Active" />}
        />
      </div>
    </Block>
    <Block caption="The section variant is a 32 px header without the rule, with a summary on the right.">
      <div className={FRAME}>
        <GroupHeader variant="section" label="Details" summary="3 fields" />
      </div>
    </Block>
  </div>
);

export const States = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="space-y-5">
      <Block caption="With onOpenChange the header is a toggle with a chevron, a glyph and a count.">
        <div className={FRAME}>
          <GroupHeader
            label="Paused"
            count={2}
            icon={<StatusGlyph shape="ring" tone="muted" label="Paused" />}
            open={open}
            onOpenChange={setOpen}
            controls="gh-body"
          />
          <Disclosure id="gh-body" open={open}>
            <Body items={['Budget draft', 'Hiring plan']} />
          </Disclosure>
        </div>
      </Block>
      <Block caption="Actions sit at the right edge, outside the toggle.">
        <div className={FRAME}>
          <GroupHeader
            label="Failed"
            count={1}
            open
            onOpenChange={() => {}}
            actions={
              <Button size="sm" variant="ghost">
                Retry all
              </Button>
            }
          />
        </div>
      </Block>
    </div>
  );
};

export const Composition = () => {
  const [shown, setShown] = useState(false);
  return (
    <div className="space-y-5">
      <Block caption="Sticky headers stay at the top of the scroller while their group scrolls.">
        <div className={`${FRAME} h-[200px] overflow-auto`}>
          {['Active', 'Paused', 'Failed'].map((g) => (
            <section key={g}>
              <GroupHeader className="sticky top-0 z-10" label={g} count={4} />
              <Body items={['Item one', 'Item two', 'Item three', 'Item four']} />
            </section>
          ))}
        </div>
      </Block>
      <Block caption="Disclosure animates any body open and shut; it stays mounted and inert while shut.">
        <Button size="sm" variant="outline" onClick={() => setShown((v) => !v)}>
          {shown ? 'Hide' : 'Show'} details
        </Button>
        <Disclosure open={shown} className="pt-2 text-ui text-muted-foreground">
          Any content can sit in the body.
        </Disclosure>
      </Block>
    </div>
  );
};
