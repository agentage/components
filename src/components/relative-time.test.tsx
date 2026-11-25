import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatRelativeTime, RelativeTime } from './relative-time';

const NOW = new Date('2026-11-22T12:00:00Z').getTime();
const MIN = 60_000;

describe('formatRelativeTime', () => {
  it('reads just now, minutes, hours and days', () => {
    expect(formatRelativeTime(NOW - 20_000, NOW)).toBe('just now');
    expect(formatRelativeTime(NOW - 5 * MIN, NOW)).toBe('5 min ago');
    expect(formatRelativeTime(NOW - 3 * 60 * MIN, NOW)).toBe('3 h ago');
    expect(formatRelativeTime(NOW - 2 * 24 * 60 * MIN, NOW)).toBe('2 d ago');
    expect(formatRelativeTime(NOW + 10 * MIN, NOW)).toBe('in 10 min');
  });

  it('shows a date after 7 days and nothing for an invalid value', () => {
    expect(formatRelativeTime(NOW - 9 * 24 * 60 * MIN, NOW)).toMatch(/Nov/);
    expect(formatRelativeTime(new Date('2024-01-02T00:00:00Z'), NOW)).toMatch(/2024/);
    expect(formatRelativeTime('not a date', NOW)).toBe('');
  });
});

describe('RelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it('renders a time element with dateTime and the exact time in the title', () => {
    render(<RelativeTime value={NOW - 5 * MIN} />);
    const el = screen.getByText('5 min ago');
    expect(el.tagName).toBe('TIME');
    expect(el.getAttribute('dateTime')).toBe(new Date(NOW - 5 * MIN).toISOString());
    expect(el.getAttribute('title')).toBeTruthy();
  });

  it('updates in place on the shared timer', () => {
    render(
      <>
        <RelativeTime value={NOW - 30_000} data-testid="a" />
        <RelativeTime value={NOW - 59 * MIN} data-testid="b" />
      </>
    );
    const a = screen.getByTestId('a');
    expect(a.textContent).toBe('just now');
    act(() => vi.advanceTimersByTime(2 * MIN));
    expect(screen.getByTestId('a')).toBe(a);
    expect(a.textContent).toBe('2 min ago');
    expect(screen.getByTestId('b').textContent).toBe('1 h ago');
  });

  it('shows an absolute mono clock', () => {
    render(<RelativeTime value={NOW} format="absolute" data-testid="t" />);
    const el = screen.getByTestId('t');
    expect(el.className).toContain('font-mono');
    expect(el.textContent).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('renders empty for an invalid value', () => {
    render(<RelativeTime value="nope" data-testid="t" />);
    expect(screen.getByTestId('t').textContent).toBe('');
  });
});
