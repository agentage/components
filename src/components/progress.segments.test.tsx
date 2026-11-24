import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MetaItem, PageHeader } from './page-header';
import { Progress } from './progress';

const SEGMENTS = [
  { key: 'backlog', label: 'Backlog', count: 1 },
  { key: 'todo', label: 'Todo', count: 2, tone: 'subtle' as const },
  { key: 'canceled', label: 'Canceled', count: 0 },
  {
    key: 'done',
    label: 'Done',
    count: 4,
    tone: 'success' as const,
    glyph: <svg data-testid="g" />,
  },
];

describe('Progress segments', () => {
  it('is an image named by its counts, with proportional segments', () => {
    const { container } = render(<Progress segments={SEGMENTS} legend />);
    expect(screen.getByRole('img', { name: 'Backlog 1, Todo 2, Canceled 0, Done 4' })).toBeTruthy();
    const segs = Array.from(container.querySelectorAll<HTMLElement>('[data-key]'));
    expect(segs.map((s) => s.style.flexGrow)).toEqual(['1', '2', '0', '4']);
    expect(segs.map((s) => s.style.marginLeft)).toEqual(['0px', '2px', '0px', '2px']);
    expect(screen.getByText('Done 4')).toBeTruthy();
    expect(screen.getByTestId('g')).toBeTruthy();
  });

  it('takes a custom label', () => {
    render(<Progress segments={SEGMENTS} label="7 items by status" />);
    expect(screen.getByRole('img', { name: '7 items by status' })).toBeTruthy();
  });
});

describe('PageHeader meta with MetaItem', () => {
  it('lays out labelled facts next to a progress bar with its value', () => {
    render(
      <PageHeader
        variant="detail"
        title="Website"
        meta={
          <>
            <MetaItem label="Target">Dec 4</MetaItem>
            <Progress value={29} label="2 of 7 done" showValue />
          </>
        }
      />
    );
    expect(screen.getByText('Target')).toBeTruthy();
    expect(screen.getByText('Dec 4')).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: '2 of 7 done, 29%' })).toBeTruthy();
    expect(screen.getByText('2 of 7 done, 29%')).toBeTruthy();
  });
});
