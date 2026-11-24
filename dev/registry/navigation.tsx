import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as Breadcrumb from '../demos/breadcrumb';
import * as NavRow from '../demos/nav-row';
import * as PageHeader from '../demos/page-header';
import * as Pagination from '../demos/pagination';
import * as SectionIndex from '../demos/section-index';
import * as Sidebar from '../demos/sidebar';
import * as Tabs from '../demos/tabs';

export const NAVIGATION: CategoryEntry = {
  slug: 'navigation',
  label: 'Navigation',
  description: 'Trees, tabs, paths and page headers.',
  components: [
    {
      slug: 'nav-row',
      name: 'NavRow and NavTree',
      core: true,
      description: 'The 28 px navigation row and the keyboard tree built from it.',
      exports: ['NavTree', 'NavRow'],
      parts: ['rowVariants', 'DisclosureChevron', 'useRovingFocus'],
      demos: sections(NavRow),
    },
    {
      slug: 'sidebar',
      name: 'Sidebar',
      description: 'App shell navigation with grouped rows, header and footer.',
      exports: [
        'Sidebar',
        'SidebarHeader',
        'SidebarContent',
        'SidebarGroup',
        'SidebarGroupLabel',
        'SidebarFooter',
      ],
      parts: [],
      demos: sections(Sidebar),
    },
    {
      slug: 'tabs',
      name: 'Tabs',
      core: true,
      description: 'Two looks: `line` (38 px list, amber bar) and `pill` (28 px pills in a tray).',
      exports: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
      parts: ['Count'],
      demos: sections(Tabs),
    },
    {
      slug: 'breadcrumb',
      name: 'Breadcrumb',
      core: true,
      description: 'The ancestor trail ending in the current page.',
      exports: [
        'Breadcrumb',
        'BreadcrumbList',
        'BreadcrumbItem',
        'BreadcrumbLink',
        'BreadcrumbPage',
        'BreadcrumbSeparator',
      ],
      parts: [],
      demos: sections(Breadcrumb),
    },
    {
      slug: 'pagination',
      name: 'Pagination',
      description: 'Page buttons with previous and next.',
      exports: ['Pagination'],
      parts: [],
      demos: sections(Pagination),
    },
    {
      slug: 'section-index',
      name: 'SectionIndex',
      description: 'An on-page index that follows the scroll position.',
      exports: ['SectionIndex'],
      parts: ['useScrollSpy'],
      demos: sections(SectionIndex),
    },
    {
      slug: 'page-header',
      name: 'PageHeader',
      description: 'Title, description, meta and actions at the top of a page.',
      exports: ['PageHeader'],
      parts: [],
      demos: sections(PageHeader),
    },
  ],
};
