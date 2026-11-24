import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as FilterBar from '../demos/filter-bar';
import * as NavLink from '../demos/nav-link';
import * as PageLayout from '../demos/page-layout';
import * as StatusDot from '../demos/status-dot';
import * as UsageMeter from '../demos/usage-meter';

export const DEPRECATED: CategoryEntry = {
  slug: 'deprecated',
  label: 'Deprecated',
  description: 'Still exported for older markup; each page names the replacement.',
  components: [
    {
      slug: 'filter-bar',
      name: 'FilterBar',
      description: 'Deprecated: use ListToolbar with FilterMenu, DisplayMenu and ToolbarSearch.',
      exports: [
        'FilterBar',
        'FilterSearch',
        'FilterButtonGroup',
        'FilterSort',
        'FilterClear',
        'FilterResults',
      ],
      parts: [],
      demos: sections(FilterBar),
    },
    {
      slug: 'nav-link',
      name: 'NavLink',
      description: 'Deprecated: use NavRow, or navRowVariants on your own link.',
      exports: ['NavLink'],
      parts: [],
      demos: sections(NavLink),
    },
    {
      slug: 'page-layout',
      name: 'PageLayout',
      description: 'Deprecated: compose PageHeader in your own layout container.',
      exports: ['PageLayout'],
      parts: [],
      demos: sections(PageLayout),
    },
    {
      slug: 'status-dot',
      name: 'StatusDot',
      description: 'Deprecated: use StatusGlyph; STATUS_DOT_GLYPH maps each variant.',
      exports: ['StatusDot'],
      parts: ['StatusGlyph'],
      demos: sections(StatusDot),
    },
    {
      slug: 'usage-meter',
      name: 'UsageMeter',
      description:
        'Deprecated: use Progress with role="meter", labelPosition="top" and thresholds.',
      exports: ['UsageMeter'],
      parts: ['Progress'],
      demos: sections(UsageMeter),
    },
  ],
};
