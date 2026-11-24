import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as CopyButton from '../demos/copy-button';
import * as DocSidebar from '../demos/doc-sidebar';
import * as Footer from '../demos/footer';
import * as Markdown from '../demos/markdown';
import * as TopBar from '../demos/top-bar';

export const SITE: CategoryEntry = {
  slug: 'site',
  label: 'Site',
  description: 'Docs and marketing site chrome.',
  components: [
    {
      slug: 'footer',
      name: 'Footer',
      description: 'The site footer with link columns.',
      exports: ['Footer', 'FooterSections', 'FooterSection', 'FooterLink', 'FooterBottom'],
      parts: [],
      demos: sections(Footer),
    },
    {
      slug: 'top-bar',
      name: 'TopBar',
      description: 'The site header bar with brand, navigation and actions.',
      exports: ['TopBar', 'TopBarBrand', 'TopBarNav', 'TopBarNavItem', 'TopBarActions'],
      parts: [],
      demos: sections(TopBar),
    },
    {
      slug: 'doc-sidebar',
      name: 'DocSidebar',
      description: 'The docs navigation rail.',
      exports: ['DocSidebar', 'DocSidebarGroup', 'DocSidebarItem'],
      parts: [],
      demos: sections(DocSidebar),
    },
    {
      slug: 'markdown',
      name: 'MarkdownRenderer',
      description: 'Markdown rendered with Prose styles.',
      exports: ['MarkdownRenderer'],
      parts: ['Prose'],
      demos: sections(Markdown),
    },
    {
      slug: 'copy-button',
      name: 'CopyButton',
      description: 'Copies text and confirms in place without a width change.',
      exports: ['CopyButton'],
      parts: ['Button'],
      demos: sections(CopyButton),
    },
  ],
};
