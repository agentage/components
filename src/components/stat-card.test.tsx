import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CardMeta } from './card-state';
import { Sparkline } from './sparkline';
import { StatCard } from './stat-card';

const card = () => document.querySelector('[data-slot="stat-card"]') as HTMLElement;

describe('StatCard', () => {
  it('renders a div by default and forwards its ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<StatCard ref={ref} title="Documents" value={12} />);
    expect(card().tagName).toBe('DIV');
    expect(ref.current).toBe(card());
  });

  it('keeps the minimal card markup: no container, hint or footer', () => {
    render(<StatCard title="Documents" value={12} />);
    expect(card().querySelector('.\\@container')).toBeNull();
    expect(card().querySelector('[data-slot="stat-card-hint"]')).toBeNull();
    expect(card().querySelector('[data-slot="stat-card-footer"]')).toBeNull();
  });

  it('draws the trend arrow by direction and the colour by sentiment', () => {
    const { rerender } = render(
      <StatCard title="T" value={1} trend={{ value: '+5', direction: 'up' }} />
    );
    const trend = () => card().querySelector('[data-slot="stat-card-trend"]') as HTMLElement;
    expect(trend().className).toContain('text-success');
    expect(trend().textContent).toContain('Trending up');
    rerender(
      <StatCard
        title="T"
        value={1}
        trend={{ value: '+5', direction: 'up', sentiment: 'down-is-good' }}
      />
    );
    expect(trend().className).toContain('text-destructive');
    rerender(
      <StatCard
        title="T"
        value={1}
        trend={{ value: '-5', direction: 'down', sentiment: 'neutral' }}
      />
    );
    expect(trend().className).toContain('text-muted-foreground');
    expect(trend().textContent).toContain('Trending down');
  });

  it('puts children under the value in a size container', () => {
    render(
      <StatCard title="Requests" value="48k" hint="45k yesterday">
        <Sparkline data={[1, 2, 3]} chartLabel="Rising" />
      </StatCard>
    );
    expect(card().querySelector('.\\@container [data-slot="sparkline"]')).not.toBeNull();
    expect(screen.getByRole('group', { name: 'Requests', description: '48k 45k yesterday' })).toBe(
      card()
    );
  });

  it('wraps a plain footer in a row and keeps a CardMeta footer as is', () => {
    const { rerender } = render(<StatCard title="T" value={1} footer={<a href="#r">All</a>} />);
    expect(screen.getByRole('link', { name: 'All' }).parentElement?.className).toContain(
      'justify-between'
    );
    rerender(<StatCard title="T" value={1} footer={<CardMeta source="Edge" />} />);
    expect(card().querySelector('[data-slot="card-meta"]')?.textContent).toContain('Edge');
  });

  it('is pressable with onClick: the title is the one button', async () => {
    const onClick = vi.fn();
    render(<StatCard title="Reports" value={3} onClick={onClick} footer={<a href="#r">All</a>} />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.textContent).toBe('Reports');
    expect(screen.getByRole('link', { name: 'All' }).closest('button')).toBeNull();
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(card().getAttribute('role')).toBeNull();
  });

  it('names the pressable control by title, describes it by value and hint, and takes its ARIA props', () => {
    render(
      <StatCard
        title="Reports"
        value={3}
        hint="This week"
        onClick={vi.fn()}
        aria-pressed
        aria-controls="panel"
        data-testid="card"
      />
    );
    const button = screen.getByRole('button', { name: 'Reports', description: '3 This week' });
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('aria-controls')).toBe('panel');
    expect(screen.getByTestId('card').getAttribute('aria-pressed')).toBeNull();
  });

  it('is not a button by default', () => {
    render(<StatCard title="Reports" value={3} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('StatCard states', () => {
  it('covers the body with a skeleton and keeps the parts in flow', () => {
    render(<StatCard title="T" value={12} hint="h" state="loading" />);
    expect(card().getAttribute('aria-busy')).toBe('true');
    expect(card().querySelector('[data-slot="stat-card-skeleton"]')).not.toBeNull();
    expect(card().querySelector('.invisible [data-slot="stat-card-hint"]')).not.toBeNull();
  });

  it('takes a custom loading body', () => {
    render(<StatCard title="T" value={1} state="loading" fallback={{ loading: <i>wait</i> }} />);
    expect(screen.getByText('wait')).toBeTruthy();
  });

  it('shows a one-line empty body, default and custom', () => {
    const { rerender } = render(<StatCard title="T" value={1} state="empty" />);
    expect(screen.getByText('No data for this period.')).toBeTruthy();
    rerender(<StatCard title="T" value={1} state="empty" fallback={{ empty: 'Nothing yet' }} />);
    expect(screen.getByText('Nothing yet')).toBeTruthy();
  });

  it('shows an error with a reference and Retry', async () => {
    const onRetry = vi.fn();
    render(
      <StatCard
        title="T"
        value={1}
        state="error"
        fallback={{ error: { message: 'Broke', reference: 'req-1' }, onRetry }}
      />
    );
    expect(screen.getByText('Broke')).toBeTruthy();
    expect(screen.getByText('req-1')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('shows a plain error message by default', () => {
    render(<StatCard title="T" value={1} state="error" />);
    expect(screen.getByText('Could not load this data.')).toBeTruthy();
  });

  it('describes a covered card by its state body, not the hidden value', () => {
    render(<StatCard title="Reqs" value={1} state="empty" />);
    expect(
      screen.getByRole('group', { name: 'Reqs', description: 'No data for this period.' })
    ).toBe(card());
  });

  it('marks a CardMeta footer stale, else badges the header', () => {
    const { rerender } = render(
      <StatCard title="T" value={1} state="stale" footer={<CardMeta source="Edge" />} />
    );
    const badge = () => card().querySelector('[data-slot="card-stale"]') as HTMLElement;
    expect(badge().closest('[data-slot="card-meta"]')).not.toBeNull();
    rerender(<StatCard title="T" value={1} state="stale" />);
    expect(badge().closest('[data-slot="card-meta"]')).toBeNull();
  });
});
