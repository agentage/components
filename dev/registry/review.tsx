import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as BeforeAfter from '../demos/before-after';
import * as CatalogReview from '../demos/catalog-review';
import * as Variants from '../demos/variants';

export const REVIEW: CategoryEntry = {
  slug: 'review',
  label: 'Review',
  description: 'Temporary review pages for the consolidation.',
  bare: true,
  components: [
    {
      slug: 'catalog-review',
      name: 'Catalog review',
      description: 'The final component list, suggestions, 0.21 release notes and known limits.',
      exports: [],
      parts: [],
      demos: [
        { title: 'Components', Component: CatalogReview.Catalog },
        { title: 'Suggestions', Component: CatalogReview.Suggestions },
        { title: 'Release notes 0.21', Component: CatalogReview.ReleaseNotes },
        { title: 'Known limits', Component: CatalogReview.KnownLimits },
      ],
    },
    {
      slug: 'before-after',
      name: 'Before and after',
      description: 'The consolidation over the existing catalog, the previous look next to live.',
      exports: [],
      parts: [],
      demos: sections(BeforeAfter),
    },
    {
      slug: 'variants',
      name: 'New variants',
      description: 'Variants added on existing components.',
      exports: ['Tabs', 'Avatar', 'Checkbox', 'StatusGlyph', 'DataTable'],
      parts: [],
      demos: sections(Variants),
    },
  ],
};
