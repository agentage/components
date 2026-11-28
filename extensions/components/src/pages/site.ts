import { siteFromDir, type PagesEntry, type PagesSite } from '@agentage/extension';

export const SITE_DIR = 'dist/pages/site';

// The client routes of the docs router (dev/app.tsx); /components/* also keeps old links (dev/lib/redirects.ts).
const ROUTES = ['/install', '/theming', '/components', '/components/*'];

const NOINDEX = '<meta name="robots" content="noindex" />';

// A copy of ds.agentage.io: closed to crawlers.
const noindex = (html: string): string =>
  html.replace(/<head(\s[^>]*)?>/i, (head) => `${head}\n    ${NOINDEX}`);

const htmlOf = (entry: PagesEntry | undefined): string => {
  if (typeof entry !== 'string')
    throw new Error(`${SITE_DIR}/index.html is missing: npm run build`);
  return noindex(entry);
};

// The static docs site (npm run build); every client route answers with its index.html.
export const siteOf = (site: PagesSite): PagesSite => {
  const index = htmlOf(site['/']);
  const shell: PagesEntry = { type: 'text/html; charset=utf-8', body: index };
  return {
    ...site,
    '/': index,
    ...Object.fromEntries(ROUTES.map((route) => [route, shell])),
    '/robots.txt': 'User-agent: *\nDisallow: /\n',
  };
};

// The export folder of npm run build, with the deployment host for the placeholder.
export const siteAt = (origin: string): PagesSite => siteOf(siteFromDir(SITE_DIR, { origin }));
