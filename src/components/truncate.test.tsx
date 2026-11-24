import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Truncate } from './truncate';

describe('Truncate', () => {
  it('cuts the tail by default and keeps the full text in the title', () => {
    render(<Truncate text="a-very-long-document-name.md" />);
    const el = screen.getByText('a-very-long-document-name.md');
    expect(el.className).toContain('truncate');
    expect(el.getAttribute('title')).toBe('a-very-long-document-name.md');
  });

  it('keeps the last path segment whole in middle mode', () => {
    const { container } = render(
      <Truncate position="middle" text="src/components/table/row.tsx" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.getAttribute('title')).toBe('src/components/table/row.tsx');
    const [head, tail] = Array.from(root.children) as HTMLElement[];
    expect(head.textContent).toBe('src/components/table/');
    expect(head.className).toContain('truncate');
    expect(tail.textContent).toBe('row.tsx');
  });

  it('treats a trailing slash as part of the last segment', () => {
    const { container } = render(<Truncate position="middle" text="src/components/" />);
    const [head, tail] = Array.from((container.firstChild as HTMLElement).children);
    expect(head.textContent).toBe('src/');
    expect(tail.textContent).toBe('components/');
  });

  it('renders only the tail for text without a directory', () => {
    const { container } = render(<Truncate position="middle" text="README.md" />);
    expect((container.firstChild as HTMLElement).children).toHaveLength(1);
    expect(screen.getByText('README.md').getAttribute('title')).toBeNull();
  });

  it('merges className last', () => {
    render(<Truncate text="x" className="max-w-40" />);
    expect(screen.getByText('x').className.endsWith('max-w-40')).toBe(true);
  });
});
