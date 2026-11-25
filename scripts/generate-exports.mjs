#!/usr/bin/env node
// Keeps the per-component subpath exports in sync with src/ (run via npm run exports:generate).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkgPath = resolve(root, 'package.json');

const STATIC_EXPORTS = {
  '.': { types: './dist/index.d.ts', import: './dist/index.js' },
  './theme.css': './src/styles/theme.css',
  './primitives.css': './src/styles/primitives.css',
  './styles/*.css': './src/styles/*.css',
  './package.json': './package.json',
};

// Public modules only: the ones the barrel re-exports from, plus `cn` at `./utils`. Parts files
// and helpers stay internal, so an app can only reach what the docs list.
const barrel = readFileSync(resolve(root, 'src/components/index.ts'), 'utf8');
const reexported = [...barrel.matchAll(/from '(\.\.?\/[^']+)'/g)].map((m) => m[1]);
const modules = new Set(['lib/utils']);
for (const spec of reexported)
  modules.add(spec.startsWith('../') ? spec.slice(3) : `components/${spec.slice(2)}`);

const subpaths = {};
for (const path of modules) {
  const name = path.split('/').pop();
  if (
    !existsSync(resolve(root, 'src', `${path}.ts`)) &&
    !existsSync(resolve(root, 'src', `${path}.tsx`))
  )
    throw new Error(`barrel re-exports a missing module: ${path}`);
  subpaths[`./${name}`] = { types: `./dist/${path}.d.ts`, import: `./dist/${path}.js` };
}

const exportsMap = { ...STATIC_EXPORTS };
for (const key of Object.keys(subpaths).sort()) exportsMap[key] = subpaths[key];

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const next = `${JSON.stringify({ ...pkg, exports: exportsMap }, null, 2)}\n`;

if (process.argv.includes('--check')) {
  if (next !== readFileSync(pkgPath, 'utf8')) {
    console.error('package.json "exports" is stale - run: npm run exports:generate');
    process.exit(1);
  }
  console.log(`exports map up to date (${Object.keys(exportsMap).length} entries)`);
} else {
  writeFileSync(pkgPath, next);
  console.log(`wrote ${Object.keys(exportsMap).length} export entries`);
}
