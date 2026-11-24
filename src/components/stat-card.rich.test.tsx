import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StatCard } from './stat-card';
import { Sparkline } from './stat-card-charts';

const slot = (c: HTMLElement, name: string) => c.querySelector(`[data-slot="${name}"]`);

describe('StatCard rich parts', () => {
  it('keeps the minimal card markup: no container, wrapper or footer', () => {
    const { container } = render(<StatCard title="Documents" value={12} />);
    const card = slot(container, 'stat-card') as HTMLElement;
    expect(card.className).toBe(
      'flex flex-col rounded-lg border border-border bg-card transition-colors duration-fast hover:border-muted-foreground gap-2 px-3.5 py-3'
    );
    expect(card.children).toHaveLength(2);
    expect(container.querySelector('.\\@container')).toBeNull();
    expect(slot(container, 'stat-card-footer')).toBeNull();
    expect(card.getAttribute('data-state')).toBeNull();
  });

  it('draws the trend arrow by direction and the tone by sentiment', () => {
    const { container } = render(
      <StatCard
        title="Latency"
        value="182 ms"
        trend={{ value: '+12 ms', up: true, sentiment: 'down-is-good' }}
      />
    );
    const chip = container.querySelector('.text-destructive') as HTMLElement;
    expect(chip.textContent).toContain('Trending up');
    expect(chip.querySelector('polyline')?.getAttribute('points')).toBe(
      '22 7 13.5 15.5 8.5 10.5 2 17'
    );
  });

  it('mutes a neutral trend and points a fall down', () => {
    const { container } = render(
      <StatCard title="Queue" value={4} trend={{ value: '-2', up: false, sentiment: 'neutral' }} />
    );
    const chip = container.querySelector('.text-muted-foreground.border') as HTMLElement;
    expect(chip.querySelector('polyline')?.getAttribute('points')).toBe(
      '22 17 13.5 8.5 8.5 13.5 2 7'
    );
  });

  it('renders the period in the header', () => {
    const { container } = render(<StatCard title="Errors" value={2} period="Last 24 h" />);
    expect(slot(container, 'stat-card-period')?.textContent).toBe('Last 24 h');
  });

  it('renders a comparison line with a direction arrow and tone', () => {
    const { container } = render(
      <StatCard
        title="Signups"
        value={47}
        comparison={{ previous: 42, label: 'yesterday', delta: '+5', up: true }}
      />
    );
    const line = slot(container, 'stat-card-comparison') as HTMLElement;
    expect(line.textContent).toBe('42 yesterday,up +5');
    expect(line.querySelector('.text-success')).not.toBeNull();
  });

  it('takes the comparison direction and sentiment from the trend', () => {
    const { container } = render(
      <StatCard
        title="Latency"
        value="182 ms"
        trend={{ value: '+7%', up: true, sentiment: 'down-is-good' }}
        comparison={{ previous: '170 ms', label: 'last week', delta: '+12 ms' }}
      />
    );
    expect(slot(container, 'stat-card-comparison')?.querySelector('.text-destructive')).not.toBe(
      null
    );
  });

  it('leaves a comparison without a direction unglyphed', () => {
    const { container } = render(
      <StatCard title="Size" value="4 GB" comparison={{ previous: '3.8 GB', delta: '+0.2' }} />
    );
    expect(slot(container, 'stat-card-comparison')?.querySelector('svg')).toBeNull();
  });

  it('hides the chart, reads its label and reflows by container query', () => {
    const { container } = render(
      <StatCard
        title="Requests"
        value="1,204"
        chart={<Sparkline data={[1, 3, 2, 5]} />}
        chartLabel="Rising over 24 hours"
      />
    );
    const chart = slot(container, 'stat-card-chart') as HTMLElement;
    expect(chart.getAttribute('aria-hidden')).toBe('true');
    expect(chart.className).toContain('@min-[15rem]:w-28');
    expect(screen.getByText('Rising over 24 hours').className).toBe('sr-only');
    expect(slot(container, 'stat-card-value-row')?.className).toContain('@min-[15rem]:flex-row');
    expect(container.querySelector('.\\@container')).not.toBeNull();
  });

  it('renders facts as a description list that wraps when narrow', () => {
    render(
      <StatCard
        title="Duration"
        value="3.1 s"
        facts={[
          { label: 'Min', value: '1.2 s' },
          { label: 'Max', value: '9.8 s' },
        ]}
      />
    );
    const list = screen.getByText('Min').closest('dl') as HTMLElement;
    expect(list.className).toContain('grid-cols-2');
    expect(list.className).toContain('@min-[15rem]:grid-flow-col');
    expect(screen.getByText('9.8 s').className).toContain('tabular-nums');
  });

  it('renders a breakdown bar with a legend', () => {
    render(
      <StatCard
        title="Results"
        value={47}
        breakdown={[
          { key: 'ok', label: 'Done', count: 45, tone: 'success' },
          { key: 'bad', label: 'Failed', count: 2, tone: 'destructive' },
        ]}
      />
    );
    expect(screen.getByRole('img', { name: 'Done 45, Failed 2' })).toBeTruthy();
    expect(screen.getByText('Failed 2')).toBeTruthy();
  });

  it('renders the history slot above the footer link layer', () => {
    const { container } = render(
      <StatCard title="Backup" value="96%" history={<span>strip</span>} />
    );
    expect(slot(container, 'stat-card-history')?.textContent).toBe('strip');
  });

  it('adds the footer meta and refresh action', async () => {
    const onRefresh = vi.fn();
    const { container } = render(
      <StatCard
        title="Usage"
        value={3}
        footer={<span>Owner: Ops</span>}
        source="Region: EU West"
        onRefresh={onRefresh}
      />
    );
    const footer = slot(container, 'stat-card-footer') as HTMLElement;
    expect(footer.textContent).toContain('Owner: Ops');
    expect(footer.textContent).toContain('Region: EU West');
    await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});

describe('StatCard states', () => {
  const rich = {
    title: 'Requests',
    value: '1,204',
    comparison: { previous: '1,100', label: 'yesterday', delta: '+104', up: true },
    chart: <Sparkline data={[1, 2, 3]} />,
  };

  it('covers the body with a shaped skeleton and keeps the parts in flow', () => {
    const { container } = render(<StatCard {...rich} state="loading" />);
    const card = slot(container, 'stat-card') as HTMLElement;
    expect(card.getAttribute('aria-busy')).toBe('true');
    expect(slot(container, 'stat-card-skeleton')).not.toBeNull();
    const hidden = container.querySelector('.invisible') as HTMLElement;
    expect(hidden.getAttribute('aria-hidden')).toBe('true');
    expect(hidden.textContent).toContain('1,204');
  });

  it('takes a custom skeleton', () => {
    render(<StatCard {...rich} state="loading" skeleton={<span>wait</span>} />);
    expect(screen.getByText('wait')).toBeTruthy();
  });

  it('shows a one-line empty body', () => {
    const { container } = render(<StatCard {...rich} state="empty" />);
    expect(slot(container, 'stat-card-empty')?.textContent).toBe('No data for this period.');
  });

  it('shows an error with a reference and Retry', async () => {
    const onRetry = vi.fn();
    render(
      <StatCard
        {...rich}
        state="error"
        error={{ message: 'Could not load.', reference: 'req-7c1d' }}
        onRetry={onRetry}
      />
    );
    expect(screen.getByText('req-7c1d')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows a plain error message', () => {
    render(<StatCard {...rich} state="error" error="Timed out." />);
    expect(screen.getByText('Timed out.')).toBeTruthy();
  });

  it('badges a stale card in the footer', () => {
    const { container } = render(<StatCard {...rich} state="stale" />);
    expect(slot(container, 'card-stale')?.textContent).toBe('Stale');
    expect(slot(container, 'stat-card-state')).toBeNull();
  });

  it('describes a pressable card by value and comparison', () => {
    render(<StatCard {...rich} pressable onClick={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Requests', description: '1,204 1,100 yesterday,up +104' })
    ).toBeTruthy();
  });
  it('names a plain card by title and describes it by value and comparison', () => {
    render(<StatCard {...rich} />);
    expect(
      screen.getByRole('group', { name: 'Requests', description: '1,204 1,100 yesterday,up +104' })
    ).toBeTruthy();
  });

  it('describes a covered card by its state body, not the hidden value', () => {
    render(<StatCard {...rich} state="empty" />);
    expect(
      screen.getByRole('group', { name: 'Requests', description: 'No data for this period.' })
    ).toBeTruthy();
  });

  it('puts the stale badge in the header when the card has no footer', () => {
    const { container } = render(<StatCard title="Queue" value={4} state="stale" />);
    expect(slot(container, 'card-stale')).not.toBeNull();
    expect(slot(container, 'stat-card-footer')).toBeNull();
  });
});
