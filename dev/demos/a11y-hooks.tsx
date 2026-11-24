'use client';
import { useRef } from 'react';
import { Button, useAnnounce, useScrollSpy } from '../../src';
import { Block } from '../components/demo';

const SECTIONS = ['overview', 'usage', 'limits'];

export const Example = () => {
  const announce = useAnnounce();
  return (
    <div className="space-y-5">
      <Block caption="The announce hook writes to one hidden live region; try it with a screen reader on.">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            announce('Save failed: the server is offline', 'assertive');
          }}
        >
          Announce an assertive error
        </Button>
      </Block>
    </div>
  );
};

const SpyDemo = () => {
  const root = useRef<HTMLDivElement>(null);
  const active = useScrollSpy(SECTIONS, { root, offset: 8 });
  return (
    <div className="flex gap-4">
      <ul className="m-0 w-28 list-none space-y-1 p-0 text-xs">
        {SECTIONS.map((id) => (
          <li
            key={id}
            className={id === active ? 'font-semibold text-foreground' : 'text-muted-foreground'}
          >
            {id}
          </li>
        ))}
      </ul>
      <div
        ref={root}
        tabIndex={0}
        role="region"
        aria-label="Scrolling sections"
        className="h-32 flex-1 overflow-y-auto rounded-lg border border-border p-3 focus-ring"
      >
        {SECTIONS.map((id) => (
          <section key={id} id={id} className="h-28 text-ui">
            <span className="capitalize">{id}</span> section
          </section>
        ))}
      </div>
    </div>
  );
};

export const Composition = () => (
  <Block caption="The scroll-spy hook returns the id in view; scroll the box to move the highlight.">
    <SpyDemo />
  </Block>
);
