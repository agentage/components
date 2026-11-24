import type { Suggestion } from '../components/catalog-review-view';

// Suggestions: the coordinator appends rows to these arrays; `context` is the screen (Add) or what breaks (Remove).
export const SUGGEST_ADD: Suggestion[] = [
  {
    item: 'Calendar grid',
    rec: 'Month grid with arrow-key moves under DatePicker; presets and typed input stay.',
    effort: 'medium',
    context: 'date filters, schedule forms',
  },
  {
    item: 'Tag input',
    rec: 'Multi-value Combobox: chips in the field, Backspace removes the last one.',
    effort: 'medium',
    context: 'label and filter editing on detail views',
  },
  {
    item: 'Reorderable List',
    rec: 'List rows on the existing drag reorder hook, with keyboard move up and down.',
    effort: 'medium',
    context: 'ordered settings, priority lists',
  },
  {
    item: 'Status matrix',
    rec: 'Only if rows of StatusBar stop scaling: items by time slots in one grid.',
    effort: 'medium',
    context: 'monitoring overview with many services',
  },
  {
    item: 'File viewers',
    rec: 'Image preview with zoom and fit; tabular preview on DataTable for delimited text.',
    effort: 'medium',
    context: 'file browser preview pane',
  },
  {
    item: 'Chart primitive',
    rec: 'Line, bar and area with axes, tooltip and both themes; chart cards render on it.',
    effort: 'large',
    context: 'monitoring, usage and trend screens',
  },
  {
    item: 'Virtualised DataTable',
    rec: 'Windowed rows for thousands of rows; keep keyboard focus and selection.',
    effort: 'large',
    context: 'logs, large lists',
  },
];

export const SUGGEST_REMOVE: Suggestion[] = [
  {
    item: 'Deprecated set',
    rec: 'Remove FilterBar, NavLink, PageLayout, StatusDot, UsageMeter and the renamed props at the next major.',
    effort: 'medium',
    context: 'apps that still import them or pass the old prop names',
  },
  {
    item: 'Charts and Site',
    rec: 'Own entries now (/charts, /site); move to a separate package at the next major.',
    effort: 'medium',
    context: 'barrel imports of chart cards and site parts',
  },
  {
    item: 'Accordion and Collapsible',
    rec: 'Checked: no duplicated logic, both render the shared Disclosure body. Keep both.',
    effort: 'small',
    context: 'nothing',
  },
  {
    item: 'HoverCard',
    rec: 'No consumer in src or patterns. Deprecate in 0.22, remove at the next major.',
    effort: 'small',
    context: 'apps that use it; Popover or Tooltip replace it',
  },
  {
    item: 'Slider',
    rec: 'No consumer in src or patterns. Keep as a generic form control; review at the next major.',
    effort: 'small',
    context: 'range fields in settings forms',
  },
  {
    item: 'Combobox',
    rec: 'No pattern consumer. Keep: it is the base of the tag input.',
    effort: 'small',
    context: 'nothing',
  },
  {
    item: 'useDragReorder export',
    rec: 'Done in 0.21: internal, no barrel export (one consumer, the DataView board). The subpath stays.',
    effort: 'small',
    context: 'nothing released (new in 0.21)',
  },
];

export const SUGGEST_UPDATE: Suggestion[] = [
  {
    item: 'Prop naming leftovers',
    rec: 'Sweep for isOpen, onClose, onChange, subtitle and compact outside the aliased set; one name per idea.',
    effort: 'small',
  },
  {
    item: 'Light theme review',
    rec: 'Page-by-page pass in light and App theme; the dark theme got the most review.',
    effort: 'medium',
  },
  {
    item: 'e2e baselines',
    rec: 'Regenerate the screenshot baselines in the container image after the look changes.',
    effort: 'small',
  },
  {
    item: 'Highlight subpath',
    rec: 'Internal module with its own subpath; rename it to a parts file or skip it in the exports generator.',
    effort: 'small',
  },
];

export const SUGGEST_RESTRUCTURE: Suggestion[] = [
  {
    item: 'index.ts by category',
    rec: 'Barrel sections in the docs category order, one heading comment each.',
    effort: 'small',
  },
  {
    item: 'Docs Core first',
    rec: 'Done in this round: Core leads the sidebar and the index; pages keep their category URL.',
    effort: 'small',
  },
  {
    item: 'Charts and Site folded',
    rec: 'Done in this round: folded at the end of the sidebar and the index.',
    effort: 'small',
  },
];
