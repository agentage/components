import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LogView, type LogLine } from './log-view';
import { indexAt, isAtBottom, offsetsOf, windowOf } from './log-view.model';

const make = (n: number, from = 0): LogLine[] =>
  Array.from({ length: n }, (_, k) => {
    const i = from + k;
    return {
      id: `l${String(i)}`,
      time: 1_700_000_000_000 + i * 1000,
      level: i % 10 === 0 ? 'error' : i % 5 === 0 ? 'warn' : 'info',
      message: `line ${String(i)}`,
      fields: i === 1 ? { status: 500, path: '/api' } : undefined,
    };
  });

/** jsdom has no layout: give the scroller a size and a writable scrollTop. */
const fakeBox = (el: HTMLElement, total: () => number, height = 240) => {
  let top = 0;
  Object.defineProperty(el, 'clientHeight', { configurable: true, get: () => height });
  Object.defineProperty(el, 'scrollHeight', { configurable: true, get: total });
  Object.defineProperty(el, 'scrollTop', {
    configurable: true,
    get: () => top,
    set: (v: number) => (top = Math.max(0, Math.min(v, total() - height))),
  });
};

const grid = () => screen.getByRole('grid');
const rowsShown = () => document.querySelectorAll('[data-line]').length;

describe('log view model', () => {
  it('computes offsets, the line at a point and the window', () => {
    const o = offsetsOf(5, 24, [0, 100]);
    expect(o).toEqual([0, 24, 148, 172, 196, 220]);
    expect(indexAt(o, 30)).toBe(1);
    expect(indexAt(o, 150)).toBe(2);
    expect(windowOf(offsetsOf(10_000, 24, []), 24_000, 240, 2)).toEqual([998, 1013]);
    expect(isAtBottom(760, 240, 1000)).toBe(true);
    expect(isAtBottom(500, 240, 1000)).toBe(false);
  });
});

describe('LogView', () => {
  it('renders only a window of 10k lines with level glyphs', () => {
    render(<LogView lines={make(10_000)} />);
    expect(grid().getAttribute('aria-rowcount')).toBe('10000');
    expect(rowsShown()).toBeLessThan(60);
    const first = document.querySelector('[data-line="l0"]') as HTMLElement;
    expect(first.dataset.level).toBe('error');
    expect(first.querySelector('[data-shape="cross"]')).toBeTruthy();
  });

  it('filters by level and marks the search text', () => {
    render(<LogView lines={make(50)} filter={['error']} highlight="line 1" />);
    expect(grid().getAttribute('aria-rowcount')).toBe('5');
    expect(document.querySelector('[data-line="l10"] mark')?.textContent).toBe('line 1');
  });

  it('follows the tail, pauses on scroll up and jumps back with the new-lines button', () => {
    const onFollowChange = vi.fn();
    let lines = make(100);
    const { rerender } = render(
      <LogView lines={lines} defaultFollow onFollowChange={onFollowChange} />
    );
    const el = grid();
    fakeBox(el, () => lines.length * 24);
    lines = make(110);
    rerender(<LogView lines={lines} defaultFollow onFollowChange={onFollowChange} />);
    expect(el.scrollTop).toBe(110 * 24 - 240);
    el.scrollTop = 1000;
    fireEvent.scroll(el);
    expect(onFollowChange).toHaveBeenLastCalledWith(false);
    lines = make(113);
    rerender(<LogView lines={lines} defaultFollow onFollowChange={onFollowChange} />);
    expect(el.scrollTop).toBe(1000);
    fireEvent.click(screen.getByRole('button', { name: '3 new lines' }));
    expect(onFollowChange).toHaveBeenLastCalledWith(true);
    expect(el.scrollTop).toBe(113 * 24 - 240);
    expect(screen.queryByRole('button', { name: /new lines/ })).toBeNull();
  });

  it('moves with the arrow keys, expands fields with Enter and jumps with End', () => {
    const onLineOpen = vi.fn();
    render(<LogView lines={make(30)} onLineOpen={onLineOpen} />);
    const el = grid();
    fakeBox(el, () => 30 * 24 + 160);
    fireEvent.keyDown(el, { key: 'ArrowDown' });
    fireEvent.keyDown(el, { key: 'ArrowDown' });
    const active = el.getAttribute('aria-activedescendant') ?? '';
    expect(document.getElementById(active)?.dataset.line).toBe('l1');
    fireEvent.keyDown(el, { key: 'Enter' });
    expect(onLineOpen).toHaveBeenCalledWith(expect.objectContaining({ id: 'l1' }));
    expect(
      document
        .getElementById(active)
        ?.querySelector('[aria-expanded]')
        ?.getAttribute('aria-expanded')
    ).toBe('true');
    expect(screen.getByRole('tree', { name: 'Fields of line 2' })).toBeTruthy();
    fireEvent.keyDown(el, { key: 'End' });
    fireEvent.scroll(el);
    const last = el.getAttribute('aria-activedescendant') ?? '';
    expect(document.getElementById(last)?.dataset.line).toBe('l29');
  });

  it('keeps the node of a line when new lines arrive', () => {
    const { rerender } = render(<LogView lines={make(5)} />);
    const node = document.querySelector('[data-line="l2"]');
    rerender(<LogView lines={make(8)} />);
    expect(document.querySelector('[data-line="l2"]')).toBe(node);
  });

  it('renders every line in wrap mode', () => {
    render(<LogView lines={make(200)} wrap showTime="relative" />);
    expect(rowsShown()).toBe(200);
  });
});
