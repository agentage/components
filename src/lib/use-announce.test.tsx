import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { announce, useAnnounce } from './use-announce';

const region = (p: string) => document.querySelector(`[data-ds-announcer="${p}"]`);

describe('announce', () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('clears, then writes the message into one polite status region', () => {
    vi.useFakeTimers();
    announce('Saved');
    const el = region('polite') as HTMLElement;
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.getAttribute('role')).toBe('status');
    expect(el.textContent).toBe('');
    vi.advanceTimersByTime(50);
    expect(el.textContent).toBe('Saved');
    announce('Saved again');
    expect(document.querySelectorAll('[data-ds-announcer="polite"]')).toHaveLength(1);
  });

  it('uses a separate assertive alert region', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAnnounce('assertive'));
    result.current('Save failed');
    vi.advanceTimersByTime(50);
    expect(region('assertive')?.textContent).toBe('Save failed');
    expect(region('assertive')?.getAttribute('role')).toBe('alert');
    result.current('Back to normal', 'polite');
    vi.advanceTimersByTime(50);
    expect(region('polite')?.textContent).toBe('Back to normal');
  });

  it('mounts both regions before the first message', () => {
    renderHook(() => useAnnounce());
    expect(region('polite')?.textContent).toBe('');
    expect(region('assertive')?.getAttribute('aria-live')).toBe('assertive');
  });

  it('returns a stable function', () => {
    const { result, rerender } = renderHook(() => useAnnounce());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
