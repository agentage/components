import type { ComponentType } from 'react';

import { DISPLAY } from './registry/display';
import { FEEDBACK } from './registry/feedback';
import { FORMS } from './registry/forms';
import { FOUNDATIONS } from './registry/foundations';
import { LISTS } from './registry/lists';
import { NAVIGATION } from './registry/navigation';
import { OVERLAYS } from './registry/overlays';
import { PATTERNS } from './registry/patterns';
import { REVIEW } from './registry/review';

export interface DemoEntry {
  /** Section heading: Example, Variants, Sizes, States or Composition. */
  title?: string;
  /** Set on a folded-in component's sections: its name, for the search palette and old links. */
  group?: string;
  Component: ComponentType;
}

export interface ComponentEntry {
  slug: string;
  name: string;
  /** One-line purpose, shown on the category page, in search and in the catalog index. */
  description: string;
  /** In the Core set: the small list most screens are built from, shown first in the docs. */
  core?: boolean;
  /** Public exports documented on the page (drives prop tables + import snippet). */
  exports: string[];
  /** Shared parts the component is built from, for the catalog index. */
  parts?: string[];
  /** Patterns only: demo files under demos/patterns (no extension) that "Built from" is read from. */
  sources?: string[];
  demos: DemoEntry[];
}

export interface CategoryEntry {
  slug: string;
  label: string;
  description: string;
  /** Demos render without the framed demo surface (full compositions). */
  bare?: boolean;
  components: ComponentEntry[];
}

export const CATEGORIES: CategoryEntry[] = [
  FOUNDATIONS,
  FORMS,
  NAVIGATION,
  LISTS,
  DISPLAY,
  OVERLAYS,
  FEEDBACK,
  PATTERNS,
  REVIEW,
];

export interface ResolvedComponent {
  category: CategoryEntry;
  component: ComponentEntry;
}

export const ALL_COMPONENTS: ResolvedComponent[] = CATEGORIES.flatMap((category) =>
  category.components.map((component) => ({ category, component }))
);

/** Core pages in catalog order; each keeps its category URL. */
export const CORE_COMPONENTS: ResolvedComponent[] = ALL_COMPONENTS.filter(
  ({ component }) => component.core
);

export const componentPath = (categorySlug: string, componentSlug: string): string =>
  `/components/${categorySlug}/${componentSlug}`;

export const findComponent = (
  categorySlug: string,
  componentSlug: string
): ResolvedComponent | undefined =>
  ALL_COMPONENTS.find(
    ({ category, component }) => category.slug === categorySlug && component.slug === componentSlug
  );
