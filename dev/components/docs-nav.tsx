'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DocSidebar,
  DocSidebarItem,
} from '../../src';
import { useRoute } from '../lib/router';
import { CATEGORIES, CORE_COMPONENTS, FOLDED, componentPath } from '../registry';

const STORAGE_KEY = 'ds-docs-open-groups';
const CORE = 'core';
const TRIGGER =
  'px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-foreground';

const categoryOf = (path: string): string | undefined => {
  const [, root, slug] = path.split('/');
  return root === 'components' && slug ? slug : undefined;
};

// Nothing stored yet (first visit): Core starts open; afterwards the stored list rules.
const restore = (): string[] => {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
    return Array.isArray(parsed) ? (parsed as string[]) : [CORE];
  } catch {
    return [CORE];
  }
};

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={`mr-1.5 inline-block align-[-1px] transition-transform duration-150 ${
      open ? 'rotate-90' : ''
    }`}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const DocsNav = () => {
  const { path } = useRoute();
  const current = categoryOf(path);
  const [open, setOpen] = useState<string[]>(() => [
    ...new Set([...restore(), ...(current ? [current] : [])]),
  ]);
  const railRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  // Deep links land in a collapsed rail, so the route's own group opens itself.
  useEffect(() => {
    if (current) setOpen((prev) => (prev.includes(current) ? prev : [...prev, current]));
  }, [current]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(open));
    } catch {
      /* storage blocked: groups still toggle for this page */
    }
  }, [open]);

  // Scroll the rail only - scrollIntoView would drag the page with it.
  useEffect(() => {
    const rail = railRef.current;
    const item = activeRef.current;
    if (!rail || !item) return;
    const r = rail.getBoundingClientRect();
    const i = item.getBoundingClientRect();
    if (i.top >= r.top && i.bottom <= r.bottom) return;
    rail.scrollTop += i.top - r.top - r.height / 2 + i.height / 2;
  }, [path, open]);

  const toggle = (slug: string): void => {
    setOpen((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  return (
    <aside
      ref={railRef}
      className="docs-rail rail-scroll sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto py-6 lg:block"
    >
      <DocSidebar className="h-full border-r-0" width="w-64">
        <Collapsible
          open={open.includes(CORE)}
          onOpenChange={() => {
            toggle(CORE);
          }}
          className="mb-1"
        >
          <CollapsibleTrigger chevron={false} className={TRIGGER}>
            <Chevron open={open.includes(CORE)} />
            Core
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-0.5 space-y-px">
            {CORE_COMPONENTS.map(({ category, component }) => {
              const to = componentPath(category.slug, component.slug);
              // The category copy below owns aria-current and the scroll target.
              return (
                <DocSidebarItem
                  key={to}
                  href={to}
                  active={path === to}
                  aria-current={undefined}
                  depth={1}
                >
                  {component.name}
                </DocSidebarItem>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
        <div aria-hidden="true" className="mx-2 my-2 h-px bg-border" />
        {CATEGORIES.map((category) => {
          const overview = `/components/${category.slug}`;
          const isOpen = open.includes(category.slug);
          return (
            <Collapsible
              key={category.slug}
              open={isOpen}
              onOpenChange={() => {
                toggle(category.slug);
              }}
              className={
                category.slug === FOLDED[0] ? 'mb-1 mt-3 border-t border-border pt-3' : 'mb-1'
              }
            >
              <CollapsibleTrigger chevron={false} className={TRIGGER}>
                <Chevron open={isOpen} />
                {category.label}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-0.5 space-y-px">
                <DocSidebarItem
                  href={overview}
                  active={path === overview}
                  ref={path === overview ? activeRef : undefined}
                >
                  Overview
                </DocSidebarItem>
                {category.components.map((component) => {
                  const to = componentPath(category.slug, component.slug);
                  return (
                    <DocSidebarItem
                      key={component.slug}
                      href={to}
                      active={path === to}
                      ref={path === to ? activeRef : undefined}
                      depth={1}
                    >
                      {component.name}
                    </DocSidebarItem>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </DocSidebar>
    </aside>
  );
};
