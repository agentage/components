import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DiffFileView, type DiffFile } from './content-block.diff';

const FILE: DiffFile = {
  path: 'a.ts',
  hunks: [
    {
      header: '@@ -1,3 +1,3 @@',
      lines: [' keep', '-old', '+new', '\\ No newline at end of file', ' tail'],
    },
  ],
};

describe('DiffFileView', () => {
  it('states added and removed lines in text', () => {
    render(<DiffFileView file={FILE} />);
    expect(screen.getByText('added').textContent).toBe('added ');
    expect(screen.getByText('removed').textContent).toBe('removed ');
  });

  it('keeps the no-newline marker out of the line numbering', () => {
    const { container } = render(<DiffFileView file={FILE} />);
    const meta = container.querySelector('[data-kind="meta"]');
    expect(meta?.textContent).toBe('\\ No newline at end of file');
    const tail = Array.from(container.querySelectorAll('[data-kind="context"]')).pop();
    expect(tail?.textContent?.startsWith('33')).toBe(true);
  });
});
