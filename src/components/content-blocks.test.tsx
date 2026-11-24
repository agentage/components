import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ContentBlocks, type ContentBlockData } from './content-blocks';

const BLOCKS: ContentBlockData[] = [
  { type: 'text', text: 'Rebased on `origin/master` to fix a conflict.' },
  { type: 'facts', title: 'Command', rows: [{ label: 'Branch', value: 'feature/x', mono: true }] },
  {
    type: 'steps',
    steps: [
      { title: 'Spec', state: 'done' },
      { title: 'Build', state: 'active', detail: '4 pull requests' },
      { title: 'Ship' },
    ],
  },
  {
    type: 'checks',
    copy: true,
    rows: [
      { label: 'verify', value: '2 min 04 s' },
      { label: 'e2e gate', status: 'fail', value: '40 of 41' },
    ],
  },
  {
    type: 'diff',
    files: [
      {
        path: 'src/notice-list.tsx',
        hunks: [{ header: '@@ -18,3 +18,4 @@', lines: [' a', '-b', '+c', '+d'] }],
      },
    ],
  },
  { type: 'log', lines: ['one', 'two', 'WARN three', 'FAIL four'], tail: 2 },
  { type: 'callout', title: 'Waiting 4 min', question: 'Allow the push?' },
];

const block = (type: string) => document.querySelector(`[data-block="${type}"]`) as HTMLElement;

describe('ContentBlocks', () => {
  it('renders text with inline code and no frame', () => {
    render(<ContentBlocks blocks={BLOCKS} />);
    expect(screen.getByText('origin/master').tagName).toBe('CODE');
  });

  it('gives framed blocks a header summary', () => {
    render(<ContentBlocks blocks={BLOCKS} />);
    expect(within(block('checks')).getByText('1 of 2 passed, 1 failed')).toBeTruthy();
    expect(within(block('steps')).getByText('1 of 3 done')).toBeTruthy();
    expect(within(block('log')).getByText('4 lines')).toBeTruthy();
    expect(block('diff').querySelector('[data-slot="diff-stat"]')?.textContent).toBe('+2 -1');
  });

  it('numbers diff lines from the hunk header and tints adds and deletes', () => {
    render(<ContentBlocks blocks={BLOCKS} />);
    const lines = Array.from(block('diff').querySelectorAll('[data-kind]'));
    expect(lines.map((l) => l.getAttribute('data-kind'))).toEqual(['context', 'del', 'add', 'add']);
    expect(lines[2].textContent).toBe('19+added c');
  });

  it('collapses a diff file and a whole block', () => {
    render(<ContentBlocks blocks={BLOCKS} />);
    const file = screen.getByRole('button', { name: /src\/notice-list\.tsx/ });
    fireEvent.click(file);
    expect(file.getAttribute('aria-expanded')).toBe('false');
    const head = within(block('log')).getAllByRole('button')[0];
    fireEvent.click(head);
    expect(block('log').dataset.state).toBe('closed');
  });

  it('renders the log in a LogView sized to its tail, levelled from the text', () => {
    render(<ContentBlocks blocks={BLOCKS} />);
    const log = block('log');
    expect(within(log).getByRole('grid').getAttribute('aria-rowcount')).toBe('4');
    expect(log.querySelector('[data-level="error"]')?.textContent).toContain('FAIL four');
    expect((log.querySelector('[data-slot="log-view"]') as HTMLElement).style.height).toBe('56px');
  });

  it('marks the active step and renders the callout as a note', () => {
    render(<ContentBlocks blocks={BLOCKS} />);
    expect(block('steps').querySelector('[aria-current="step"]')?.textContent).toContain('Build');
    expect(screen.getByRole('note').textContent).toContain('Allow the push?');
    expect(within(block('checks')).getByRole('button', { name: 'Copy block' })).toBeTruthy();
  });
});

describe('ContentBlocks duplicate labels', () => {
  it('renders rows that share a label without key collisions', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ContentBlocks
        blocks={[
          {
            type: 'facts',
            rows: [
              { label: 'Tag', value: 'one' },
              { label: 'Tag', value: 'two' },
            ],
          },
        ]}
      />
    );
    expect(screen.getAllByText('Tag')).toHaveLength(2);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('ContentBlocks stable rows', () => {
  const diff = (paths: string[]) => (
    <ContentBlocks
      blocks={[
        {
          id: 'd',
          type: 'diff',
          files: paths.map((path) => ({ path, hunks: [{ header: '@@ -1 +1 @@', lines: ['+x'] }] })),
        },
      ]}
    />
  );

  it('keeps a collapsed file collapsed when a file is inserted above it', () => {
    const { rerender } = render(diff(['b.ts']));
    fireEvent.click(screen.getByRole('button', { name: /b\.ts/ }));
    rerender(diff(['a.ts', 'b.ts']));
    expect(screen.getByRole('button', { name: /b\.ts/ }).getAttribute('aria-expanded')).toBe(
      'false'
    );
    expect(screen.getByRole('button', { name: /a\.ts/ }).getAttribute('aria-expanded')).toBe(
      'true'
    );
  });
});

describe('ContentBlock', () => {
  it('starts shut with defaultOpen false and toggles from the header', async () => {
    const { ContentBlock } = await import('./content-block');
    render(
      <ContentBlock title="Body" defaultOpen={false}>
        Inside
      </ContentBlock>
    );
    const toggle = screen.getByRole('button', { expanded: false });
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('region', { name: 'Body' })).toBeTruthy();
  });
});
