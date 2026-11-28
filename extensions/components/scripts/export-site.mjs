// Builds the docs site at the repo root (npm run build:showcase) and copies it into dist/pages/site/.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, realpathSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const OUT = join('dist', 'pages', 'site');

// up builds in a staged copy with node_modules linked back: that link finds the repo root.
const root = resolve(dirname(realpathSync('node_modules')), '..', '..');
const site = join(root, 'dist-showcase');

if (!existsSync(join(root, 'node_modules'))) {
  throw new Error(`${root}/node_modules is missing: run npm ci at the repo root first`);
}
const { status } = spawnSync('npm', ['run', 'build:showcase'], { cwd: root, stdio: 'inherit' });
if (status !== 0) throw new Error(`npm run build:showcase exited ${status}`);
rmSync(OUT, { recursive: true, force: true });
cpSync(site, OUT, { recursive: true });
console.log(`site exported to ${OUT}`);
