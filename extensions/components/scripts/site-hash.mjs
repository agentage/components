// The release reads only this folder: site.hash pins the docs site inputs, so their change releases.
// --write updates it; without a flag it fails when dev/ or src/ at the repo root changed since.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const INPUTS = ['dev', 'src'];
const FILE = 'site.hash';

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const files = execFileSync(
  'git',
  ['ls-files', '-z', '-co', '--exclude-standard', '--', ...INPUTS],
  { cwd: root }
)
  .toString('utf8')
  .split('\0')
  .filter((file) => file && existsSync(join(root, file)))
  .sort();

const hash = createHash('sha256');
for (const file of files)
  hash
    .update(`${file}\0`)
    .update(readFileSync(join(root, file)))
    .update('\0');
const line = `${hash.digest('hex')}  ${INPUTS.join(' ')} (${files.length} files)\n`;

if (process.argv.includes('--write')) {
  writeFileSync(FILE, line);
  console.log(`site.hash: ${line.trim()}`);
} else if ((existsSync(FILE) ? readFileSync(FILE, 'utf8') : '') !== line) {
  console.error('site.hash is stale: the docs site changed. Run npm run site:hash and commit it.');
  process.exit(1);
} else {
  console.log('site.hash: up to date');
}
