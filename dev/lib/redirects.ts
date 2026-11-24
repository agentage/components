/** Old page routes (released and merged) to the page that now holds them. */
const PAGES: Record<string, string> = {
  'forms/path-list': 'patterns/settings-form',
  'cards/donut-card': 'charts/donut-card',
  'cards/funnel-card': 'charts/funnel-card',
  'cards/gauge-card': 'charts/gauge-card',
  'cards/heatmap-card': 'charts/heatmap-card',
  'cards/multi-stat-card': 'charts/multi-stat-card',
  'cards/ranked-list-card': 'charts/ranked-list-card',
  'cards/score-card': 'charts/score-card',
  'data-display/data-table': 'lists/data-table',
  'data-display/entity-list': 'lists/list',
  'data-display/pagination': 'navigation/pagination',
  'data-display/status-dot': 'foundations/status-glyph',
  'data-display/table': 'lists/table',
  'feedback/alert-dialog': 'overlays/alert-dialog',
  'feedback/command': 'overlays/command',
  'feedback/context-menu': 'overlays/context-menu',
  'feedback/dropdown-menu': 'overlays/dropdown-menu',
  'feedback/hover-card': 'overlays/hover-card',
  'feedback/modal': 'overlays/modal',
  'feedback/overlay-portals': 'overlays/overlay-portals',
  'feedback/popover': 'overlays/popover',
  'feedback/sheet': 'overlays/sheet',
  'feedback/tooltip': 'overlays/tooltip',
  'forms/checkbox': 'forms/checkbox-and-switch',
  'forms/label': 'foundations/label',
  'foundations/card': 'data-display/card',
  'foundations/loading': 'foundations/skeleton-and-spinner',
  'layout/page-header': 'navigation/page-header',
  'layout/resizable': 'overlays/resizable',
  'layout/scroll-area': 'overlays/scroll-area',
  'layout/section': 'forms/section',
  'layout/sidebar': 'navigation/sidebar',
  'navigation/accordion': 'disclosure/accordion',
  'navigation/collapsible': 'disclosure/collapsible',
  'navigation/heading': 'foundations/heading',
  'navigation/kbd': 'foundations/kbd',
  'navigation/prose': 'foundations/prose',
  'site-docs/chip': 'foundations/chip',
  'site-docs/copy-button': 'site/copy-button',
  'site-docs/doc-sidebar': 'site/doc-sidebar',
  'site-docs/footer': 'site/footer',
  'site-docs/markdown': 'site/markdown',
  'site-docs/top-bar': 'site/top-bar',
  'patterns/grouped-list': 'patterns/list-page',
  'patterns/grouped-table': 'patterns/list-page',
  'patterns/dashboard-grid': 'patterns/card-grid',
  'patterns/status-page': 'patterns/monitoring',
  'patterns/monitor-detail': 'patterns/monitoring',
  'patterns/secrets': 'patterns/settings-form',
  'patterns/detail-pane': 'patterns/detail',
  'patterns/incident-timeline': 'patterns/detail',
  'patterns/page-header-progress': 'patterns/detail',
};

const CATEGORIES: Record<string, string> = {
  cards: 'charts',
  layout: 'navigation',
  'site-docs': 'site',
};

/** The current path for a possibly old one, or the same path when nothing moved. */
export const redirectedPath = (path: string): string => {
  const [, root, category, page, ...rest] = path.replace(/\/+$/, '').split('/');
  if (root !== 'components' || !category || rest.length) return path;
  const moved = page ? PAGES[`${category}/${page}`] : undefined;
  if (moved) return `/components/${moved}`;
  const renamed = CATEGORIES[category];
  return renamed ? `/components/${[renamed, page].filter(Boolean).join('/')}` : path;
};
