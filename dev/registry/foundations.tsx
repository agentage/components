import type { CategoryEntry } from '../registry';
import { more, sections } from './sections';
import * as Avatar from '../demos/avatar';
import * as Badge from '../demos/badge';
import * as Button from '../demos/button';
import * as Chip from '../demos/chip';
import * as CopyButton from '../demos/copy-button';
import * as IconButton from '../demos/icon-button';
import * as Kbd from '../demos/kbd';
import * as Loading from '../demos/loading';
import * as PriorityGlyph from '../demos/priority-glyph';
import * as Prose from '../demos/prose';
import * as StatusGlyph from '../demos/status-glyph';

export const FOUNDATIONS: CategoryEntry = {
  slug: 'foundations',
  label: 'Foundations',
  description: 'The primitives every other page builds on.',
  components: [
    {
      slug: 'button',
      name: 'Button',
      core: true,
      description:
        'The action control: seven variants, md 28 px and sm 24 px, an asChild slot for links.',
      exports: ['Button'],
      parts: [],
      demos: sections(Button),
    },
    {
      slug: 'icon-button',
      name: 'IconButton',
      core: true,
      description: 'A square icon-only button with a required accessible name and a tooltip title.',
      exports: ['IconButton'],
      parts: [],
      demos: sections(IconButton),
    },
    {
      slug: 'badge',
      name: 'Badge',
      core: true,
      description: 'A 20 px label in the tone vocabulary; `count` turns it into a count badge.',
      exports: ['Badge'],
      parts: [],
      demos: sections(Badge),
    },
    {
      slug: 'chip',
      name: 'Chip',
      core: true,
      description: 'A removable or pressable pill for filters and tags, 24 or 20 px.',
      exports: ['Chip'],
      parts: [],
      demos: sections(Chip),
    },
    {
      slug: 'avatar',
      name: 'Avatar',
      core: true,
      description:
        'Initials, image or glyph in a circle or rounded square; IconContainer for tinted icon tiles.',
      exports: ['Avatar'],
      parts: [],
      demos: sections(Avatar),
    },
    {
      slug: 'kbd',
      name: 'Kbd',
      core: true,
      description: 'A keyboard key hint, 20 px at 11 px.',
      exports: ['Kbd'],
      parts: [],
      demos: sections(Kbd),
    },
    {
      slug: 'skeleton-and-spinner',
      name: 'Skeleton and Spinner',
      description: 'Loading placeholders that keep the final layout, and an inline busy mark.',
      exports: ['Skeleton', 'Spinner'],
      parts: [],
      demos: sections(Loading),
    },
    {
      slug: 'status-glyph',
      name: 'StatusGlyph',
      core: true,
      description:
        'The status indicator: 14 px shapes in a tone with a pulse for live states; PriorityGlyph draws priority bars.',
      exports: ['StatusGlyph', 'PriorityGlyph'],
      parts: [],
      demos: [...sections(StatusGlyph), ...more('PriorityGlyph', PriorityGlyph)],
    },
    {
      slug: 'prose',
      name: 'Prose',
      core: true,
      description: 'Long-form text styles for rendered content.',
      exports: ['Prose'],
      parts: [],
      demos: sections(Prose),
    },
    {
      slug: 'copy-button',
      name: 'CopyButton',
      description:
        'Copies a text to the clipboard and confirms it in place, with a label or icon only.',
      exports: ['CopyButton'],
      parts: [],
      demos: sections(CopyButton),
    },
  ],
};
