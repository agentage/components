# @agentage/components

![Agentage Components - OKLCH tokens + React components, ready to install](https://github.com/agentage/components/raw/master/docs/banner.svg)

OKLCH design tokens and about 60 accessible React 19 components in one package. Install it, import
the theme, and you have a coherent dark/light UI kit - buttons through data views, stat cards,
dialogs and command palettes.

Browse every component live at **[ds.agentage.io](https://ds.agentage.io)**.

## Moving from `@agentage/design-system`

`@agentage/design-system` is frozen at 0.20.2 for the apps that still use it. To move to
`@agentage/components`:

1. Swap the package: `npm uninstall @agentage/design-system && npm install @agentage/components`.
2. Replace `@agentage/design-system` with `@agentage/components` in imports, in the CSS import
   (`@agentage/components/theme.css`) and in the Tailwind `@source` glob
   (`node_modules/@agentage/components/dist/**/*.js`). Subpaths keep their names.
3. Expect the denser look: 28 px buttons, 30 px fields, 36 px rows, flat 12/14 px cards. The
   "Catalog review" page in the showcase lists every visual change.
4. The new package is smaller than 0.20.2: there are no deprecated names and no aliases. Replace
   removed components as below; the "Catalog review" page lists every removed and renamed export.

| 0.20.2                                                                                    | Use now                                                                                                                         |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Modal`, `AlertDialog`, `ConfirmByTyping`, `DangerZone`                                   | `Dialog` (`onConfirm`, `tone="destructive"`, `confirmText`), in a `Card`                                                        |
| `InspectorPanel`                                                                          | `<Sheet mode="docked">`                                                                                                         |
| `Combobox`, the Radix `Select` parts                                                      | `Select` with `options` (`searchable` for the search box)                                                                       |
| `DataTable`, `EntityCard`                                                                 | `DataView` (or `Table` parts); the Item card composition on the Card page                                                       |
| `EntityList`                                                                              | `List`                                                                                                                          |
| `StatCard` `period`, `comparison`, `chart`, `facts` and co.                               | `hint`, `trend`, and children: `Sparkline`, `DescriptionList variant="inline"`, `Progress`, `StatusBar`; `CardMeta` in `footer` |
| `IconContainer`                                                                           | `<Avatar shape="square" icon tone>`                                                                                             |
| Chart cards (Gauge, Donut, Score, Funnel, Heatmap and co.)                                | `StatCard` with `Sparkline` or `MiniBars`                                                                                       |
| `FilterBar`, `NavLink`, `PageLayout`, `StatusDot`, `UsageMeter`                           | `ListToolbar`, `NavRow`, `PageHeader`, `StatusGlyph`, `Progress meter`                                                          |
| `HoverCard`, `ContextMenu`, `Slider`, `QuotaBanner`, `ScrollArea`, `Separator`, `Heading` | `Popover`, `DropdownMenu`, `Input type="number"`, `Alert` with `Progress`, native overflow, a 1 px div, plain headings          |
| `Footer`, `TopBar`, `DocSidebar`, `MarkdownRenderer`, the `./charts` and `./site` entries | removed (docs-site chrome); `CopyButton` stays                                                                                  |

## What is this?

The component library behind the Agentage dashboard, admin console and public sites, published as a
plain npm package so anything can use it.

It is deliberately unopinionated about your framework. It ships **standard ESM with one file per
component**, so tree-shaking works, and every interactive component already carries `'use client'`,
so it drops into a Next.js App Router server tree without wrappers or `dynamic()` tricks. Colors
are defined in [OKLCH](https://oklch.com), so the light and dark themes are perceptually matched
rather than hand-tuned, and contrast holds up under WCAG AA.

## Get started

### 1. Install

```bash
npm install @agentage/components
```

Peers: `react` and `react-dom` >= 19. `tailwindcss` >= 4 is an optional peer - the components
carry Tailwind utility classes, so you need it unless you ship your own compiled CSS.

### 2. Load the theme

```tsx
// app/layout.tsx (or your root entry)
import '@agentage/components/theme.css';
```

### 3. Point Tailwind at the shipped bundle

```css
/* globals.css - Tailwind v4, CSS-first config */
@import 'tailwindcss';
@import '@agentage/components/theme.css';

@source "../../node_modules/@agentage/components/dist/**/*.js";
```

> Tailwind must scan the **shipped JS**, not the source, or every component class is
> tree-shaken out of your build. The glob has to resolve to wherever npm actually hoisted the
> package - in a workspace that is the repo-root `node_modules`, not the package-local one. This
> is the single most common cause of "the components render unstyled".

### 4. Use it

```tsx
import { Button, Card, CardHeader, CardTitle, StatCard } from '@agentage/components';

export const Panel = () => (
  <Card>
    <CardHeader>
      <CardTitle>Storage</CardTitle>
    </CardHeader>
    <StatCard title="Stored" value="12,480" hint="64% of the plan" />
    <Button>Open</Button>
  </Card>
);
```

Full walkthrough: [ds.agentage.io/install](https://ds.agentage.io/install).

## What's in it

59 documented component pages in seven categories plus 11 patterns, each with props generated from
the source. The **Core** set (Button, Card, Input, Select, List, DataView, Dialog, Toast and more)
sits at the top of the docs sidebar.

| Category                                                          | What's there                                                                                                                                                        |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Foundations](https://ds.agentage.io/components/foundations) (11) | Button, IconButton, Badge, Chip, Avatar, Kbd, Skeleton and Spinner, StatusGlyph and PriorityGlyph, Prose, CopyButton, hooks                                         |
| [Forms](https://ds.agentage.io/components/forms) (11)             | Input and Textarea, SecretInput, Select, TreeSelect, DatePicker, Checkbox and Switch, RadioGroup, ToggleGroup, FormField and Label, Section, InlineEdit             |
| [Navigation](https://ds.agentage.io/components/navigation) (7)    | NavRow and NavTree, Sidebar, Tabs, Breadcrumb, Pagination, SectionIndex, PageHeader                                                                                 |
| [Lists and data](https://ds.agentage.io/components/lists) (6)     | List (with GroupHeader), Table, DataView, ListToolbar, LogView, DataTree                                                                                            |
| [Display](https://ds.agentage.io/components/display) (13)         | Card, StatCard, Sparkline, DescriptionList, Progress, StatusBar, RelativeTime, CodeBlock, ContentBlocks, EmptyState, Collapsible, Accordion, StepList and CheckList |
| [Overlays](https://ds.agentage.io/components/overlays) (7)        | Dialog, Sheet, Popover, Tooltip, DropdownMenu, Command palette, Resizable panels                                                                                    |
| [Feedback](https://ds.agentage.io/components/feedback) (4)        | Alert, Toast, DirtyBar, ActionBar                                                                                                                                   |
| [Patterns](https://ds.agentage.io/components/patterns) (11)       | List page, card grid, catalog with views, board, master and detail, detail view, history, settings form, logs explorer, file browser, monitoring                    |

Beside the pages, composable parts (`CardHeader`, `TableRow`, `CommandItem` and friends) are
exported too. Only the modules the barrel re-exports have a subpath in the
[exports map](./package.json); parts files and helpers stay internal.

## Server components

Every interactive component ships `'use client'` as line 1 of its emitted module, and the build
preserves one output file per source module. So the barrel is safe to import from a React Server
Component - only the components you actually use that need the client runtime cross the boundary.

```tsx
import { Card } from '@agentage/components/card'; // server-safe
import { Dialog } from '@agentage/components/dialog'; // 'use client', already declared
```

No server-safe module transitively imports a client module, so importing `Card` never drags a
client boundary into your server tree. Per-component subpaths exist for consumers who want to keep
that graph explicit; the barrel works too.

## Theming

Three tiers, composed by `theme.css`:

| Layer            | Import                                | What it holds                                       |
| ---------------- | ------------------------------------- | --------------------------------------------------- |
| `primitives.css` | `@agentage/components/primitives.css` | Raw OKLCH scales - 11 stops each, theme-independent |
| `tokens.css`     | via `theme.css`                       | Semantic tokens, typography, shadows                |
| `base.css`       | via `theme.css`                       | Element resets                                      |

Dark is the default. Switch with one attribute on `<html>`:

```tsx
document.documentElement.setAttribute('data-theme', 'light'); // dark | light | system
```

`system` follows `prefers-color-scheme`. Override any semantic token in your own CSS to rebrand
without forking - see [ds.agentage.io/theming](https://ds.agentage.io/theming).

## Requirements

| Requirement | Version | Note                                                |
| ----------- | ------- | --------------------------------------------------- |
| React       | >= 19   | Peer, required                                      |
| React DOM   | >= 19   | Peer, required                                      |
| Tailwind    | >= 4    | Optional peer - needed unless you ship your own CSS |
| Node        | >= 22   | Build/dev only; the package itself is browser code  |

Ships ESM only, with a `.d.ts` beside every module.

## Develop

```bash
npm install
npm run dev       # component showcase (Vite) on :5174
npm run verify    # type-check + lint + format + exports:check + test + build
npm run test:e2e  # Playwright: axe WCAG A/AA scan + screenshot baselines
```

- `src/components` - the components, barrel-exported from `src/index.ts`. Add `'use client'` as
  line 1 to anything using state, effects, refs, context, portals, DOM APIs or event handlers.
- `src/styles` - the OKLCH token and base-style CSS.
- `src/lib` - `cn` and helpers.
- `dev/` - the showcase deployed to ds.agentage.io.

Run `npm run exports:generate` after adding or renaming a component; `exports:check` fails
`verify` when the exports map drifts.

Regenerate Playwright screenshot baselines inside the CI image, never on the host - font metrics
must match:

```bash
docker run --rm --ipc=host -v "$PWD":/work -w /work -u "$(id -u):$(id -g)" -e HOME=/tmp \
  mcr.microsoft.com/playwright:v1.65.1-noble npx playwright test --update-snapshots
```

## Release

`prepare-release.yml` (dispatched, or run by hand) opens a `chore(release): X.Y.Z` PR and arms
auto-merge; on the merge `release.yml` runs `verify`, publishes with
`npm publish --access public --provenance` through npm trusted publishing (OIDC, no token) and tags
`vX.Y.Z`.

## Contributing

Issues and PRs welcome at
[github.com/agentage/components](https://github.com/agentage/components). Branch off
`master`, keep `npm run verify` green, and add a test when you change interactive behavior.

## License

MIT - see [LICENSE](./LICENSE).
