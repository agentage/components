'use client';
import { useEffect, useState } from 'react';
import { Badge, Command, CommandEmpty, CommandGroup, CommandItem, Kbd } from '../../src';
import { builtFrom } from '../lib/built-from';
import { useRoute } from '../lib/router';
import { sectionId } from '../lib/section-id';
import { ALL_COMPONENTS, CATEGORIES, componentPath } from '../registry';

/** Components folded onto another page: one palette entry each, landing on their first section. */
const FOLDED = ALL_COMPONENTS.flatMap(({ category, component }) => {
  const first = new Map<string, string>();
  for (const d of component.demos)
    if (d.group && !first.has(d.group)) first.set(d.group, d.title ?? '');
  return [...first].map(([name, title]) => ({
    name,
    host: component.name,
    path: `${componentPath(category.slug, component.slug)}#${sectionId(title)}`,
  }));
});

const STATIC_PAGES = [
  { label: 'Home', path: '/', keywords: 'overview index' },
  { label: 'Getting started', path: '/install', keywords: 'install npm tailwind source rsc' },
  { label: 'Theming', path: '/theming', keywords: 'tokens oklch dark light system data-theme' },
];

/** ⌘K palette over the registry, built on the library's own Command. */
export const Search = () => {
  const [open, setOpen] = useState(false);
  const { navigate } = useRoute();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const go = (path: string): void => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
        className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        Search
        <Kbd>⌘K</Kbd>
      </button>

      <Command
        open={open}
        onOpenChange={setOpen}
        placeholder="Search components, pages, props..."
        aria-label="Search the components"
      >
        <CommandGroup heading="Pages">
          {STATIC_PAGES.map((page) => (
            <CommandItem
              key={page.path}
              value={`${page.label} ${page.keywords}`}
              onClick={() => {
                go(page.path);
              }}
            >
              {page.label}
            </CommandItem>
          ))}
          {CATEGORIES.map((category) => (
            <CommandItem
              key={category.slug}
              value={`${category.label} ${category.description}`}
              onClick={() => {
                go(`/components/${category.slug}`);
              }}
            >
              {category.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Components">
          {ALL_COMPONENTS.map(({ category, component }) => (
            <CommandItem
              key={`${category.slug}/${component.slug}`}
              // Name + description + exports + category, so the query matches on any of them.
              value={`${component.name} ${component.description} ${[...component.exports, ...builtFrom(component).map((p) => p.component.name)].join(' ')} ${category.label}${component.core ? ' core' : ''}`}
              shortcut={category.label}
              onClick={() => {
                go(componentPath(category.slug, component.slug));
              }}
            >
              {component.name}
              {component.core && (
                <Badge variant="outline-primary" className="ml-2">
                  Core
                </Badge>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Sections">
          {FOLDED.map((f) => (
            <CommandItem
              key={f.path}
              value={`${f.name} ${f.host}`}
              shortcut={f.host}
              onClick={() => {
                go(f.path);
              }}
            >
              {f.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandEmpty>No component matches.</CommandEmpty>
      </Command>
    </>
  );
};
