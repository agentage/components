// Smoke of a running copy: node scripts/smoke.mjs <origin>. One PASS or FAIL line per check.
const base = process.argv[2] ?? 'http://127.0.0.1:4280';
let failed = 0;

const check = (name, ok, got) => {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `: ${got}`}`);
  if (!ok) failed += 1;
};

const get = async (path) => {
  const res = await fetch(new URL(path, base), { redirect: 'manual' });
  return {
    status: res.status,
    type: res.headers.get('content-type') ?? '',
    res,
    body: await res.text(),
  };
};

const home = await get('/');
check(
  '/ is the docs index',
  home.status === 200 && home.body.includes('<div id="root">'),
  home.status
);
check('/ is noindex', home.body.includes('content="noindex"'), 'no robots meta');
const csp = home.res.headers.get('content-security-policy') ?? '';
check(
  'CSP script-src has no unsafe-inline',
  /script-src 'self'/.test(csp) && !/script-src[^;]*unsafe-inline/.test(csp),
  csp
);

for (const path of [
  '/install',
  '/theming',
  '/components',
  '/components/chat',
  '/components/chat/markdown',
  '/components/patterns/chat',
]) {
  const page = await get(path);
  check(
    `${path} answers the index`,
    page.status === 200 && page.type.startsWith('text/html') && page.body === home.body,
    `${page.status} ${page.type}`
  );
}

const assets = [...home.body.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
check('index names its script and stylesheet', assets.length >= 2, assets.join(' '));
for (const path of assets) {
  const asset = await get(path);
  check(
    `${path} is served`,
    asset.status === 200 && !asset.type.startsWith('text/html'),
    `${asset.status} ${asset.type}`
  );
}

const missing = await get('/no-such-page');
check('/no-such-page is 404', missing.status === 404, missing.status);
const robots = await get('/robots.txt');
check('/robots.txt disallows all', robots.body.includes('Disallow: /'), robots.body);

if (failed > 0) process.exit(1);
console.log('smoke ok');
