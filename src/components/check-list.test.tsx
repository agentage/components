import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CheckItem, CheckList, checkSummary } from './check-list';

describe('CheckList', () => {
  it('counts the rows into the header summary', () => {
    render(
      <CheckList title="Checks">
        <CheckItem label="verify" value="2 min 04 s" />
        <CheckItem label="e2e gate" status="fail" value="40 of 41" />
        <CheckItem label="deploy" status="skipped" />
      </CheckList>
    );
    expect(screen.getByText('1 of 2 passed, 1 failed, 1 skipped')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Failed' })).toBeTruthy();
    expect(screen.getByText('40 of 41')).toBeTruthy();
  });

  it('draws a glyph per status', () => {
    const { container } = render(
      <CheckList>
        <CheckItem label="a" status="ok" />
        <CheckItem label="b" status="running" />
        <CheckItem label="c" status="pending" />
        <CheckItem label="d" status="skipped" />
      </CheckList>
    );
    const shapes = Array.from(container.querySelectorAll('[data-slot="status-glyph"]')).map((g) =>
      g.getAttribute('data-shape')
    );
    expect(shapes).toEqual(['check', 'disc', 'ring', 'dashed']);
  });

  it('expands a row detail', () => {
    render(
      <CheckList>
        <CheckItem label="lint" status="fail">
          3 errors in src/a.ts
        </CheckItem>
      </CheckList>
    );
    const row = screen.getByRole('button', { name: /lint/ });
    expect(row.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(row);
    expect(row.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(row.getAttribute('aria-controls') ?? '')?.dataset.state).toBe(
      'open'
    );
  });

  it('summarises running rows', () => {
    expect(checkSummary(['ok', 'running'])).toBe('1 of 2 passed, 1 running');
  });
});

const Steps = ({ variant }: { variant?: 'card' | 'plain' }) => {
  const [done, setDone] = useState([true, false]);
  return (
    <CheckList title="Steps" variant={variant}>
      {['Write the change', 'Add coverage'].map((t, i) => (
        <CheckItem
          key={t}
          label={t}
          checked={done[i]}
          onCheckedChange={(on) => setDone((d) => d.map((v, j) => (j === i ? on : v)))}
        />
      ))}
    </CheckList>
  );
};

describe('CheckList checkbox rows', () => {
  it('counts the checked rows and strikes them through', () => {
    render(<Steps />);
    expect(screen.getByText('1 of 2')).toBeTruthy();
    expect(screen.getByText('Write the change').className).toContain('line-through');
    expect(screen.getByText('Add coverage').className).not.toContain('line-through');
    fireEvent.click(screen.getByRole('checkbox', { name: 'Add coverage' }));
    expect(screen.getByText('2 of 2')).toBeTruthy();
    expect(screen.getByText('Add coverage').className).toContain('line-through');
  });

  it('toggles from the label text and reports the state on the row', () => {
    const { container } = render(<Steps />);
    fireEvent.click(screen.getByText('Write the change'));
    expect(
      screen.getByRole('checkbox', { name: 'Write the change' }).getAttribute('aria-checked')
    ).toBe('false');
    const rows = container.querySelectorAll('[data-slot="check-item"]');
    expect(rows[0].getAttribute('data-state')).toBe('unchecked');
  });

  it('calls onCheckedChange with the next state', () => {
    const onCheckedChange = vi.fn();
    render(
      <CheckList>
        <CheckItem label="One" checked={false} onCheckedChange={onCheckedChange} />
      </CheckList>
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'One' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle a disabled row', () => {
    const onCheckedChange = vi.fn();
    render(
      <CheckList>
        <CheckItem label="One" checked={false} disabled onCheckedChange={onCheckedChange} />
      </CheckList>
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'One' }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('shows a small uppercase label header for the plain variant', () => {
    const { container } = render(<Steps variant="plain" />);
    const head = container.querySelector('[data-slot="check-list-head"]') as HTMLElement;
    expect(head.className).toContain('uppercase');
    expect(head.className).toContain('text-2xs');
    expect(
      (container.querySelector('[data-slot="check-list"]') as HTMLElement).className
    ).not.toContain('border');
  });
});

describe('Row status vocabulary', () => {
  it('reads the aliases as the shared statuses', () => {
    expect(checkSummary(['done', 'fail', 'failed', 'active'])).toBe(
      '1 of 4 passed, 2 failed, 1 running'
    );
    render(
      <CheckList title="Aliases">
        <CheckItem label="Old spelling" status="fail" />
      </CheckList>
    );
    expect(screen.getByRole('img', { name: 'Failed' })).toBeTruthy();
  });
});

describe('CheckItem detail', () => {
  it('opens the detail on click', () => {
    render(
      <CheckList title="Checks">
        <CheckItem label="Lint">detail</CheckItem>
      </CheckList>
    );
    const row = screen.getByRole('button', { name: /Lint/ });
    fireEvent.click(row);
    expect(row.getAttribute('aria-expanded')).toBe('true');
  });
});
