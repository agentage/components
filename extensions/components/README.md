# extensions/components

The docs site of `@agentage/components` (`dev/` at the repo root) as the agentage extension
`components`: one `pages` part, public, no api, no store, no secret. It runs on the staging
estate at `https://components.next.agentage.io`. The package is private (`@agentage/extension-components`):
its release puts nothing on npm and does not touch the library release.

## How it is built

- `npm run build` compiles `src/pages`, runs `npm run build:showcase` at the repo root and copies
  `dist-showcase/` into `dist/pages/site/`. Run `npm ci` at the repo root first.
- `src/pages/site.ts` serves that folder with `siteFromDir`. The docs router is client-side, so
  `/install`, `/theming`, `/components` and every path under `/components/` answer with
  `index.html`; old links under `/components/` keep their client redirect (`dev/lib/redirects.ts`).
  Any other unknown path is the kit 404 page. Every page is `noindex` and `/robots.txt` disallows all.

## How a change is released

- A merge to master runs `.github/workflows/extension-release.yml`:
  `agentage extension release --changed` (cli pinned). It releases only when this folder differs
  from the last `components@*` tag: a date version `YYYY.MDD.N`, the tag `components@<version>`,
  the image `ghcr.io/agentage/components-pages` and the record on the GitHub release.
- The cli reads only this folder. `site.hash` pins the docs site inputs (`dev/` and `src/` at the
  repo root), so a docs site change changes this folder. After a change there, run
  `npm run site:hash` here and commit `site.hash`; `verify` fails while it is stale.
- A change only in the root `package.json` or lockfile (a Dependabot bump, a `chore(release)`)
  does not release the site; the next `dev/` or `src/` change does.
- The site reaches next by a pull request in `agentage/apphosts` that moves the `components` row
  of `components/installation.json` to the new version.

## Commands

```bash
npm ci                                  # here, after npm ci at the repo root
npm run verify                          # type-check, site.hash, build, tests with coverage
npx agentage extension check            # the kit rules
npx agentage extension up --docker      # the part image behind the gateway on 127.0.0.1:4280
node scripts/smoke.mjs http://127.0.0.1:4280
```
