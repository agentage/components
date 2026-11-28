import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** Category slugs, mirroring dev/registry.tsx. Component pages are discovered at runtime. */
const CATEGORIES = [
  'foundations',
  'forms',
  'navigation',
  'lists',
  'display',
  'overlays',
  'feedback',
  'chat',
  'patterns',
  'review',
] as const;

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Documented axe exclusions. Each entry needs a reason; keep the list empty
 * unless a rule genuinely misfires on the showcase (not on the components).
 */
const EXCLUDED_RULES: { id: string; reason: string }[] = [];

/** Both themes are gated - light was invisible to CI and carried its own contrast debt. */
const THEMES = ['dark', 'light'] as const;

const setTheme = async (page: Page, theme: string): Promise<void> => {
  if (theme === 'dark') return;
  await page.locator('header').getByRole('radio', { name: 'Light', exact: true }).click();
};

/** Direct load - proves every route deep-links, not just that the SPA can reach it. */
const open = async (page: Page, path: string, theme: string = 'dark'): Promise<void> => {
  await page.goto(path);
  await setTheme(page, theme);
  await page.waitForTimeout(100);
};

const scan = async (page: Page): Promise<string[]> => {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .disableRules(EXCLUDED_RULES.map((r) => r.id))
    .analyze();
  return results.violations.flatMap((v) =>
    v.nodes.map((n) => `${v.id}: ${String(n.target)} ${JSON.stringify(n.any[0]?.data)}`)
  );
};

const section = (page: Page, title: string) => page.locator(`[data-section="${title}"]`);

test.describe('docs a11y', () => {
  for (const theme of THEMES) {
    // One test per category: load the index once, then client-side navigate
    // through every component page listed on it. No reloads, so the whole
    // component surface stays gated without blowing the suite's runtime budget.
    for (const category of CATEGORIES) {
      test(`${theme} / ${category} pages have no WCAG A/AA violations`, async ({ page }) => {
        await open(page, `/components/${category}`, theme);
        const violations = (await scan(page)).map((v) => `${category}: ${v}`);

        const routes = await page
          .locator(`main a[href^="/components/${category}/"]`)
          .evaluateAll((links) => links.map((l) => l.getAttribute('href') ?? ''));
        expect(routes.length).toBeGreaterThan(0);

        for (const route of routes) {
          await page.locator(`main a[href="${route}"]`).first().click();
          await page.waitForURL(route);
          violations.push(...(await scan(page)).map((v) => `${route}: ${v}`));
          await page.goBack();
          await page.waitForURL(`/components/${category}`);
        }

        expect(violations).toEqual([]);
      });
    }

    for (const path of ['/', '/install', '/theming']) {
      test(`${theme} / ${path} has no WCAG A/AA violations`, async ({ page }) => {
        await open(page, path, theme);
        expect(await scan(page)).toEqual([]);
      });
    }
  }
});

test.describe('toast contrast', () => {
  for (const theme of THEMES) {
    test(`${theme} / every toast variant passes WCAG AA with a description`, async ({ page }) => {
      await open(page, '/components/feedback/toast', theme);
      const buttons = section(page, 'Variants').getByRole('button');
      for (const name of ['Default', 'Success', 'Destructive', 'Warning', 'Info']) {
        await buttons.filter({ hasText: new RegExp(`^${name}$`) }).click();
      }
      await expect(page.locator('[data-slot="toast"]')).toHaveCount(5);
      const results = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        .include('[data-slot="toast-container"]')
        .analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    });
  }
});

/** The left rail: one scroll container, groups collapsed unless the route needs them. */
const rail = (page: Page) => page.locator('.docs-rail');
const group = (page: Page, label: string) =>
  rail(page).getByRole('button', { name: label, exact: true });

test.describe('docs navigation', () => {
  test('only the current route group is expanded on a deep link', async ({ page }) => {
    await open(page, '/components/forms/tree-select');
    await expect(group(page, 'Forms')).toHaveAttribute('aria-expanded', 'true');
    for (const other of ['Foundations', 'Display', 'Overlays', 'Feedback']) {
      await expect(group(page, other)).toHaveAttribute('aria-expanded', 'false');
    }
    await expect(
      rail(page).getByRole('link', { name: 'TreeSelect', exact: true })
    ).toBeInViewport();
  });

  test('a group toggles from the keyboard and persists for the session', async ({ page }) => {
    await open(page, '/install');
    await group(page, 'Display').focus();
    await page.keyboard.press('Enter');
    await expect(group(page, 'Display')).toHaveAttribute('aria-expanded', 'true');
    await expect(rail(page).getByRole('link', { name: 'Sparkline', exact: true })).toBeVisible();

    await page.reload();
    await expect(group(page, 'Display')).toHaveAttribute('aria-expanded', 'true');

    await group(page, 'Display').click();
    await expect(group(page, 'Display')).toHaveAttribute('aria-expanded', 'false');
    await expect(rail(page).getByRole('link', { name: 'Sparkline', exact: true })).toBeHidden();
  });

  test('the rail is the only scroller in the aside', async ({ page }) => {
    await open(page, '/components/forms/select');
    const nested = await rail(page).evaluate(
      (el) =>
        [...el.querySelectorAll('*')].filter(
          (n) =>
            n.scrollHeight > n.clientHeight + 1 &&
            ['auto', 'scroll'].includes(getComputedStyle(n).overflowY)
        ).length
    );
    expect(nested).toBe(0);
    // Transparent thumb: the rail may scroll, but never paints a second bar.
    await expect(rail(page)).toHaveCSS('scrollbar-color', 'rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)');
  });
});

test.describe('routing', () => {
  test('a component URL deep-links on a cold load', async ({ page }) => {
    await open(page, '/components/foundations/button');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Button');
    await expect(
      section(page, 'Import').locator('.hljs-string', {
        hasText: '@agentage/components/button',
      })
    ).toBeVisible();
  });

  test('back and forward restore the previous route', async ({ page }) => {
    await open(page, '/components/forms');
    await page.getByRole('link', { name: 'Select', exact: true }).first().click();
    await expect(page).toHaveURL('/components/forms/select');

    await page.goBack();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Forms');

    await page.goForward();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Select');
  });

  test('old and merged routes land on the page that holds them now', async ({ page }) => {
    const moved: [string, string, string][] = [
      ['/components/feedback/modal', '/components/overlays/dialog', 'Dialog'],
      ['/components/cards/gauge-card', '/components/display/stat-card', 'StatCard'],
      ['/components/data-display/entity-card', '/components/display/card', 'Card'],
      ['/components/patterns/secrets', '/components/patterns/settings-form', 'Settings form'],
    ];
    for (const [from, to, title] of moved) {
      await page.goto(from);
      await expect(page).toHaveURL(new RegExp(`${to}$`));
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    }
  });

  test('folded pages redirect to their section on the host page', async ({ page }) => {
    const moved: [string, string, string][] = [
      ['/components/navigation/pagination', '/components/lists/table', 'pagination-example'],
      ['/components/display/collapsible', '/components/display/accordion', 'collapsible-example'],
      ['/components/foundations/hooks', '/components/display/card', 'useannounce-example'],
    ];
    for (const [from, to, id] of moved) {
      await page.goto(from);
      await expect(page).toHaveURL(`${to}#${id}`);
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('the command palette lands on a folded section', async ({ page }) => {
    const found: [string, string, string][] = [
      ['collapsible', 'Collapsible', '/components/display/accordion#collapsible-example'],
      ['pagination', 'Pagination', '/components/lists/table#pagination-example'],
      ['useAnnounce', 'useAnnounce', '/components/display/card#useannounce-example'],
    ];
    for (const [query, name, to] of found) {
      await open(page, '/');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.getByRole('combobox').fill(query);
      await page
        .getByRole('option', { name: new RegExp(`^${name}`) })
        .first()
        .click();
      await expect(page).toHaveURL(to);
    }
  });

  test('a pattern page links to the components it is built from', async ({ page }) => {
    await open(page, '/components/patterns/card-grid');
    const built = section(page, 'Built from');
    await built.getByRole('link', { name: 'PageHeader' }).click();
    await expect(page).toHaveURL(/\/components\/navigation\/page-header$/);
  });

  test('an unknown route renders the empty state', async ({ page }) => {
    await open(page, '/components/foundations/nope');
    await expect(page.getByText('No such page')).toBeVisible();
  });

  test('the command palette jumps to a component', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('combobox').fill('trend line');
    await page.getByRole('option', { name: 'Sparkline' }).click();
    await expect(page).toHaveURL('/components/display/sparkline');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sparkline');
  });
});

test.describe('syntax highlighting', () => {
  test('import snippets tokenize into distinct token colours', async ({ page }) => {
    await open(page, '/components/foundations/button');
    const code = section(page, 'Import').locator('.hljs');
    await expect(code.locator('.hljs-keyword').first()).toHaveText('import');
    await expect(code.locator('.hljs-string')).toBeVisible();

    const colours = await code.evaluate(
      (el) => new Set([...el.querySelectorAll('span')].map((s) => getComputedStyle(s).color)).size
    );
    expect(colours).toBeGreaterThan(1);
  });

  test('the getting-started snippets highlight in the light theme too', async ({ page }) => {
    await open(page, '/install', 'light');
    await expect(section(page, 'Theme').locator('.hljs-comment')).toBeVisible();
    await expect(section(page, 'Tailwind').locator('.hljs-string').first()).toBeVisible();
  });
});

test.describe('chat', () => {
  test('the approval bar keeps every button inside and Skip never alone, 300 to 470 px', async ({
    page,
  }) => {
    await open(page, '/components/chat/approval-bar');
    const bad = await page.evaluate(() => {
      const bar = document.querySelector('[data-section="Sizes"] [data-slot="approval-bar"]');
      const box = bar?.parentElement as HTMLElement;
      box.style.maxWidth = 'none';
      const out: number[] = [];
      for (let w = 300; w <= 470; w += 2) {
        box.style.width = `${String(w)}px`;
        const group = box.querySelector('[role=group]') as HTMLElement;
        const g = group.getBoundingClientRect();
        const b = [...group.querySelectorAll('button')].map((x) => x.getBoundingClientRect());
        const rowOf = (r: DOMRect) => Math.round(r.top);
        const skipAlone = b.filter((r) => rowOf(r) === rowOf(b[3] as DOMRect)).length === 1;
        const outside = b.some((r) => r.right > g.right + 0.5 || r.left < g.left - 0.5);
        if (outside || (skipAlone && new Set(b.map(rowOf)).size > 1)) out.push(w);
      }
      return out;
    });
    expect(bad).toEqual([]);
  });

  test('the conversation follows new turns, holds after a scroll up and jumps back', async ({
    page,
  }) => {
    await open(page, '/components/chat/conversation');
    const demo = section(page, 'Example');
    const log = demo.getByRole('log');
    const add = demo.getByRole('button', { name: 'Add a turn' });
    const gap = () => log.evaluate((el) => el.scrollHeight - el.scrollTop - el.clientHeight);
    for (let i = 0; i < 4; i++) await add.click();
    await expect.poll(gap).toBeLessThanOrEqual(1);
    await log.evaluate((el) => el.scrollTo(0, 0));
    await add.click();
    await expect.poll(() => log.evaluate((el) => el.scrollTop)).toBe(0);
    await demo.getByRole('button', { name: 'Scroll to the latest message' }).click();
    await expect.poll(gap).toBeLessThanOrEqual(1);
  });
});

test.describe('props tables', () => {
  test('render generated rows', async ({ page }) => {
    await open(page, '/components/display/stat-card');
    const props = section(page, 'Props');
    await expect(props.getByRole('cell', { name: /^title/ })).toBeVisible();
    await expect(props.getByRole('cell', { name: 'hint' })).toBeVisible();
    await expect(
      props.getByText('The one muted line under the value: a description or the earlier figure.')
    ).toBeVisible();
  });
});

test.describe('showcase visuals', () => {
  test('component page', async ({ page }) => {
    await open(page, '/components/foundations/button');
    await expect(page).toHaveScreenshot('component-page.png', { fullPage: true });
  });

  test('category index', async ({ page }) => {
    await open(page, '/components/forms');
    await expect(page).toHaveScreenshot('category-index.png', { fullPage: true });
  });

  test('list', async ({ page }) => {
    await open(page, '/components/lists/list');
    await expect(section(page, 'Example')).toHaveScreenshot('list.png');
  });

  test('data view', async ({ page }) => {
    await open(page, '/components/lists/data-view');
    await expect(section(page, 'Example')).toHaveScreenshot('data-view.png');
  });

  test('dropdown menu open', async ({ page }) => {
    await open(page, '/components/overlays/dropdown-menu');
    await section(page, 'Example').getByRole('button').first().click();
    const menu = page.locator('[data-slot="dropdown-menu-content"]');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveScreenshot('dropdown-menu-open.png');
  });

  test('stat card', async ({ page }) => {
    await open(page, '/components/display/stat-card');
    await expect(section(page, 'Example')).toHaveScreenshot('stat-card.png');
  });

  test('resizable panels', async ({ page }) => {
    await open(page, '/components/overlays/resizable');
    await expect(section(page, 'Example')).toHaveScreenshot('resizable-panels.png');
  });

  test('typed confirm dialog', async ({ page }) => {
    await open(page, '/components/overlays/dialog');
    await section(page, 'States').getByRole('button').first().click();
    const dialog = page.locator('[data-slot="dialog-content"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveScreenshot('dialog-confirm-text.png');
  });

  test('command palette open', async ({ page }) => {
    await open(page, '/components/overlays/command');
    await section(page, 'Example').getByRole('button').first().click();
    const dialog = page.locator('[data-slot="command-content"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveScreenshot('command-open.png');
  });

  test('sheet open', async ({ page }) => {
    await open(page, '/components/overlays/sheet');
    await section(page, 'Example').getByRole('button').first().click();
    const sheet = page.locator('[data-slot="sheet-content"]');
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveScreenshot('sheet-open.png');
  });

  test('chat tool call waiting for approval', async ({ page }) => {
    await open(page, '/components/patterns/chat');
    const run = section(page, 'A run and an approval');
    const waiting = run.locator('[data-slot="tool-call"][data-status="waiting"]');
    await expect(waiting.getByRole('group', { name: 'Approve this call' })).toBeVisible();
    await expect(waiting).toHaveScreenshot('chat-approval.png');
  });

  test('tabs line', async ({ page }) => {
    await open(page, '/components/navigation/tabs');
    await expect(section(page, 'Example')).toHaveScreenshot('tabs-underline.png');
  });
});
