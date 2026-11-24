import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DataView, type DataViewColumn } from './data-view';

interface Item {
  id: string;
  title: string;
  status: string;
  who: string;
  tag: string;
}

const ITEMS: Item[] = [
  { id: 'A-1', title: 'Alpha with a long title that wraps', status: 'todo', who: 'ana', tag: 'x' },
  { id: 'A-2', title: 'Bravo', status: 'todo', who: 'ben', tag: 'y' },
  { id: 'A-3', title: 'Charlie', status: 'doing', who: 'ana', tag: 'x' },
];

const COLUMNS: DataViewColumn<Item>[] = [
  { key: 'id', header: 'ID', cardSlot: 'id' },
  { key: 'title', header: 'Title', cardSlot: 'title' },
  { key: 'status', header: 'Status', groupable: true, groupOrder: ['todo', 'doing', 'done'] },
  { key: 'who', header: 'Who', cardSlot: 'end' },
  {
    key: 'tag',
    header: 'Tag',
    cardSlot: 'chip',
    cell: (r) => <span id={`tag-${r.id}`}>{r.tag}</span>,
  },
];

const Board = (p: { rows?: Item[]; onMove?: (m: unknown) => void; onOpen?: (r: Item) => void }) => (
  <DataView
    rows={p.rows ?? ITEMS}
    columns={COLUMNS}
    getRowId={(r) => r.id}
    views={['board']}
    defaultState={{ groupBy: 'status' }}
    actions={{ move: p.onMove, open: p.onOpen }}
  />
);

const card = (id: string) => document.querySelector(`[data-drag-id="${id}"]`) as HTMLElement;
const ghost = () => document.querySelector('[data-slot="drag-ghost"]');

const startDrag = (id: string) => {
  fireEvent.pointerDown(card(id), { button: 0, clientX: 10, clientY: 10 });
  fireEvent.pointerMove(window, { clientX: 60, clientY: 60 });
  act(() => vi.advanceTimersToNextFrame());
};

describe('DataView board drag and card', () => {
  beforeEach(() =>
    vi.useFakeTimers({ toFake: ['setTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
  );
  afterEach(() => {
    // Flushes the one-shot click swallow that ends a drag.
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the compact card from column slots and opens it on click', () => {
    const onOpen = vi.fn();
    render(<Board onOpen={onOpen} />);
    const body = card('A-1');
    expect(body.querySelector('[data-slot="board-card-head"]')?.textContent).toBe('A-1ana');
    expect(body.querySelector('[data-slot="board-card-chips"]')?.textContent).toBe('x');
    fireEvent.click(screen.getByRole('button', { name: 'Alpha with a long title that wraps' }));
    expect(onOpen).toHaveBeenCalledWith(ITEMS[0]);
    expect(body.getAttribute('aria-label')).toBe('todo, 1 of 2');
  });

  it.each([
    ['Escape', () => fireEvent.keyDown(window, { key: 'Escape' })],
    ['pointercancel', () => fireEvent.pointerCancel(window)],
    ['window blur', () => fireEvent.blur(window)],
  ])('%s cancels a drag and cleans up', (_name, cancel) => {
    const onMove = vi.fn();
    render(<Board onMove={onMove} />);
    startDrag('A-1');
    expect(ghost()).toBeTruthy();
    expect(document.body.style.userSelect).toBe('none');
    cancel();
    expect(ghost()).toBeNull();
    expect(document.body.style.userSelect).toBe('');
    fireEvent.pointerUp(window, { clientX: 60, clientY: 60 });
    expect(onMove).not.toHaveBeenCalled();
  });

  it('a second pointer ends the drag with no move; its own pointerup is not a drop', () => {
    const onMove = vi.fn();
    render(<Board onMove={onMove} />);
    fireEvent.pointerDown(card('A-1'), { button: 0, pointerId: 1, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 60, clientY: 60 });
    act(() => vi.advanceTimersToNextFrame());
    expect(ghost()).toBeTruthy();
    fireEvent.pointerDown(card('A-2'), { button: 0, pointerId: 2, clientX: 20, clientY: 20 });
    expect(ghost()).toBeNull();
    expect(document.body.style.userSelect).toBe('');
    fireEvent.pointerUp(window, { pointerId: 1, clientX: 60, clientY: 60 });
    expect(onMove).not.toHaveBeenCalled();
  });

  it('moves and releases of another pointer are ignored', () => {
    const onMove = vi.fn();
    render(<Board onMove={onMove} />);
    fireEvent.pointerDown(card('A-1'), { button: 0, pointerId: 1, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(window, { pointerId: 7, clientX: 60, clientY: 60 });
    expect(ghost()).toBeNull();
    fireEvent.pointerUp(window, { pointerId: 7, clientX: 60, clientY: 60 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 60, clientY: 60 });
    expect(ghost()).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
  });

  it('cleans up when the board unmounts mid-drag', () => {
    const onMove = vi.fn();
    const { unmount } = render(<Board onMove={onMove} />);
    startDrag('A-2');
    unmount();
    expect(ghost()).toBeNull();
    expect(document.body.style.userSelect).toBe('');
    fireEvent.pointerUp(window, { clientX: 60, clientY: 60 });
    expect(onMove).not.toHaveBeenCalled();
  });

  it('keeps ids unique while dragging', () => {
    render(<Board onMove={vi.fn()} />);
    startDrag('A-1');
    expect(document.querySelectorAll('#tag-A-1')).toHaveLength(1);
    fireEvent.keyDown(window, { key: 'Escape' });
  });

  it('Alt + arrow at the edge is swallowed, so the browser never goes back', () => {
    const onMove = vi.fn();
    render(<Board onMove={onMove} />);
    const ev = new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
      altKey: true,
      bubbles: true,
      cancelable: true,
    });
    card('A-1').dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(onMove).not.toHaveBeenCalled();
  });

  it('keeps focus on the moved card after Alt + arrow', () => {
    const Live = () => {
      const [rows, setRows] = React.useState(ITEMS);
      return (
        <Board
          rows={rows}
          onOpen={() => undefined}
          onMove={(m) => {
            const move = m as { id: string; toGroup: string };
            setRows((l) => l.map((r) => (r.id === move.id ? { ...r, status: move.toGroup } : r)));
          }}
        />
      );
    };
    render(<Live />);
    const open = screen.getByRole('button', { name: 'Bravo' });
    open.focus();
    fireEvent.keyDown(open, { key: 'ArrowRight', altKey: true });
    act(() => vi.advanceTimersToNextFrame());
    expect(card('A-2').style.gridColumn).toBe('2');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Bravo' }));
  });

  it('an opened empty column stays open after a card lands in it', () => {
    const { rerender } = render(<Board />);
    fireEvent.click(screen.getByRole('button', { name: 'done, 0, expand column' }));
    expect(screen.getByRole('heading', { name: /done/ })).toBeTruthy();
    rerender(<Board rows={[...ITEMS.slice(0, 2), { ...ITEMS[2], status: 'done' }]} />);
    expect(screen.getByRole('heading', { name: /done/ })).toBeTruthy();
    expect(card('A-3').classList.contains('hidden')).toBe(false);
  });

  it('touch: a quick swipe scrolls, a long press drags', () => {
    render(<Board onMove={vi.fn()} />);
    const touch = { button: 0, pointerType: 'touch', clientX: 10, clientY: 10 };
    fireEvent.pointerDown(card('A-1'), touch);
    fireEvent.pointerMove(window, { clientX: 10, clientY: 60 });
    expect(ghost()).toBeNull();
    fireEvent.pointerDown(card('A-1'), touch);
    act(() => vi.advanceTimersByTime(350));
    fireEvent.pointerMove(window, { clientX: 10, clientY: 60 });
    expect(ghost()).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
  });
});
