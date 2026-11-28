import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Conversation } from './conversation';

let resize: (() => void) | undefined;
const observed: Element[] = [];

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(cb: () => void) {
        resize = cb;
      }
      observe(el: Element) {
        observed.push(el);
      }
      disconnect() {}
    }
  );
});
afterEach(() => vi.unstubAllGlobals());

/** jsdom has no layout: give the scroller fixed metrics and a scrollTo that moves it. */
const metrics = (el: HTMLElement, height: number) => {
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: height });
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: 100 });
  el.scrollTo = vi.fn(({ top }: ScrollToOptions) => {
    el.scrollTop = Math.min(top ?? 0, height - 100);
  }) as unknown as typeof el.scrollTo;
};

describe('Conversation', () => {
  it('is a named, keyboard-reachable log', () => {
    observed.length = 0;
    render(<Conversation label="Chat">hi</Conversation>);
    const log = screen.getByRole('log', { name: 'Chat' });
    expect(observed).toContain(log);
    expect(observed).toHaveLength(2);
    expect(log.getAttribute('tabindex')).toBe('0');
  });

  it('follows new content while the reader is at the bottom', () => {
    render(<Conversation>hi</Conversation>);
    const log = screen.getByRole('log');
    metrics(log, 500);
    act(() => resize?.());
    expect(log.scrollTo).toHaveBeenLastCalledWith({ top: 500, behavior: 'auto' });
    expect(log.scrollTop).toBe(400);
  });

  it('holds still after the reader scrolls up and offers a jump back', () => {
    render(<Conversation>hi</Conversation>);
    const log = screen.getByRole('log');
    const jump = screen.getByRole('button', { hidden: true });
    expect(jump.getAttribute('aria-hidden')).toBe('true');
    expect(jump.getAttribute('tabindex')).toBe('-1');

    metrics(log, 800);
    log.scrollTop = 100;
    fireEvent.scroll(log);
    act(() => resize?.());
    expect(log.scrollTo).not.toHaveBeenCalled();
    expect(jump.getAttribute('aria-hidden')).toBeNull();
    expect(jump.getAttribute('tabindex')).toBe('0');

    fireEvent.click(screen.getByRole('button', { name: 'Scroll to the latest message' }));
    expect(log.scrollTo).toHaveBeenLastCalledWith({ top: 800, behavior: 'smooth' });
    expect(jump.getAttribute('aria-hidden')).toBe('true');
  });

  it('re-checks the jump button when content changes while away', () => {
    render(<Conversation>hi</Conversation>);
    const log = screen.getByRole('log');
    const jump = screen.getByRole('button', { hidden: true });
    metrics(log, 200);
    log.scrollTop = 0;
    fireEvent.scroll(log);
    expect(jump.getAttribute('aria-hidden')).toBeNull();
    log.scrollTop = 100;
    act(() => resize?.());
    expect(log.scrollTo).not.toHaveBeenCalled();
    expect(jump.getAttribute('aria-hidden')).toBe('true');
  });
});
