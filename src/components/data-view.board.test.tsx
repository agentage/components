import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { keyMove } from '../lib/drag-reorder';
import { DataView, type DataViewColumn } from './data-view';

interface Item {
  id: string;
  title: string;
  status: string;
  team: string;
}

const ITEMS: Item[] = [
  { id: 'a', title: 'Alpha', status: 'todo', team: 'Core' },
  { id: 'b', title: 'Bravo', status: 'todo', team: 'Web' },
  { id: 'c', title: 'Charlie', status: 'doing', team: 'Core' },
];

const COLUMNS: DataViewColumn<Item>[] = [
  { key: 'title', header: 'Title' },
  { key: 'status', header: 'Status', groupable: true, groupOrder: ['todo', 'doing', 'done'] },
  { key: 'team', header: 'Team', groupable: true },
];

const Board = (props: { rows?: Item[]; onMove?: (m: unknown) => void; rowsBy?: string }) => (
  <DataView
    rows={props.rows ?? ITEMS}
    columns={COLUMNS}
    getRowId={(r) => r.id}
    views={['board']}
    defaultGroupBy="status"
    renderCard={(r) => <div data-card={r.id}>{r.title}</div>}
    onMove={props.onMove}
    rowsBy={props.rowsBy}
  />
);

const card = (id: string) => document.querySelector(`[data-drag-id="${id}"]`) as HTMLElement;
const col = (key: string) => document.querySelector(`[data-drop-group="${key}"]`) as HTMLElement;

/** jsdom has no layout: columns 300 px wide from x 0, cards 60 px tall from y 40. */
const layoutRects = () => {
  const rect = (left: number, top: number, width: number, height: number) =>
    ({
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
    }) as DOMRect;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement
  ) {
    const group = this.dataset.dropGroup;
    if (group) return rect(['todo', 'doing', 'done'].indexOf(group) * 300, 32, 280, 600);
    const id = this.dataset.dragId;
    if (id) {
      const order: Record<string, [number, number]> = { a: [0, 0], b: [0, 1], c: [1, 0] };
      const [c, i] = order[id] ?? [0, 0];
      return rect(c * 300 + 8, 40 + i * 70, 264, 60);
    }
    return rect(0, 0, 0, 0);
  });
};

describe('DataView board', () => {
  beforeEach(() =>
    vi.useFakeTimers({ toFake: ['setTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
  );
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('lays out columns by group, collapses empty ones and keeps one grid parent', () => {
    render(<Board />);
    expect(screen.getByRole('heading', { name: /todo/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'done, 0, expand column' })).toBeTruthy();
    expect(card('a').parentElement).toBe(card('c').parentElement);
    expect(card('a').style.gridColumn).toBe('1');
    expect(card('c').style.gridColumn).toBe('2');
  });

  it('opens a folded empty column from its strip and labels the empty lane', () => {
    render(
      <Board
        rowsBy="team"
        rows={[...ITEMS, { id: 'd', title: 'Delta', status: 'todo', team: '' }]}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'done, 0, expand column' }));
    expect(screen.getByRole('heading', { name: /done/ })).toBeTruthy();
    const lanes = Array.from(document.querySelectorAll('[data-slot="board-lane"]'));
    expect(lanes.map((l) => l.textContent)).toContain('None1');
  });

  it('moves a card by pointer with a 5 px threshold and reports the move', () => {
    layoutRects();
    const onMove = vi.fn();
    render(<Board onMove={onMove} />);
    const a = card('a');
    fireEvent.pointerDown(a, { button: 0, clientX: 20, clientY: 50 });
    fireEvent.pointerMove(window, { clientX: 22, clientY: 51 });
    expect(document.querySelector('[data-slot="drag-ghost"]')).toBeNull();
    fireEvent.pointerMove(window, { clientX: 320, clientY: 120 });
    act(() => vi.advanceTimersToNextFrame());
    expect(document.querySelector('[data-slot="drag-ghost"]')).toBeTruthy();
    expect(a.dataset.dragging).toBe('true');
    expect(document.querySelector('[data-slot="board-drop-line"]')).toBeTruthy();
    fireEvent.pointerUp(window, { clientX: 320, clientY: 120 });
    expect(onMove).toHaveBeenCalledWith({
      id: 'a',
      toGroup: 'doing',
      toIndex: 1,
      toRow: undefined,
    });
    expect(document.querySelector('[data-slot="drag-ghost"]')).toBeNull();
  });

  it('keeps the DOM node of a card that moves to another column', () => {
    const { rerender } = render(<Board />);
    const node = card('a');
    rerender(<Board rows={[{ ...ITEMS[0], status: 'doing' }, ITEMS[1], ITEMS[2]]} />);
    expect(card('a')).toBe(node);
    expect(node.style.gridColumn).toBe('2');
  });

  it('moves with Alt + arrows and announces the new place', () => {
    vi.useRealTimers();
    vi.useFakeTimers();
    const onMove = vi.fn();
    render(<Board onMove={onMove} />);
    fireEvent.keyDown(screen.getByText('Bravo'), { key: 'ArrowRight', altKey: true });
    expect(onMove).toHaveBeenCalledWith({
      id: 'b',
      toGroup: 'doing',
      toIndex: 1,
      toRow: undefined,
    });
    act(() => vi.advanceTimersByTime(100));
    const region = document.querySelector('[data-ds-announcer="polite"]');
    expect(region?.textContent).toBe('Moved to doing, position 2 of 2');
    fireEvent.keyDown(screen.getByText('Bravo'), { key: 'ArrowUp', altKey: true });
    expect(onMove).toHaveBeenLastCalledWith({
      id: 'b',
      toGroup: 'todo',
      toIndex: 0,
      toRow: undefined,
    });
  });

  it('adds swimlanes by a second column', () => {
    render(<Board rowsBy="team" />);
    const lanes = document.querySelectorAll('[data-slot="board-lane"]');
    expect(Array.from(lanes).map((l) => l.textContent)).toEqual(['Core2', 'Web1']);
    expect(col('todo')).toBeTruthy();
    expect(document.querySelectorAll('[data-drop-group="todo"]')).toHaveLength(2);
  });

  it('keyMove stays inside the edges', () => {
    const groups = [
      { key: 'x', ids: ['1', '2'] },
      { key: 'y', ids: [] },
    ];
    expect(keyMove(groups, '1', 'ArrowUp')).toBeNull();
    expect(keyMove(groups, '2', 'ArrowRight')?.move).toEqual({
      id: '2',
      toGroup: 'y',
      toRow: undefined,
      toIndex: 0,
    });
    expect(keyMove(groups, '1', 'ArrowLeft')).toBeNull();
    expect(keyMove(groups, 'z', 'ArrowDown')).toBeNull();
  });
});
