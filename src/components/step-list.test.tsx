import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Step, StepList } from './step-list';

const detail = (name: string) =>
  screen.getByRole('button', { name: new RegExp(name) }).nextElementSibling as HTMLElement;

describe('StepList', () => {
  it('renders an ordered list of steps', () => {
    const { container } = render(
      <StepList>
        <Step offset="+0:00" label="read_file" duration="1s" />
        <Step offset="+0:04" label="Plan" mono={false} />
      </StepList>
    );
    expect(container.querySelector('ol')).not.toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('read_file').parentElement?.className).toContain('font-mono');
    expect(screen.getByText('Plan').parentElement?.className).not.toContain('font-mono');
  });

  it('expands and collapses the detail, inert while shut', () => {
    render(
      <StepList>
        <Step label="search">3 results</Step>
      </StepList>
    );
    const head = screen.getByRole('button', { name: /search/ });
    expect(head.getAttribute('aria-expanded')).toBe('false');
    expect(detail('search').hasAttribute('inert')).toBe(true);
    expect(head.getAttribute('aria-controls')).toBe(detail('search').id);
    fireEvent.click(head);
    expect(head.getAttribute('aria-expanded')).toBe('true');
    expect(detail('search').hasAttribute('inert')).toBe(false);
    expect(detail('search').className).toContain('grid-rows-[1fr]');
  });

  it('marks an error step with an edge and text, not colour only', () => {
    render(
      <StepList>
        <Step label="post" status="error" defaultOpen>
          403 from the API
        </Step>
      </StepList>
    );
    const row = screen.getByRole('listitem');
    expect(row.dataset.status).toBe('error');
    expect(row.className).toContain('linear-gradient(var(--color-destructive)');
    expect(screen.getByRole('button', { name: /post \(error\)/ })).toBeTruthy();
    expect(screen.getByText('403 from the API').className).toContain('text-destructive');
  });
});

describe('StepList enhancements', () => {
  it('shows a status glyph per step, a footer and the 13 px size', () => {
    const { container } = render(
      <StepList size="md" glyphs footer={<span>Total 1m 32s</span>}>
        <Step label="plan" status="ok" />
        <Step label="fetch" status="running" />
        <Step label="post" status="pending" />
      </StepList>
    );
    expect(screen.getByRole('img', { name: 'Running' }).getAttribute('class')).toContain(
      'animate-breathe'
    );
    expect(screen.getByRole('img', { name: 'Pending' })).toBeTruthy();
    expect(screen.getByText('Total 1m 32s')).toBeTruthy();
    expect(container.querySelector('ol')?.dataset.glyphs).toBe('true');
    expect(screen.getByText('plan').closest('div')?.className).toContain('text-ui');
  });

  it('moves between expandable steps with Up and Down', () => {
    render(
      <StepList>
        <Step label="one">a</Step>
        <Step label="two">b</Step>
      </StepList>
    );
    const [one, two] = screen.getAllByRole('button');
    one.focus();
    fireEvent.keyDown(one, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(two);
    fireEvent.keyDown(two, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(one);
  });
});

describe('Step status aliases', () => {
  it('treats failed as the error status, with its edge and label', () => {
    render(
      <StepList glyphs>
        <Step label="build" status="failed" />
      </StepList>
    );
    expect(screen.getByText('(error)')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Failed' })).toBeTruthy();
  });
});
