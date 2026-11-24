// Site entry: marketing and docs site parts, for sites that want them apart from the barrel.

export { CopyButton } from './components/copy-button';
export type { CopyButtonProps } from './components/copy-button';

export {
  DocSidebar,
  DocSidebarGroup,
  DocSidebarItem,
  docSidebarItemVariants,
} from './components/doc-sidebar';
export type {
  DocSidebarProps,
  DocSidebarGroupProps,
  DocSidebarItemProps,
} from './components/doc-sidebar';

export {
  Footer,
  FooterSections,
  FooterSection,
  FooterLink,
  FooterBottom,
} from './components/footer';
export type { FooterProps, FooterSectionProps, FooterBottomProps } from './components/footer';

export { MarkdownRenderer } from './components/markdown';
export type { MarkdownComponents, MarkdownRendererProps } from './components/markdown';

export {
  TopBar,
  TopBarBrand,
  TopBarNav,
  TopBarNavItem,
  TopBarActions,
  topBarNavItemVariants,
  topBarVariants,
} from './components/top-bar';
export type { TopBarProps, TopBarNavItemProps } from './components/top-bar';
