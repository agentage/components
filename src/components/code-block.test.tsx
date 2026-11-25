import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock, InlineCode } from './code-block';

const writeText = vi.fn(() => Promise.resolve());

beforeEach(() => {
  writeText.mockClear();
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
});

describe('CodeBlock', () => {
  it('keeps the copy affordance labelled, focus-visible and reachable by keyboard', async () => {
    render(<CodeBlock code="npm i" />);
    const copy = screen.getByRole('button', { name: 'Copy code' });
    expect(copy.className).toContain('focus-ring');
    expect(copy.className).toContain('focus:opacity-100');

    await userEvent.tab();
    expect(document.activeElement).toBe(copy);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(copy.getAttribute('aria-label')).toBe('Copied'));
    expect(writeText).toHaveBeenCalledWith('npm i');
  });

  it('forwards refs from the block and from inline code', () => {
    const block = createRef<HTMLDivElement>();
    const inline = createRef<HTMLElement>();
    render(
      <>
        <CodeBlock ref={block} code="npm i" />
        <InlineCode ref={inline}>npm i</InlineCode>
      </>
    );
    expect(block.current?.getAttribute('data-slot')).toBe('code-block');
    expect(inline.current?.getAttribute('data-slot')).toBe('inline-code');
  });
});

describe('CodeBlock copy button position', () => {
  it('sits at top-2 without a language header', () => {
    render(<CodeBlock code="x" />);
    const cls = screen.getByRole('button').className;
    expect(cls).toContain('top-2');
    expect(cls).not.toContain('top-10');
    expect(cls).toContain('focus-ring');
  });

  it('moves to top-10 when a language header is present', () => {
    render(<CodeBlock code="x" language="ts" />);
    const cls = screen.getByRole('button').className;
    expect(cls).toContain('top-10');
    expect(cls).not.toContain('top-2');
  });

  it('merges className last on the root and spreads props', () => {
    const { container } = render(<CodeBlock code="x" className="mt-4" id="cb" />);
    const root = container.querySelector('[data-slot="code-block"]');
    expect(root?.className).toBe('relative group rounded-lg border border-border bg-card mt-4');
    expect(root?.id).toBe('cb');
  });
});

describe('CodeBlock highlighted slot', () => {
  it('renders pre-tokenized children instead of the raw code', () => {
    const { container } = render(
      <CodeBlock code="const a = 1;">
        <code data-testid="hl">
          <span className="tok">const</span> a = 1;
        </code>
      </CodeBlock>
    );
    expect(screen.getByTestId('hl')).toBeTruthy();
    expect((container.querySelector('pre') as HTMLElement).querySelectorAll('code').length).toBe(1);
  });

  it('still copies the raw code when children are supplied', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(
      <CodeBlock code="const a = 1;">
        <code>tokens</code>
      </CodeBlock>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('const a = 1;');
    });
  });
});
