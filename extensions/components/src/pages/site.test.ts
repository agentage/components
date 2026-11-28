import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTestContext } from '@agentage/extension';
import { describe, expect, it } from 'vitest';
import { create } from './index.js';
import { siteOf, SITE_DIR } from './site.js';

const HTML = '<!doctype html><html><head><title>t</title></head><body></body></html>';

describe('pages', () => {
  const site = siteOf({ '/': HTML, '/assets/a.js': 'x' });

  it('answers every client route with the index page, marked noindex', () => {
    for (const route of ['/install', '/theming', '/components', '/components/*'])
      expect(site[route]).toEqual({ type: 'text/html; charset=utf-8', body: site['/'] });
    expect(site['/']).toContain('<meta name="robots" content="noindex" />');
    expect(site['/assets/a.js']).toBe('x');
    expect(site['/robots.txt']).toBe('User-agent: *\nDisallow: /\n');
  });

  it('refuses a site without index.html', () => {
    expect(() => siteOf({})).toThrow(/index\.html is missing/);
  });

  it('serves the export folder', () => {
    const dir = mkdtempSync(join(tmpdir(), 'components-pages-'));
    mkdirSync(join(dir, SITE_DIR), { recursive: true });
    writeFileSync(join(dir, SITE_DIR, 'index.html'), HTML);
    const cwd = process.cwd();
    process.chdir(dir);
    try {
      expect(Object.keys(create(createTestContext()))).toContain('/components/*');
    } finally {
      process.chdir(cwd);
    }
  });
});
