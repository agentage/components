import type { ComponentType } from 'react';
import type { DemoEntry } from '../registry';

const ORDER = ['Example', 'Variants', 'Sizes', 'States', 'Composition'] as const;

/** A demo module's sections in the one page order. */
export const sections = (mod: Record<string, unknown>): DemoEntry[] =>
  ORDER.flatMap((title) => {
    const Component = mod[title] as ComponentType | undefined;
    return Component ? [{ title, Component }] : [];
  });
