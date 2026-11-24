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
}

export const ROWS: BeforeAfterRow[] = [
  {
    route: 'foundations/button',
    status: 'changed',
    change:
      'text 12 to 13 px, radius 6 to 8 px on every size, ghost hover solid, outline without shadow',
  },
  {
    route: 'foundations/badge',
    status: 'changed',
    change: 'height 22 to 20 px, new solid pill',
    props: 'variant="solid", count',
  },
  {
    route: 'foundations/avatar',
    status: 'changed',
    change:
      'avatar default 40 to 28 px, xs 24 to 22 px, semibold initials; IconButton 24/28/32 px fixed with pressed; IconContainer md 32 to 28 px',
    props: 'Avatar tone (meaning tones on the square tile), IconButton pressed',
  },
  {
    route: 'foundations/skeleton-and-spinner',
    shot: 'loading',
    status: 'unchanged',
    change: 'already compact',
  },
  {
    route: 'display/stat-card',
    status: 'changed',
    change:
      'one card surface (bg-card), padding 20 to 12/14 px, 8 px gaps, label 11 px caps to 12 px, value 24 to 20 px, no hover shadow; charts, facts, breakdown and history are children under the value',
    props:
      'hint, trend.direction, trend.sentiment, state, fallback, footer with CardMeta, children',
  },
  {
    route: 'lists/table',
    status: 'changed',
    change:
      'the dense look is the default of the bare parts: row 43 to 36 px, text 14 to 13 px, header 40 to 32 px plain 12 px, hover solid',
  },
  {
    route: 'lists/list',
    shot: 'entity-list',
    status: 'changed',
    change:
      'row 63 to 52 px (two-line) and 36 px (one-line), 13/600 title; EntityList gains a data mode (groups, selection, keys) and the 54 px stacked layout; preferred name List',
    props: 'List items, variant, groupBy, value, storageKey; ListRow',
  },
  {
    route: 'navigation/pagination',
    status: 'changed',
    change: 'page buttons 32 to 28 px, text 14 to 13 px',
  },
  {
    route: 'display/empty-state',
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
    route: 'display/code-block',
    status: 'changed',
    change: 'header 37 to 32 px, code 14 to 12 px, padding 16 to 10/12 px, copy button 24 px',
  },
  {
    route: 'display/progress',
    status: 'changed',
    change: 'new visible value beside the bar and a 6 px size',
    props: 'showValue, size',
  },
  {
    route: 'forms/input',
    status: 'changed',
    change:
      'Input and Select 36 to 30 px, text 14 to 13 px; FormField row layout; Textarea auto-grow',
    props:
      'Input/Textarea/Select size sm | md + mono, Textarea autoGrow + minRows, FormField layout',
  },
  { route: 'forms/form-field', shot: 'label', status: 'changed', change: 'Label text 14 to 13 px' },
  {
    route: 'forms/checkbox-and-switch',
    shot: 'checkbox',
    status: 'changed',
    change: 'Checkbox 16 and 13 px, Switch md and sm, one focus ring',
  },
  { route: 'forms/radio-group', status: 'changed', change: 'label 14 to 13 px' },
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
    props: 'variant="primary", title, actions',
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
    route: 'overlays/dialog',
    shot: 'modal',
    status: 'changed',
    change:
      'header padding 16 to 12/16 px, title 18 to 14 px, text 13 px, 28 px close, shadow visible on dark; confirm dialogs: padding 24 to 16 px, Button actions 36 to 28 px',
  },
  {
    route: 'overlays/sheet',
    status: 'changed',
    change: 'header padding 16 to 12/16 px, title 18 to 14 px, text 13 px, 28 px close',
  },
  {
    route: 'overlays/popover',
    status: 'changed',
    change: 'padding 16 to 12 px, min width 300 to 240 px, 13 px text, shadow visible on dark',
  },
  {
    route: 'overlays/command',
    status: 'changed',
    change: 'items 36 to 28 px, 13 px text, input 30 px, Esc as Kbd, popover shadow',
  },
  {
    route: 'navigation/page-header',
    status: 'changed',
    change:
      'bar 52 to 48 px, icon box 28 to 24 px, actions 28 px 13 px; new detail variant with meta and tabs',
    props: 'variant="detail", meta, tabs; title and description take ReactNode',
  },
  {
    route: 'forms/section',
    status: 'changed',
    change: 'open by default: no box, 16/600 title, 1 px rule with 26 px air; new SectionLabel',
    props: 'SectionLabel',
  },
  {
    route: 'navigation/sidebar',
    status: 'changed',
    change:
      'nav row 36 to 28 px, the shared row recipe (13 px, 6 px radius, accent bar), solid hover',
  },
  { route: 'overlays/resizable', status: 'unchanged', change: 'handles are already 1 px' },
  {
    route: 'navigation/breadcrumb',
    status: 'changed',
    change: 'text 14 to 13 px; new mono path variant with slashes',
    props: 'Breadcrumb variant="path"',
  },
  {
    route: 'foundations/prose',
    status: 'changed',
    change: 'table and pre rules, inline code 14 px to 0.92 em; new size sm (13 px)',
    props: 'size',
  },
  { route: 'foundations/kbd', status: 'changed', change: 'text 10 to 11 px, radius 4 to 6 px' },
  {
    route: 'display/collapsible',
    status: 'changed',
    change: 'trigger 36 to 28 px, 13 px, chevron and count; height animates, inert when shut',
    props: 'CollapsibleTrigger chevron, count',
  },
  {
    route: 'display/accordion',
    status: 'changed',
    change:
      'trigger 52 to 36 px, 13 px, leading chevron, solid hover; height animates, inert when shut',
    props: 'AccordionTrigger count',
  },
  {
    route: 'foundations/copy-button',
    status: 'changed',
    change: '24 px by default, Button text 12 px',
  },
];
