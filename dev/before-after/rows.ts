/** Docs-only: the density pass, one row per component page it touched or checked, in catalog order. */
export interface BeforeAfterRow {
  /** `category/component` route under /components. */
  route: string;
  /** Screenshot name under /before when the page slug changed since the previous release. */
  shot?: string;
  status: 'changed' | 'unchanged' | 'needs-a';
  change: string;
  /** New public props, if any. */
  props?: string;
  /** How to get the previous look back. */
  old?: string;
}

export const ROWS: BeforeAfterRow[] = [
  {
    route: 'foundations/button',
    status: 'changed',
    change:
      'text 12 to 13 px, radius 6 to 8 px on every size, ghost hover solid, outline without shadow',
    old: 'size="lg" (32 px) stays, deprecated',
  },
  {
    route: 'foundations/badge',
    status: 'changed',
    change: 'height 22 to 20 px, new solid pill',
    props: 'size, variant="solid"',
    old: 'size="md"',
  },
  {
    route: 'foundations/avatar',
    status: 'changed',
    change:
      'avatar default 40 to 28 px, xs 24 to 22 px, semibold initials; IconButton 24/28/32 px fixed with pressed; IconContainer md 32 to 28 px',
    props: 'Avatar tone, IconButton pressed, IconContainer size="xl"',
    old: 'Avatar size="md", IconContainer size="lg"',
  },
  {
    route: 'foundations/skeleton-and-spinner',
    shot: 'loading',
    status: 'unchanged',
    change: 'already compact',
  },
  { route: 'foundations/separator', status: 'unchanged', change: 'a 1 px rule' },
  {
    route: 'data-display/stat-card',
    status: 'changed',
    change:
      'one card surface (bg-card), padding 20 to 12/14 px, 8 px gaps, label 11 px caps to 12 px, value 24 to 20 px, no hover shadow; optional period, comparison, chart, facts, breakdown, history, states and source',
    props:
      'density, indicator, footer, period, comparison, chart, chartLabel, facts, breakdown, history, state, source, updatedAt, onRefresh, trend.sentiment',
    old: 'density="comfortable"',
  },
  {
    route: 'lists/table',
    status: 'changed',
    change:
      'the dense look is the default of the bare parts: row 43 to 36 px, text 14 to 13 px, header 40 to 32 px plain 12 px, hover solid',
    props: 'Table density',
    old: 'density="comfortable"',
  },
  {
    route: 'lists/list',
    shot: 'entity-list',
    status: 'changed',
    change:
      'row 63 to 52 px (two-line) and 36 px (one-line), 13/600 title; EntityList gains a data mode (groups, selection, keys) and the 54 px stacked layout; preferred name List',
    props: 'List, ListRow variant, EntityList items, groupBy, value, storageKey',
    old: 'density="comfortable"',
  },
  {
    route: 'navigation/pagination',
    status: 'changed',
    change: 'page buttons 32 to 28 px, text 14 to 13 px',
  },
  {
    route: 'data-display/empty-state',
    status: 'changed',
    change: 'padding 48 to 40 px, icon 48 to 40 px, 13 px text, new compact start alignment',
    props: 'align="start"',
  },
  {
    route: 'foundations/status-glyph',
    shot: 'status-dot',
    status: 'changed',
    change:
      'label 14 to 13 px, new paused ring and live glow; StatusGlyph is the preferred indicator',
    props: 'variant="paused" | "running", StatusGlyph shape="dot"',
  },
  {
    route: 'data-display/code-block',
    status: 'changed',
    change: 'header 37 to 32 px, code 14 to 12 px, padding 16 to 10/12 px, copy button 24 px',
  },
  {
    route: 'data-display/progress',
    status: 'changed',
    change: 'new visible value beside the bar and a 6 px size',
    props: 'showValue, size',
  },
  { route: 'data-display/usage-meter', status: 'changed', change: 'md label 14 to 13 px' },
  ...[
    'gauge-card',
    'donut-card',
    'score-card',
    'funnel-card',
    'heatmap-card',
    'multi-stat-card',
    'ranked-list-card',
  ].map((slug): BeforeAfterRow => ({
    route: `charts/${slug}`,
    status: 'changed',
    change:
      'one card surface (bg-card), padding 16 to 12/14 px, title 12 px muted to 13/500, value one step down, gaps 12 to 10 px',
    props: 'density',
    old: 'density="comfortable"',
  })),
  {
    route: 'forms/input',
    status: 'changed',
    change:
      'Input and Select 36 to 30 px, text 14 to 13 px; FormField row layout; Textarea auto-grow',
    props:
      'Input/Textarea/SelectTrigger size sm | md + mono, Textarea autoGrow + minRows, FormField layout',
    old: 'SelectTrigger compact maps to size="sm"',
  },
  { route: 'foundations/label', status: 'changed', change: 'text 14 to 13 px' },
  {
    route: 'forms/checkbox-and-switch',
    shot: 'checkbox',
    status: 'changed',
    change: 'Checkbox 16 and 13 px, Switch md and sm, one focus ring',
  },
  { route: 'forms/radio-group', status: 'changed', change: 'label 14 to 13 px' },
  { route: 'forms/slider', status: 'changed', change: 'the shared focus ring on the thumb' },
  {
    route: 'forms/combobox',
    status: 'changed',
    change: 'trigger 36 to 30 px, options 32 to 28 px, 13 px text, anchored popover with shadow',
    props: 'size sm | md',
  },
  {
    route: 'forms/date-picker',
    status: 'changed',
    change: 'trigger 36 to 30 px, 13 px text',
    props: 'size sm | md',
  },
  {
    route: 'forms/toggle-group',
    status: 'changed',
    change: 'buttons 34 to 28 px, 12 to 13 px text; new joined segmented variant',
    props: 'variant="segmented", option iconOnly, onValueChange',
  },
  {
    route: 'feedback/alert',
    status: 'changed',
    change:
      'padding 16 to 12 px, text 14 to 13 px; new amber primary variant with title and actions',
    props: 'variant="primary", title, actions, density',
    old: 'density="comfortable"',
  },
  {
    route: 'feedback/toast',
    status: 'changed',
    change: 'padding 16 to 12/14 px, title 14 to 13 px, shadow visible on dark',
  },
  {
    route: 'overlays/tooltip',
    status: 'changed',
    change: 'padding 6/10 to 4/8 px, shadow visible on dark',
  },
  {
    route: 'overlays/modal',
    status: 'changed',
    change:
      'header padding 16 to 12/16 px, title 18 to 14 px, text 13 px, 28 px close, shadow visible on dark',
  },
  {
    route: 'overlays/alert-dialog',
    status: 'changed',
    change: 'padding 24 to 16 px, title 18 to 14 px, text 13 px, Button actions 36 to 28 px',
  },
  {
    route: 'overlays/sheet',
    status: 'changed',
    change: 'header padding 16 to 12/16 px, title 18 to 14 px, text 13 px, 28 px close',
  },
  {
    route: 'overlays/context-menu',
    status: 'changed',
    change:
      'the dense menu is the base look: items 32 to 28 px, 13 px text, menu radius 6 to 8 px, min width 210 px',
    props: 'size',
    old: 'size="md" (deprecated)',
  },
  {
    route: 'overlays/popover',
    status: 'changed',
    change: 'padding 16 to 12 px, min width 300 to 240 px, 13 px text, shadow visible on dark',
  },
  { route: 'overlays/hover-card', status: 'changed', change: 'padding 16 to 12 px, 13 px text' },
  {
    route: 'overlays/command',
    status: 'changed',
    change: 'items 36 to 28 px, 13 px text, input 30 px, Esc as Kbd, popover shadow',
  },
  {
    route: 'overlays/overlay-portals',
    status: 'unchanged',
    change: 'shows the overlays above; nothing of its own',
  },
  {
    route: 'feedback/danger-zone',
    status: 'changed',
    change: 'action rows 16 to 12 px padding, 13 px text, on the one card surface',
  },
  {
    route: 'navigation/page-header',
    status: 'changed',
    change:
      'bar 52 to 48 px, icon box 28 to 24 px, actions 28 px 13 px; new detail variant with meta and tabs',
    props: 'variant="detail", meta, tabs, size; title and subtitle take ReactNode',
    old: 'size="lg"',
  },
  {
    route: 'forms/section',
    status: 'changed',
    change: 'open by default: no box, 16/600 title, 1 px rule with 26 px air; new SectionLabel',
    props: 'variant, headingAs, SectionLabel',
    old: 'variant="boxed"',
  },
  {
    route: 'navigation/sidebar',
    status: 'changed',
    change:
      'nav row 36 to 28 px, the shared row recipe (13 px, 6 px radius, accent bar), solid hover',
    props: 'NavLink density (NavLink deprecated: use NavRow)',
    old: 'density="comfortable"',
  },
  { route: 'overlays/resizable', status: 'unchanged', change: 'handles are already 1 px' },
  { route: 'overlays/scroll-area', status: 'unchanged', change: 'no size of its own' },
  {
    route: 'navigation/breadcrumb',
    status: 'changed',
    change: 'text 14 to 13 px; new mono path variant with slashes',
    props: 'Breadcrumb variant="path"',
  },
  { route: 'foundations/heading', status: 'unchanged', change: 'page typography scale' },
  {
    route: 'foundations/prose',
    status: 'changed',
    change: 'table and pre rules, inline code 14 px to 0.92 em; new size sm (13 px)',
    props: 'size',
  },
  { route: 'foundations/kbd', status: 'changed', change: 'text 10 to 11 px, radius 4 to 6 px' },
  {
    route: 'disclosure/collapsible',
    status: 'changed',
    change: 'trigger 36 to 28 px, 13 px, chevron and count; height animates, inert when shut',
    props: 'CollapsibleTrigger chevron, count',
  },
  {
    route: 'disclosure/accordion',
    status: 'changed',
    change:
      'trigger 52 to 36 px, 13 px, leading chevron, solid hover; height animates, inert when shut',
    props: 'AccordionTrigger count',
  },
  {
    route: 'site/markdown',
    status: 'changed',
    change: 'Prose table and pre rules',
    props: 'size',
  },
  { route: 'site/copy-button', status: 'changed', change: '24 px by default, Button text 12 px' },
  { route: 'site/footer', status: 'unchanged', change: 'marketing chrome' },
  { route: 'site/top-bar', status: 'changed', change: 'nav item 28 px, 13 px, hover solid' },
  {
    route: 'site/doc-sidebar',
    status: 'changed',
    change:
      'the shared row recipe: 13 px, accent bar instead of the amber tint, solid hover, 14 px indent steps',
  },
];
