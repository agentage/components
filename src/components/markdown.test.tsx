import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Markdown } from './markdown';

const DOC = `## Release notes

Nine changes since \`v14.0.0\`. See [the guide](https://example.test/guide).

- **Fix:** long names
- Tabs scroll

| Area | Changes |
| ---- | ------: |
| Fixes | 4 |

\`\`\`bash
npm install
\`\`\`
`;

describe('Markdown', () => {
  it('renders headings, lists, inline code, links, tables and highlighted code', () => {
    const { container } = render(<Markdown>{DOC}</Markdown>);
    expect(screen.getByRole('heading', { name: 'Release notes' }).tagName).toBe('H3');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(container.querySelector('[data-slot="inline-code"]')?.textContent).toBe('v14.0.0');
    expect(screen.getByRole('link', { name: 'the guide' }).getAttribute('href')).toBe(
      'https://example.test/guide'
    );
    expect(screen.getByRole('columnheader', { name: 'Area' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: '4' })).toBeTruthy();
    const block = container.querySelector('[data-slot="code-block"]');
    expect(block?.textContent).toContain('bash');
    expect(block?.querySelector('pre')?.textContent).toBe('npm install');
  });

  it('shows raw HTML as text and drops script urls', () => {
    const { container } = render(
      <Markdown>
        {'hi <script>alert(1)</script> <img src=x onerror=alert(1)>\n\n[x](javascript:alert(1))'}
      </Markdown>
    );
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('<script>alert(1)</script>');
    expect(container.querySelector('a')?.getAttribute('href')).toBe('');
  });

  it('never runs script tags inside fenced code', () => {
    const { container } = render(<Markdown>{'```html\n<script>alert(1)</script>\n```'}</Markdown>);
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('pre')?.textContent).toBe('<script>alert(1)</script>');
  });

  it('keeps earlier nodes in place while the string grows (streaming)', () => {
    const text = 'First paragraph.\n\n```ts\nconst a = 1;\n```\n\nSecond';
    const { container, rerender } = render(<Markdown>{text}</Markdown>);
    const para = container.querySelector('p');
    const block = container.querySelector('[data-slot="code-block"]');
    rerender(<Markdown>{`${text} paragraph grows`}</Markdown>);
    expect(container.querySelector('p')).toBe(para);
    expect(container.querySelector('[data-slot="code-block"]')).toBe(block);
    expect(container.textContent).toContain('Second paragraph grows');
  });

  it('renders a fence tagged with a prototype name as plain code', () => {
    for (const tag of ['constructor', '__proto__']) {
      const { container, unmount } = render(
        <Markdown>{`\`\`\`${tag}\nconst a = 1;\n\`\`\``}</Markdown>
      );
      expect(container.querySelector('pre')?.textContent).toBe('const a = 1;');
      expect(container.querySelector('.hljs')).toBeNull();
      unmount();
    }
  });
});
