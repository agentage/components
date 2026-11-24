import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, type CardState } from './card';

const FIVE_MIN_AGO = Date.now() - 5 * 60_000;

const Widget = ({ state, onRetry }: { state?: CardState; onRetry?: () => void }) => (
  <Card
    state={state}
    minHeight={180}
    onRetry={onRetry}
    error={{ message: 'Could not load usage', reference: 'req_8f2a' }}
    data-testid="card"
  >
    <CardHeader>
      <CardTitle>Usage</CardTitle>
    </CardHeader>
    <CardContent>
      <span>1,204 requests</span>
    </CardContent>
    <CardFooter source="Edge logs" updatedAt={FIVE_MIN_AGO} />
  </Card>
);

const card = () => screen.getByTestId('card');

describe('Card states', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('keeps the header, footer and reserved height in every state', () => {
    const { rerender } = render(<Widget state="ready" />);
    const header = screen.getByText('Usage');
    for (const state of ['loading', 'empty', 'error', 'stale', 'ready'] as CardState[]) {
      rerender(<Widget state={state} />);
      expect(card().style.minHeight).toBe('180px');
      expect(card().dataset.state).toBe(state);
      expect(screen.getByText('Usage')).toBe(header);
      expect(screen.getByText('Edge logs')).toBeTruthy();
    }
  });

  it('shows a skeleton and aria-busy while loading', () => {
    render(<Widget state="loading" />);
    expect(card().getAttribute('aria-busy')).toBe('true');
    expect(card().querySelector('[data-slot="skeleton"]')).toBeTruthy();
    expect(screen.queryByText('1,204 requests')).toBeNull();
  });

  it('shows the default empty state', () => {
    render(<Widget state="empty" />);
    expect(screen.getByText('No data for this period')).toBeTruthy();
  });

  it('shows the error message, a copyable reference and Retry', () => {
    const onRetry = vi.fn();
    render(<Widget state="error" onRetry={onRetry} />);
    expect(card().querySelector('[data-slot="card-error"]')?.textContent).toContain(
      'Could not load usage'
    );
    expect(screen.getByText('req_8f2a').tagName).toBe('CODE');
    expect(screen.getByRole('button', { name: 'Copy reference' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('keeps content and badges the footer when stale', () => {
    render(<Widget state="stale" />);
    expect(screen.getByText('1,204 requests')).toBeTruthy();
    expect(card().querySelector('[data-slot="card-stale"]')?.textContent).toBe('Stale');
    expect(screen.getByText('5 min ago')).toBeTruthy();
  });

  it('announces a state change politely, not the first render', () => {
    const { rerender } = render(<Widget state="ready" />);
    const region = document.querySelector('[data-ds-announcer="polite"]') as HTMLElement;
    act(() => vi.advanceTimersByTime(100));
    expect(region.textContent).toBe('');
    rerender(<Widget state="loading" />);
    act(() => vi.advanceTimersByTime(200));
    expect(region.textContent).toBe('Loading');
  });

  it('merges cards that change together into one named message', () => {
    const Pair = ({ state }: { state: CardState }) => (
      <>
        <Card state={state} announceLabel="Revenue" />
        <Card state={state} announceLabel="Users" />
        <Card state={state === 'loading' ? 'error' : state} announceLabel="Cost" />
      </>
    );
    const { rerender } = render(<Pair state="ready" />);
    const region = document.querySelector('[data-ds-announcer="polite"]') as HTMLElement;
    rerender(<Pair state="loading" />);
    act(() => vi.advanceTimersByTime(200));
    expect(region.textContent).toBe('Revenue, Users: Loading. Cost: Failed to load');
  });

  it('keeps focus on Refresh while refreshing and ignores clicks until done', () => {
    const onRefresh = vi.fn();
    const { rerender } = render(<CardFooter onRefresh={onRefresh} />);
    const button = screen.getByRole('button', { name: 'Refresh' });
    button.focus();
    fireEvent.click(button);
    expect(onRefresh).toHaveBeenCalledTimes(1);
    rerender(<CardFooter onRefresh={onRefresh} refreshing />);
    expect(document.activeElement).toBe(button);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
    fireEvent.click(button);
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
