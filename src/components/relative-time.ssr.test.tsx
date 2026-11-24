import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RelativeTime } from './relative-time';

const NOW = new Date('2026-11-22T12:00:00Z').getTime();

const hydrate = (ui: React.ReactElement) => {
  const host = document.createElement('div');
  host.innerHTML = renderToString(ui);
  document.body.appendChild(host);
  const serverHtml = host.innerHTML;
  const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const recoverable = vi.fn();
  let root: ReturnType<typeof hydrateRoot> | undefined;
  act(() => {
    root = hydrateRoot(host, ui, { onRecoverableError: recoverable });
  });
  return { host, serverHtml, errors, recoverable, unmount: () => act(() => root?.unmount()) };
};

describe('RelativeTime on the server', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('server text is a width holder; the client writes local text with no hydration error', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const ui = <RelativeTime value={NOW} format="absolute" data-testid="t" />;
    const { host, serverHtml, errors, recoverable, unmount } = hydrate(ui);
    expect(serverHtml).toContain('datetime="2026-11-22T12:00:00.000Z"');
    expect(serverHtml).toContain('00:00:00');
    expect(serverHtml).not.toContain('title=');
    const el = host.querySelector('time') as HTMLElement;
    expect(el.textContent).toBe(new Date(NOW).toLocaleTimeString(undefined, { hour12: false }));
    expect(el.getAttribute('title')).toBeTruthy();
    expect(recoverable).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
    unmount();
  });

  it('shares one timer and drops it when the last relative instance unmounts', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const ui = (
      <>
        <RelativeTime value={NOW - 120_000} />
        <RelativeTime value={NOW - 60_000} />
        <RelativeTime value={NOW} format="absolute" />
      </>
    );
    const { host, unmount } = hydrate(ui);
    expect(host.textContent).toContain('2 min ago');
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('reads a date-only string as a local day', () => {
    const local = new Date(2026, 10, 22, 12).getTime();
    vi.useFakeTimers();
    vi.setSystemTime(local);
    const { host, unmount } = hydrate(<RelativeTime value="2026-11-22" />);
    expect(host.textContent).toBe('12 h ago');
    expect(host.querySelector('time')?.getAttribute('dateTime')).toBe(
      new Date(2026, 10, 22).toISOString()
    );
    unmount();
  });
});
