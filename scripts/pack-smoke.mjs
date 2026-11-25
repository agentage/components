#!/usr/bin/env node
// Packs the package and checks what a consumer really gets (run via npm run pack:smoke, after build).
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'package.json'));
const ts = require('typescript');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const NAME = pkg.name;

let failed = 0;
const report = (ok, check, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${check}${detail ? `\n       ${detail}` : ''}`);
};

const work = mkdtempSync(join(tmpdir(), 'pack-smoke-'));
const cleanup = () => rmSync(work, { recursive: true, force: true });
process.on('exit', cleanup);

// --- pack and "install" into a consumer outside the repo tree -------------------------------
const packDir = join(work, 'pack');
mkdirSync(packDir);
const packed = JSON.parse(
  execFileSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', packDir], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  })
)[0];
const tarball = join(packDir, packed.filename);
const files = packed.files.map((f) => f.path);

const consumer = join(work, 'consumer');
const modules = join(consumer, 'node_modules');
mkdirSync(join(modules, '@agentage'), { recursive: true });
const installed = join(modules, NAME);
mkdirSync(installed, { recursive: true });
execFileSync('tar', ['-xzf', tarball, '-C', installed, '--strip-components=1']);
writeFileSync(join(consumer, 'package.json'), '{"name":"consumer","private":true,"type":"module"}');

// The repo's own node_modules supply react and the package dependencies (no network).
const link = (dep) => {
  const from = join(root, 'node_modules', dep);
  if (!existsSync(from)) return;
  const to = join(modules, dep);
  mkdirSync(dirname(to), { recursive: true });
  if (!existsSync(to)) symlinkSync(realpathSync(from), to, 'dir');
};
for (const dep of [
  ...Object.keys(pkg.dependencies ?? {}),
  'react',
  'react-dom',
  '@types/react',
  '@types/react-dom',
])
  link(dep);

// --- exports map ----------------------------------------------------------------------------
const jsSubpaths = [];
const cssEntries = [];
for (const [key, value] of Object.entries(pkg.exports)) {
  if (typeof value === 'string') {
    if (value.endsWith('.css')) cssEntries.push(value);
    continue;
  }
  jsSubpaths.push({
    spec: key === '.' ? NAME : `${NAME}/${key.slice(2)}`,
    key,
    js: value.import,
    types: value.types,
  });
}

// --- 1. tarball contents --------------------------------------------------------------------
const allowed = /^(dist\/|src\/styles\/|README\.md$|LICENSE$|package\.json$)/;
const stray = files.filter((f) => !allowed.test(f));
report(
  stray.length === 0,
  'tarball holds only dist, src/styles, README.md, LICENSE, package.json',
  stray.join(', ')
);

const missingCss = [];
for (const entry of cssEntries) {
  const rel = entry.replace(/^\.\//, '');
  const re = new RegExp(`^${rel.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace('*', '[^/]+')}$`);
  if (!files.some((f) => re.test(f))) missingCss.push(entry);
}
report(
  missingCss.length === 0,
  `every CSS entry point exists in the tarball (${cssEntries.length})`,
  missingCss.join(', ')
);

const badTypes = jsSubpaths.filter(
  (s) =>
    !s.types ||
    !files.includes(s.types.replace(/^\.\//, '')) ||
    !files.includes(s.js.replace(/^\.\//, ''))
);
report(
  badTypes.length === 0,
  `every JS subpath has a types condition and both files in the tarball (${jsSubpaths.length})`,
  badTypes.map((s) => s.key).join(', ')
);

// --- 2. runtime exports vs declared value exports -------------------------------------------
// Names come from a bundler-resolution program so this check is independent of bug-1 breakage.
const nameProgram = ts.createProgram({
  rootNames: jsSubpaths.map((s) => join(installed, s.types)),
  options: {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    skipLibCheck: true,
    noEmit: true,
    types: [],
  },
});
const checker = nameProgram.getTypeChecker();
const declaredValues = (typesFile) => {
  const source = nameProgram.getSourceFile(join(installed, typesFile));
  const moduleSymbol = checker.getSymbolAtLocation(source);
  if (!moduleSymbol) return [];
  return checker
    .getExportsOfModule(moduleSymbol)
    .filter((sym) => {
      const target = sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
      return (target.flags & ts.SymbolFlags.Value) !== 0;
    })
    .map((sym) => sym.name);
};

const missingAtRuntime = [];
for (const s of jsSubpaths) {
  let runtime;
  try {
    runtime = Object.keys(await import(pathToFileURL(join(installed, s.js)).href));
  } catch (error) {
    missingAtRuntime.push(`${s.key}: import failed (${error.message.split('\n')[0]})`);
    continue;
  }
  const missing = declaredValues(s.types).filter((n) => !runtime.includes(n));
  if (missing.length) missingAtRuntime.push(`${s.key}: ${missing.join(', ')}`);
}
report(
  missingAtRuntime.length === 0,
  'every value export declared in a .d.ts exists at runtime',
  missingAtRuntime.join('\n       ')
);

// --- 3. consumer type-check (NodeNext and bundler) ------------------------------------------
const ident = (spec) => spec.replace(/[^A-Za-z0-9]/g, '_');
const consumerSource = `${jsSubpaths
  .map((s) => `import * as ${ident(s.spec)} from '${s.spec}';`)
  .join('\n')}
import type { CardRootProps } from '${NAME}/card';
import type { DropdownMenuItemProps } from '${NAME}/dropdown-menu';
import type { ResizableSplitProps } from '${NAME}/resizable-split';

export const all = [${jsSubpaths.map((s) => ident(s.spec)).join(', ')}];

export const card: CardRootProps = { className: 'x', children: null, onClick() {} };
// @ts-expect-error unknown props must be rejected, not swallowed by an any
export const cardBad: CardRootProps = { notAProp: 1 };

export const item: DropdownMenuItemProps = {
  className: 'x',
  onClick(event) {
    event.currentTarget.blur();
  },
};
// @ts-expect-error unknown props must be rejected, not swallowed by an any
export const itemBad: DropdownMenuItemProps = { notAProp: 1 };

export const split: ResizableSplitProps = {
  storageKey: 'k',
  init: 1,
  min: 0,
  max: 2,
  className: 'x',
  children: [null, null],
};
`;
writeFileSync(join(consumer, 'check.ts'), consumerSource);

const typeCheck = (label, module, moduleResolution) => {
  const program = ts.createProgram({
    rootNames: [join(consumer, 'check.ts')],
    options: {
      module,
      moduleResolution,
      target: ts.ScriptTarget.ES2024,
      lib: ['lib.es2024.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
      jsx: ts.JsxEmit.ReactJSX,
      strict: true,
      noImplicitAny: true,
      skipLibCheck: false,
      noEmit: true,
      types: [],
    },
  });
  const errors = ts.getPreEmitDiagnostics(program).map((d) => {
    const file = d.file ? `${d.file.fileName.replace(work, '')}: ` : '';
    return `${file}TS${d.code} ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`;
  });
  const shown = errors.slice(0, 8);
  if (errors.length > shown.length) shown.push(`... and ${errors.length - shown.length} more`);
  report(errors.length === 0, `consumer type-check, ${label}`, shown.join('\n       '));
};
typeCheck(
  'module NodeNext + moduleResolution NodeNext',
  ts.ModuleKind.NodeNext,
  ts.ModuleResolutionKind.NodeNext
);
typeCheck('moduleResolution bundler', ts.ModuleKind.ESNext, ts.ModuleResolutionKind.Bundler);

if (failed) console.log(`\npack:smoke FAILED (${failed} check${failed > 1 ? 's' : ''})`);
else console.log('\npack:smoke passed');
process.exit(failed ? 1 : 0);
