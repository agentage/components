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
    rec: 'Multi-value Select: chips in the field, Backspace removes the last one.',
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

export const SUGGEST_UPDATE: Suggestion[] = [
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
];

export const SUGGEST_RESTRUCTURE: Suggestion[] = [
  {
    item: 'Docs Core first',
    rec: 'Done in this round: Core leads the sidebar and the index; pages keep their category URL.',
    effort: 'small',
  },
  {
    item: 'Variant to tone',
    rec: 'Alert and Badge still name their colour meaning `variant`; rename to `tone` (Badge mixes tone and outline style, so split it first).',
    effort: 'small',
  },
];
