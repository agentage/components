import { ALL_COMPONENTS, type ComponentEntry, type ResolvedComponent } from '../registry';

const RAW = import.meta.glob('../demos/patterns/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const LIBRARY_IMPORT = /import\s*\{([^}]*)\}\s*from\s*'(?:\.\.\/)+src(?:\/index)?';/g;

/** Source text of one pattern demo file, by its basename without extension. */
export const patternSource = (file: string): string => RAW[`../demos/patterns/${file}.tsx`] ?? '';

/** Value names a demo file imports from the library, in import order. */
const importedNames = (source: string): string[] =>
  [...source.matchAll(LIBRARY_IMPORT)].flatMap((match) =>
    (match[1] ?? '')
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part && !part.startsWith('type '))
      .map((part) => part.split(/\s+as\s+/)[0] ?? part)
  );

const homeRank = (r: ResolvedComponent): number =>
  ['patterns', 'review'].includes(r.category.slug) ? 1 : 0;

const pageFor = (name: string): ResolvedComponent | undefined =>
  ALL_COMPONENTS.filter(({ component }) => component.exports.includes(name)).sort(
    (a, b) => homeRank(a) - homeRank(b)
  )[0];

/** The component pages a pattern is built from, derived from its demo imports. */
export const builtFrom = (entry: ComponentEntry): ResolvedComponent[] => {
  const pages: ResolvedComponent[] = [];
  for (const file of entry.sources ?? []) {
    for (const name of importedNames(patternSource(file))) {
      const page = pageFor(name);
      if (page && !pages.includes(page)) pages.push(page);
    }
  }
  return pages;
};
