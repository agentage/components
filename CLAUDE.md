# CLAUDE.md - @agentage/components

Single source of truth for Agentage Components (OKLCH tokens + React components), repo `agentage/components`, package `@agentage/components`. The old repo `agentage/design-system` and the package `@agentage/design-system` stay frozen at 0.20.2 for old production apps. Standalone repo since 2026-07; was previously duplicated as a `packages/design-system` copy inside both `agentage/web` and `agentage/landing`, which silently diverged on the same version. Consumers migrate to the published npm package.

## Layout

- `src/components` - React components. The public surface is `src/components/index.ts` (one block per docs category), re-exported by `src/index.ts`; parts files (`x.parts.tsx`, `x.variants.ts`, internal components such as `DataTable`, `EntityCard`, `ContentBlock`) are not in the barrel and get no subpath. Interactive ones carry `'use client'` as line 1.
- `src/styles` - OKLCH CSS: `primitives.css` (raw scales) → `tokens.css` (semantic) → `base.css` (resets), composed by `theme.css`.
- `src/lib` - `cn` + helpers.
- `dev/` - the docs site (`npm run dev`, :5174), deployed to ds.agentage.io. Not published, not linted, but type-checked (`tsconfig.dev.json`). Structure: `app.tsx` shell (header + sidebar + routed outlet) · `lib/router.tsx` hand-rolled History-API router (no react-router; nginx and `vite preview` both fall back to `index.html`) · `registry.tsx` the catalog every page, the sidebar and ⌘K read from, assembled from one `registry/<category>.tsx` per category · `demos/<slug>.tsx` one demo file per page, exporting `Example` plus any of `Variants`, `Sizes`, `States`, `Composition` (rendered in that order by `registry/sections.ts`; patterns live in `demos/patterns/`) · `pages/` component/category/home/install/theming · `components/` docs-only widgets and docs-site chrome (`doc-sidebar`, `markdown`, `heading`; not in the package) · `registry/sections.ts` `more()` puts a second component on the same page · `generated/props.ts` (do not hand-edit).
- Routes: `/`, `/install`, `/theming`, `/components`, `/components/:category`, `/components/:category/:component`. Adding a component = add a `demos/` file + one entry in its `registry/<category>.tsx`; the sidebar, the index page, ⌘K and the e2e a11y sweep all pick it up automatically.

## Build / verify

- `npm run build` - `tsc --noEmit` + Vite lib build. Output is **one file per source module** (`rollupOptions.output.preserveModules`), each with its own `.d.ts` beside it (vite-plugin-dts, no `rollupTypes`). Runtime `dependencies` are external so their own client boundaries survive.
- `npm run build:showcase` - `props:generate` + Vite static build of the `dev/` docs site → `dist-showcase/` (deployed to ds.agentage.io).
- `npm run props:generate` - regenerates `dev/generated/props.ts` (prop tables + export→subpath map) from the component sources via the TypeScript checker. Run it after changing any public props type; `build:showcase` runs it anyway, so a stale file can never deploy. (react-docgen-typescript was tried and mis-resolved 15 of 68 components in files that export several components next to cva variants.)
- `npm run verify` - type-check (src + dev + e2e) + lint + format:check + exports:check + test:coverage + build + `pack:smoke` (CI runs this on PR + push). Coverage floor is 70% lines/functions/branches/statements over `src/`.
- `npm run pack:smoke` - after `build`: packs the tarball, extracts it into a temp consumer, checks every subpath (runtime exports vs `.d.ts` value exports, type-check under NodeNext and bundler, CSS entries, tarball contents). Every `src` module is a build entry (a non-entry module would lose exports the barrel does not re-export) and `vite.config.ts` rewrites `.d.ts` imports to `.js`. Needs no network (react comes from the repo `node_modules`).
- `npm run test:e2e` - Playwright against the built showcase (`build:showcase` → `vite preview` :4173 → chromium): axe WCAG A/AA sweep of every component page in both themes (one test per category, client-side navigation so the whole surface stays gated) + routing/search/props assertions + 11 screenshot baselines. Runs as its own CI job inside `mcr.microsoft.com/playwright:v1.65.1-noble`. **Regenerate baselines in that same image**, never on the host - font metrics must match: `docker run --rm --ipc=host -v "$PWD":/work -w /work -u "$(id -u):$(id -g)" -e HOME=/tmp mcr.microsoft.com/playwright:v1.65.1-noble npx playwright test --update-snapshots`.
- Exports: `.` (barrel), `./<module>` for each module the barrel re-exports (plus `./utils` for `cn`), `./theme.css`, `./primitives.css`, `./styles/*.css`, `./package.json`. `files` ships `dist` + `src/styles`.
- The exports map is generated from the barrel - `npm run exports:generate` after adding/renaming/removing a public component; `exports:check` fails `verify` when it drifts.

## RSC contract

- Any component using client-only React (state, effects, refs, context, portals, DOM/browser APIs) MUST start with `'use client';`. `useId` / `useMemo` / `useCallback` / `forwardRef` / `memo` exist in React's server build, so they alone do not require the directive.
- Attaching a DOM event handler (`onClick`, `onChange`, `onKeyDown`, …) also requires it, even in a hook-free component - a server component cannot pass a function prop to the DOM.
- Rolldown (Vite 8) preserves module-level directives under `preserveModules` - no extra plugin needed. Keep `'use client'` as **line 1**.
- Invariant: no server-safe module may transitively import a client module. `dist/components/badge.js` → `dist/lib/utils.js` and nothing else. Deliberate exceptions, each the standard server-to-client boundary (the server module renders the island, it never calls a function from it): `card.js` renders `card-state.js` (state bodies, `CardMeta`, the announcement), `stat-card.js` renders `card-state.js` and `stat-card.state.js` (one-line state bodies), and `form-field.js` always renders the `form-field.live.js` live region (it announces the settled `preview`).

## Publish

- npm, public, `--provenance`, OIDC trusted publishing (no `NPM_TOKEN`): `prepare-release.yml` opens the `chore(release): X.Y.Z` PR with `PAT_TOKEN` and arms auto-merge; `release.yml` publishes on that merge (or `workflow_dispatch`) and pushes the `vX.Y.Z` tag. `prepare-release.yml` skips while the current version has no tag.

## Deploy (showcase → ds.agentage.io)

- LIVE at https://ds.agentage.io since 2026-08-06. The `dev/` showcase deploys as its own Swarm stack (was `agentage-ds`) behind Traefik on the main prod box. The rename moves it to the stack `agentage-components` (routers `components-*`, image `ghcr.io/agentage/components/showcase`, host dir `/opt/agentage/components`). Dockerfile builds the static SPA → nginx-unprivileged; `docker-compose.yml` carries the Traefik labels; `.github/workflows/deploy.yml` builds → smokes → deploys on push to master.
- Production-only (the platform-wide dev env was removed 2026-07-30). Gated on `vars.DEPLOY_ENABLED == 'true'` + the `production` environment (`vars.SITE_FQDN`, `SSH_PRIVATE_KEY` / `SSH_HOST` / `SSH_USER`).
- Container healthcheck must probe `127.0.0.1`, not `localhost` - nginx binds IPv4 only; busybox wget picks `::1`.
- Post-deploy verification lives in `scripts/verify-deploy.sh` (estate standard, same shape as auth/dashboard): it asserts `https://${SITE_FQDN}/health` reports **this** commit before checking that the page renders. A content grep alone is fail-open - on a failed rollout Swarm keeps the old task serving and the grep still matches.

## Conventions

- Node 22+, TS strict, ESM, React 19 peer. Prettier (single quotes, 100 cols). No `any`.
- Tests: vitest + jsdom + Testing Library (`vitest.setup.ts`); add a test file when fixing/adding interactive behavior.
- Never edit on master - feature branch + PR.
- Keep component files small; export a new public component from `src/components/index.ts` in its category block.
- Props: at most 10 own props per component (aim for 6 to 8). One convention: `value`/`defaultValue`/`onValueChange`, `open`/`defaultOpen`/`onOpenChange`, `checked`/`onCheckedChange`, `tone` for colour meaning, `size` only `sm` | `md`, no `density`, no aliases, no `@deprecated` (the package is new; remove instead). Optional content goes in `children` or at most three named slots.
- Docs categories: Foundations, Forms, Navigation, Lists and data, Display, Overlays, Feedback, Patterns (+ the temporary Review). Moved page routes go to `dev/lib/redirects.ts`.
