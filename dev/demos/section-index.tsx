'use client';
import { useRef, type MouseEvent } from 'react';
import { SectionIndex, useScrollSpy } from '../../src';
import { Block } from '../components/demo';

const SECTIONS = [
  { id: 'sidx-basics', label: 'Basics' },
  { id: 'sidx-details', label: 'Details' },
  { id: 'sidx-access', label: 'Access', dirty: true },
  { id: 'sidx-files', label: 'Files', count: 7 },
  { id: 'sidx-schedule', label: 'Schedule' },
  { id: 'sidx-limits', label: 'Limits' },
];
const IDS = SECTIONS.map((s) => s.id);

export const Example = () => {
  const root = useRef<HTMLDivElement>(null);
  const active = useScrollSpy(IDS, { root, offset: 24 });

  const jump = (id: string, e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    const el = document.getElementById(id);
    const box = root.current;
    if (el && box) box.scrollTo({ top: el.offsetTop - box.offsetTop - 8, behavior: 'smooth' });
  };

  return (
    <Block caption="Scroll the panel and the marker follows the section in view; the useScrollSpy hook returns its id. Click an item to jump.">
      <div className="grid grid-cols-[172px_minmax(0,1fr)] gap-6 rounded-lg border border-border p-4">
        <SectionIndex
          sections={SECTIONS}
          activeId={active}
          onSelect={jump}
          aria-label="Settings sections"
          className="self-start"
        />
        <div
          ref={root}
          className="relative h-72 overflow-y-auto pr-2"
          tabIndex={0}
          role="region"
          aria-label="Settings"
        >
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="border-b border-border py-4 last:border-b-0">
              <h3 className="text-ui font-semibold text-foreground">{s.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Sample settings for {s.label.toLowerCase()}. This block is tall enough to make the
                panel scroll so the marker has somewhere to go.
              </p>
              <div className="mt-3 h-24 rounded-md border border-dashed border-border" />
            </section>
          ))}
        </div>
      </div>
    </Block>
  );
};

export const Variants = () => (
  <Block caption="Items take an optional icon, a quiet count and an unsaved dot; activeId marks the current one.">
    <div className="w-44 rounded-lg border border-border p-2">
      <SectionIndex
        aria-label="Index parts"
        activeId="a"
        sections={[
          { id: 'a', label: 'Overview' },
          { id: 'b', label: 'Files', count: 12 },
          { id: 'c', label: 'Access', dirty: true },
        ]}
      />
    </div>
  </Block>
);
