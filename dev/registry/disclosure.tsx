import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as Accordion from '../demos/accordion';
import * as CheckList from '../demos/check-list';
import * as Collapsible from '../demos/collapsible';
import * as StepList from '../demos/step-list';

export const DISCLOSURE: CategoryEntry = {
  slug: 'disclosure',
  label: 'Disclosure',
  description: 'Content that opens and shuts with an animated height.',
  components: [
    {
      slug: 'collapsible',
      name: 'Collapsible',
      description: 'One trigger over one animated body; `useCollapsible` for a custom trigger.',
      exports: ['Collapsible', 'CollapsibleTrigger', 'CollapsibleContent', 'useCollapsible'],
      parts: ['Disclosure', 'DisclosureChevron', 'Count'],
      demos: sections(Collapsible),
    },
    {
      slug: 'accordion',
      name: 'Accordion',
      description:
        'Collapsible items, one or many open, as plain rows or 32 px section headers that can remember what is open.',
      exports: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'],
      parts: ['Disclosure', 'DisclosureChevron', 'Count', 'useControlled'],
      demos: sections(Accordion),
    },
    {
      slug: 'step-list',
      name: 'StepList',
      description: 'A step timeline: 36 px rows with glyphs and expandable detail.',
      exports: ['StepList', 'Step'],
      parts: ['Disclosure', 'StatusGlyph', 'useControlled', 'useRovingFocus'],
      demos: sections(StepList),
    },
    {
      slug: 'check-list',
      name: 'CheckList',
      description: 'Status rows ("6 of 6 passed") or 28 px checkbox rows ("1 of 3").',
      exports: ['CheckList', 'CheckItem'],
      parts: ['Disclosure', 'DisclosureChevron', 'StatusGlyph', 'Checkbox'],
      demos: sections(CheckList),
    },
  ],
};
