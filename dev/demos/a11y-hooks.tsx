'use client';
import { useRef, useState } from 'react';
import {
  Button,
  useAnnounce,
  useControlled,
  usePersistedState,
  useRovingFocus,
  useScrollSpy,
} from '../../src';
import { Block, Row } from '../components/demo';

const FILTERS = ['All', 'Enabled', 'Paused', 'Scheduled'];
const SECTIONS = ['overview', 'usage', 'limits'];

export const Example = () => {
  const toolbar = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('All');
  const announce = useAnnounce();
  useRovingFocus(toolbar, { orientation: 'both' });

  return (
    <div className="space-y-5">
      <Block caption="The roving-focus hook gives a group one Tab stop; arrows, Home and End move focus.">
        <div ref={toolbar} role="toolbar" aria-label="Filter items" className="flex gap-1">
          {FILTERS.map((f) => (
            <Button
              key={f}
              data-roving-item=""
              aria-pressed={filter === f}
              variant={filter === f ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => {
                setFilter(f);
                announce(`Showing ${f.toLowerCase()} items`);
              }}
            >
              {f}
            </Button>
          ))}
        </div>
      </Block>
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

export const Composition = () => {
  const [open, setOpen] = useControlled<boolean>(undefined, false);
  const [count, setCount] = usePersistedState<number>('demo-hooks-count', 0);
  return (
    <div className="space-y-5">
      <Block caption="The scroll-spy hook returns the id in view; scroll the box to move the highlight.">
        <SpyDemo />
      </Block>
      <Block caption="The controlled-state hook follows a value when given one; here it is uncontrolled.">
        <Row>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? 'Hide details' : 'Show details'}
          </Button>
          {open && <span className="text-ui text-muted-foreground">Details are visible.</span>}
        </Row>
      </Block>
      <Block caption="The persisted-state hook mirrors a value to local storage, so the count survives a reload.">
        <Row>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCount(count + 1);
            }}
          >
            Add one
          </Button>
          <span className="text-ui tabular-nums">Count: {count}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setCount(0);
            }}
          >
            Reset
          </Button>
        </Row>
      </Block>
    </div>
  );
};
