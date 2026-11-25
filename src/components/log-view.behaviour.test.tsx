import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LogView, type LogLine } from './log-view';

const make = (n: number, from = 0): LogLine[] =>
  Array.from({ length: n }, (_, k) => {
    const i = from + k;
    return {
      id: `l${String(i)}`,
      time: 1_700_000_000_000 + i * 1000,
      level: i % 10 === 0 ? 'error' : 'info',
      message: `line ${String(i)}`,
      fields: i === 0 ? { a: { b: { c: { d: 1 } } } } : undefined,
    };
  });

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
const row = (id: string) => document.querySelector(`[data-line="${id}"]`) as HTMLElement;
let writeText: ReturnType<typeof vi.fn>;

beforeEach(() => {
  writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
});
afterEach(() => window.getSelection()?.removeAllRanges());

describe('LogView behaviour', () => {
  it('renders and copies a line with a time that is not a date', () => {
    render(<LogView lines={[{ id: 'x', time: 'garbage', level: 'info', message: 'boom' }]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy line' }));
    expect(writeText).toHaveBeenCalledWith('garbage INFO boom');
    fireEvent.keyDown(grid(), { key: 'ArrowDown' });
    fireEvent.keyDown(grid(), { key: 'c', code: 'KeyC', ctrlKey: true });
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it('leaves a native copy alone while text is selected', () => {
    render(<LogView lines={make(3)} />);
    fireEvent.keyDown(grid(), { key: 'ArrowDown' });
    window.getSelection()?.selectAllChildren(row('l0'));
    fireEvent.keyDown(grid(), { key: 'c', code: 'KeyC', ctrlKey: true });
    expect(writeText).not.toHaveBeenCalled();
    window.getSelection()?.removeAllRanges();
    fireEvent.keyDown(grid(), { key: 'c', code: 'KeyC', metaKey: true });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('ERROR line 0'));
  });

  it('opens and closes a line with Right and Left', () => {
    render(<LogView lines={make(3)} />);
    fireEvent.keyDown(grid(), { key: 'ArrowDown' });
    fireEvent.keyDown(grid(), { key: 'ArrowRight' });
    expect(row('l0').querySelector('[aria-expanded]')?.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('tree', { name: 'Fields of line 1' })).toBeTruthy();
    fireEvent.keyDown(grid(), { key: 'ArrowLeft' });
    expect(row('l0').querySelector('[aria-expanded]')?.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('tree')).toBeNull();
  });

  it('keeps focus on the grid after a click and keeps the active row rendered', () => {
    render(<LogView lines={make(2000)} />);
    const el = grid();
    fakeBox(el, () => 2000 * 24);
    fireEvent.click(row('l3').firstElementChild as HTMLElement);
    expect(document.activeElement).toBe(el);
    el.scrollTop = 30_000;
    fireEvent.scroll(el);
    expect(row('l3')).toBeTruthy();
    expect(document.getElementById(el.getAttribute('aria-activedescendant') ?? '')).toBe(row('l3'));
  });

  it('moves the next rows when an open detail grows', () => {
    const observers: { cb: () => void; els: Element[] }[] = [];
    vi.stubGlobal(
      'ResizeObserver',
      class {
        els: Element[] = [];
        constructor(public cb: () => void) {
          observers.push(this);
        }
        observe(el: Element) {
          this.els.push(el);
        }
        disconnect() {}
      }
    );
    render(<LogView lines={make(5)} />);
    fireEvent.click(row('l0').firstElementChild as HTMLElement);
    const detail = document.querySelector('[data-slot="log-view-detail"]') as HTMLElement;
    const ro = observers.find((o) => o.els.includes(detail));
    expect(ro).toBeTruthy();
    fireEvent.click(document.querySelector('[data-path="a.b"]') as HTMLElement);
    expect(document.querySelector('[data-path="a.b.c"]')).toBeTruthy();
    Object.defineProperty(detail, 'offsetHeight', { configurable: true, value: 300 });
    act(() => ro?.cb());
    expect(row('l1').style.top).toBe('324px');
    vi.unstubAllGlobals();
  });

  it('counts new lines after the last one seen with a capped buffer and keeps the view still', () => {
    let lines = make(100);
    const view = (filter?: string[]) => <LogView lines={lines} follow={false} filter={filter} />;
    const { rerender } = render(view());
    const el = grid();
    fakeBox(el, () => 100 * 24);
    el.scrollTop = 1000;
    fireEvent.scroll(el);
    lines = make(100, 3);
    rerender(view());
    expect(screen.getByRole('button', { name: '3 new lines' })).toBeTruthy();
    expect(el.scrollTop).toBe(1000 - 3 * 24);
  });

  it('does not inflate the new count when the filter changes while paused', () => {
    let lines = make(100);
    const view = (filter?: string[]) => <LogView lines={lines} follow={false} filter={filter} />;
    const { rerender } = render(view(['error']));
    const el = grid();
    fakeBox(el, () => 10 * 24, 120);
    lines = make(102);
    rerender(view(['error']));
    expect(screen.getByRole('button', { name: '1 new line' })).toBeTruthy();
    rerender(view());
    expect(screen.getByRole('button', { name: '2 new lines' })).toBeTruthy();
  });
});
