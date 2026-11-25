import type { Note } from '../components/catalog-review-view';

// Release notes 0.21 (the first release as @agentage/components), from the 0.20.2 comparison.
export const NOTES_LOOK: Note[] = [
  ['Controls', 'Button md 28 px, sm 24 px, 13 px text, radius 8 px; the 32 px size is gone.'],
  [
    'Fields',
    'Input, Select, DatePicker trigger: md 30 px (was 36), sm 26 px, radius 6 px, no tinted fill.',
  ],
  [
    'Card',
    'One flat surface with 12/14 padding (was shadowed); `variant="flat"` renders the same.',
  ],
  [
    'Table, DataView',
    '32 px header in regular 12 px muted text (was 40 px uppercase), 36 px rows (was about 49).',
  ],
  ['Chart and stat cards', 'Compact 12/14 padding (was p-4 or p-5).'],
  ['Alert', '12 px padding and 13 px text.'],
  ['Avatar', 'Default size is sm 28 px (was md 40 px); sm shrank from 32 to 28, xs from 24 to 22.'],
  ['Badge, Chip, Kbd', 'Badge 20 px (was 22), Chip 24 px, Kbd 20 px.'],
  ['PageHeader, Sidebar', 'Header 48 px; rows 28 px.'],
  ['Section', 'An open form section: a rule and air between siblings, no box.'],
  ['Tabs', '38 px list with a 2 px accent bar (line) or a 34 px tray (pill).'],
  ['Menus', '210 px wide, 28 px items, 13 px text; `size="md"` keeps the old menu.'],
  [
    'Tokens',
    'Lighter info colour, `--text-2xs` 11 px, `--duration-fast` 140 ms, `--duration-normal` 180 ms.',
  ],
  ['Button', '`outline` loses its shadow; no transition on every property.'],
  ['Focus', 'One inset accent outline replaces the old ring on every control.'],
  [
    'Overlays',
    'Popover, Tooltip, Sheet, Dialog, Toast: new popover shadow and a short fade-and-drop entrance.',
  ],
  [
    'Copy buttons',
    'Every copy button is the 24 px small control with a 14 px glyph; rows keep their height.',
  ],
  [
    'Selected rows',
    'The amber selected bar spans the full row height; no left border line on a selected row.',
  ],
  ['Toast', 'Tinted toasts are opaque; the dismiss button is 24 px.'],
];

export const NOTES_NEW: Note[] = [
  [
    'Package',
    'The package is now `@agentage/components`; `@agentage/design-system` stays at 0.20.2.',
  ],
  [
    'Components',
    'ActionBar, ActiveFilters, CheckList and CheckItem, ContentBlock and ContentBlocks, Count, DataTree, DataView (list, table and board), Description list parts, DirtyBar, Disclosure, DisplayMenu, EntityCard, FilterMenu, GroupHeader, InlineEdit, InlineText, InspectorPanel, List, ListToolbar parts, LogView, MetaItem, NavRow, NavTree, Priority and Status glyphs, Property family (text, select, multi, date, value), RelativeTime, RowMenu, SecretInput, SectionIndex, SectionLabel, StatusBar, Step and StepList, ToolbarSearch, ToolbarToggle, TreeSelect, Truncate, ViewSwitch, DropdownMenu checkbox and radio items.',
  ],
  [
    'Hooks and helpers',
    'useControlled, usePersistedState, useRovingFocus, useListControls, useAnnounce, useScrollSpy, useCollapsible, formatRelativeTime, parseRelativeRange, resolveDateRange, describeCron, fieldVariants, controlVariants.',
  ],
  ['Entries', '`@agentage/components/charts` and `@agentage/components/site`.'],
];

// New props, one row per component (from the release notes).
export const NOTES_NEW_PROPS: Note[] = [
  ['Accordion', '`value`, `onValueChange`, `storageKey`, `variant`, `level`'],
  ['Alert', '`title`, `actions`, `variant="primary"`'],
  ['Avatar', '`icon`, `shape`, `tone`, size `2xs`'],
  ['Badge', '`count`, `max`, `size`, solid and outline-tone variants'],
  ['Button', '`pending`, `variant="outline-primary"`'],
  [
    'Card',
    '`state`, `skeleton`, `empty`, `error`, `onRetry`, `minHeight`, `padding`, `interactive`, `selected`, `announceLabel`',
  ],
  ['Checkbox, Switch', '`defaultChecked`, `size`'],
  ['Chip', '`pressed`, `size`'],
  ['Collapsible trigger', '`chevron`, `count`'],
  ['Select', '`searchable`, `defaultValue`, `size`, `labels`'],
  ['DataView', '`state`, `defaultState`, `actions`, column `searchable`, `visibility`, `twoLine`'],
  ['DatePicker', '`mode="range"`, `presets`, `defaultValue`, `size`'],
  ['DropdownMenu', '`open`, `defaultOpen`, `onOpenChange`, `closeOnSelect`, `size`'],
  ['EmptyState', '`align`'],
  ['FormField', '`layout`, `preview`'],
  ['Input, Textarea', '`mono`, `size`; Textarea `autoGrow`'],
  ['ListRow', '`selected`, `kind`, `icon`, `alert`'],
  ['PageHeader', '`meta`, `tabs`, `variant`, `size`'],
  ['Popover', '`label`, `side`'],
  ['Progress', '`showValue`, `formatValue`, `meter`, `segments`, `legend`, `size`'],
  [
    'StatCard',
    '`hint`, `icon`, `state`, `fallback`, `footer` (with `CardMeta`), `children` under the value, `trend.sentiment`',
  ],
  ['Tabs trigger', '`count`, `dirty`'],
  ['ToggleButton', '`variant`, `iconOnly`'],
  ['ToggleGroup', '`disabled`, `variant="segmented"`'],
  ['Dialog', '`pending`, `confirmText`, `tone`'],
  ['MiniBars', '`tone`'],
  ['Avatar', 'meaning `tone` values on the square tile'],
  ['DatePicker range', '`expression` on the value, resolved by `resolveDateRange(range, now)`'],
];

export const NOTES_RENAMED: Note[] = [
  [
    'Modal, AlertDialog, ConfirmByTyping',
    'Now one `Dialog`: `onConfirm` makes it a confirm dialog, `tone="destructive"` colours Confirm, `confirmText` asks to retype a phrase. `ModalFooter` is `DialogFooter`.',
  ],
  ['InspectorPanel', 'Now `<Sheet mode="docked">`; Sheet `header` is `actions`.'],
  [
    'Combobox, Select parts',
    'Now one `Select` with `options`; `searchable` adds the search box. `ComboboxOption` is `SelectOption`.',
  ],
  ['EntityList', 'Now `List` (it was an alias); `label` is the native `aria-label`.'],
  [
    'Popover, ToggleGroup, PageHeader',
    '`isOpen`/`onClose` are `open`/`onOpenChange`; `onChange` is `onValueChange`; `subtitle` is `description`. No aliases.',
  ],
  [
    'StatCard',
    '`description` and `comparison` are one `hint` line; `trend.up` is `trend.direction`; `pressable` is implied by `onClick`; `indicator` is `icon`.',
  ],
  [
    'Card, StatCard states',
    '`skeleton`, `empty`, `error`, `onRetry` are one `fallback` object `{ loading, empty, error, onRetry }`.',
  ],
  [
    'CardFooter meta',
    '`source`, `updatedAt`, `stale`, `onRefresh`, `refreshing` moved to the `CardMeta` part, placed inside the footer.',
  ],
  [
    'DataView',
    'See the DataView row under Removed: the state, selection and action props are now `state`, `defaultState` (with its `storageKey` field) and `actions`.',
  ],
  ['DirtyBar, TreeSelect', 'The per-button label props are one `labels` object.'],
  [
    'Progress',
    '`role="meter"`, `labelPosition` and `thresholds` are one `meter` flag; a missing `value` is indeterminate.',
  ],
  ['MiniBars, Heatmap', '`color` is `tone` only.'],
];

export const NOTES_DEPRECATED: Note[] = [
  [
    'Deprecated family',
    'FilterBar and its parts (use ListToolbar), NavLink (NavRow), PageLayout (PageHeader), StatusDot (StatusGlyph), UsageMeter (Progress `meter`).',
  ],
  [
    'StatCard parts',
    'StatBreakdown (Progress `segments` + `legend`), StatProgress (Progress), StatComparison (the `hint` line + `trend`).',
  ],
  [
    'Site parts',
    'Footer, TopBar, DocSidebar, MarkdownRenderer and the `./site` entry: docs-site chrome, now in the docs code. CopyButton stays in Foundations.',
  ],
  [
    'Unused',
    'HoverCard (Popover), Slider, QuotaBanner (Alert + Progress), ContextMenu (DropdownMenu), ScrollArea (native overflow), Separator (a 1 px div), Heading (plain h1-h4), DangerZone (a Card with a destructive Dialog, on the Dialog page).',
  ],
  [
    'Folded',
    'IconContainer is `<Avatar shape="square" icon tone>`; EntityCard is internal (DataView cards and board; the Item card composition on the Card page); DataTable is internal (use DataView or Table).',
  ],
  [
    'Internal now',
    'ContentBlock, InlineText, Count, DisclosureChevron, RowMenu, ListToolbarIcons, every `*Variants` helper except `buttonVariants`, `useControlled`, `usePersistedState`, `useRovingFocus`, `useCollapsible`, `compareValues`, `nextSortState`, `cardSurface`. Only modules the barrel re-exports get a subpath.',
  ],
  [
    'DataView props',
    '`searchKeys` (column `searchable`), `searchPlaceholder` (from `aria-label`), `rowLabel`, `rowMenuLabel` (from the id and title columns), `quickToggles` (a `filter: "toggle"` column with `visibility: "none"`), `rowLines` (column `twoLine`), `showHeader` (shown when a column has a header), `defaultHidden` (`visibility: "optional"`), `selection`, `selectedIds`, `defaultSelectedIds`, `onSelectionChange`, `isRowSelected`, `rowActions`, `defaultGroupBy`, `defaultSort`, `rowsBy`, `onRowOpen`, `rowMenu`, `bulkActions`, `onAddToGroup`, `onMove`, `emptyState`.',
  ],
  [
    'Sizes and looks',
    'Button `default`/`lg`/`icon-md`/`icon-lg`, IconButton `lg`, Badge `md`, menu `md` and the DropdownMenu `size`, Tabs `default`/`underline`, Card `variant`, Section `boxed`, Avatar `xl`/`2xl`, Dialog `size`, PageHeader `size`, every `density` prop.',
  ],
  [
    'Dependencies',
    '`@radix-ui/react-select` is gone; `react-markdown`, `remark-gfm`, `rehype-raw` are docs-only.',
  ],
];

export const NOTES_BEHAVIOUR: Note[] = [
  [
    'Input size',
    'A number still sets the native `size` attribute (character width); `sm` and `md` set the height. No change needed.',
  ],
  [
    'Avatar',
    'No size gives 28 px (pass `size="md"` for 40); with no image it has `role="img"` and the name as label.',
  ],
  ['Progress', '`aria-valuenow` clamps to 0..max; max 0 renders 0 percent; adds `aria-valuetext`.'],
  ['DataView sort', 'Descending order puts empty values last; still stable and client side.'],
  [
    'Dialog, Sheet',
    'Escape closes only the top overlay; scroll lock is counted across nested overlays.',
  ],
  [
    'Popover',
    'Focus moves in on open and back to the trigger on close; Tab past the last control closes it.',
  ],
  ['Tooltip', 'Escape closes only the tooltip, not an overlay behind it.'],
  [
    'Dialog confirm',
    'A promise from `onConfirm` keeps it open until it resolves; a rejection keeps it open.',
  ],
  ['Toast', 'Hover and focus pause the timer; `duration` 0 or less keeps it until dismissed.'],
  ['Command', 'Arrow keys follow DOM order, so late items are reached in visible order.'],
  [
    'DropdownMenu',
    'Focus returns to the trigger on close; checkbox and radio items stay open on select.',
  ],
  [
    'Checkbox, Switch, Select',
    '`checked={undefined}` or `value={undefined}` stays controlled and empty, as in 0.20.2 (locked by tests).',
  ],
  [
    'StatCard',
    'With `onClick` the title is the stretched control; the footer link is not nested in it.',
  ],
  ['Chip', '`pressed` adds `aria-pressed`; without it a clickable chip keeps button semantics.'],
  [
    'DatePicker',
    'Locale text waits for mount; day values use local parts, so east zones no longer show the previous day.',
  ],
  [
    'Accordion, Tabs, Resizable',
    'A changing panel count and a stored value of another shape fall back to the default.',
  ],
  [
    'Button',
    'With no `type` it renders `type="button"`, so it no longer submits a form; pass `type="submit"`.',
  ],
  [
    'Overlays',
    'While a dialog or an open Select is on top, a press outside it closes nothing below it.',
  ],
  [
    'Toast',
    'Error toasts sit in their own group above the others; the polite live region moved inside the container.',
  ],
  ['StatCard', 'A pressable card root is a `div`, so `ref` points to the card, not to the button.'],
  [
    'StatCard',
    'A falling `trend` draws a falling arrow (it always rose before); the colour follows `trend.sentiment`.',
  ],
  [
    'Chart cards',
    'The default number format uses one fixed locale (18,420), so server and client text match; pass `format` for another.',
  ],
  [
    'DatePicker range',
    'Relative picks keep an `expression`; resolve it at read time so "Last 24 hours" moves with the clock.',
  ],
  [
    'Sheet docked',
    'List its `storageKey` in `ResizableSplitPrepaint` and the server HTML already has the stored width.',
  ],
  [
    'Select',
    'The trigger has `role="combobox"` (tests that query a button break); `id` and `aria-*` field props go to the trigger, so a FormField label names it.',
  ],
  [
    'ListToolbar',
    'At narrow widths it folds in steps (labels, then search to an icon, then a More menu) and stays one row.',
  ],
  ['InlineEdit', 'Enter and Escape keep focus in the field.'],
  [
    'DataView board',
    'Tab follows the columns (lane, column, position); a keyboard move keeps focus on the card.',
  ],
  ['Sheet docked', 'Close returns focus to where it was opened from.'],
];

// What this round did not verify. Append rows.
export const KNOWN_LIMITS: Note[] = [
  [
    'Container e2e suite',
    'Not run in the container image; the screenshot baselines are not regenerated.',
  ],
  ['Real consumers', 'No app runs on 0.21 yet; compat tests stand in for them.'],
  [
    'Screen readers',
    'No pass with a real screen reader; roles and names are checked by tests and axe only.',
  ],
  ['Touch', 'Only emulated touch was checked; no real phone or tablet.'],
  [
    'Stored state under SSR',
    'DataView view, sort and groups, List groups and Accordion show the default in the server HTML until the bundle runs; pass controlled state from a cookie to avoid it.',
  ],
  [
    'Select axe rule',
    '`aria-hidden-focus` on the page root while a Select is open is a portal artefact: focus cannot leave the listbox.',
  ],
  [
    'Narrow toolbar under SSR',
    'The toolbar folds after hydration, so a narrow server-rendered page can paint the wide row once.',
  ],
  [
    'Board drag on touch',
    'A long press of 300 ms starts a drag; checked with emulated touch only.',
  ],
];
