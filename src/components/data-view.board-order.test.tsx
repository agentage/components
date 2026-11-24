import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useKeepFocus } from '../lib/use-keep-focus';
import { DataView, type DataViewColumn } from './data-view';

interface Item {
  id: string;
  title: string;
  status: string;
}

const COLUMNS: DataViewColumn<Item>[] = [
  { key: 'title', header: 'Title', cardSlot: 'title' },
  { key: 'status', header: 'Status', groupable: true, groupOrder: ['todo', 'doing', 'done'] },
];

const Board = ({ rows }: { rows: Item[] }) => (
  <DataView
    rows={rows}
    columns={COLUMNS}
    getRowId={(r) => r.id}
    views={['board']}
    defaultGroupBy="status"
  />
);

const order = () =>
  [...document.querySelectorAll('[data-slot="board-card"]')].map((c) =>
    c.getAttribute('data-drag-id')
  );

describe('BoardView DOM order', () => {
  const rows: Item[] = [
    { id: 'C', title: 'C', status: 'done' },
    { id: 'A', title: 'A', status: 'doing' },
    { id: 'B', title: 'B', status: 'todo' },
    { id: 'D', title: 'D', status: 'todo' },
  ];

  it('follows the columns, then the position, not the data order', () => {
    render(<Board rows={rows} />);
    expect(order()).toEqual(['B', 'D', 'A', 'C']);
  });

  it('keeps the card node when it moves to another column', () => {
    const { rerender } = render(<Board rows={rows} />);
    const before = document.querySelector('[data-drag-id="C"]');
    rerender(<Board rows={rows.map((r) => (r.id === 'C' ? { ...r, status: 'todo' } : r))} />);
    expect(order()).toEqual(['C', 'B', 'D', 'A']);
    expect(document.querySelector('[data-drag-id="C"]')).toBe(before);
  });
});

const Probe = ({ n }: { n: number }) => {
  const root = React.useRef<HTMLDivElement>(null);
  useKeepFocus(root);
  return (
    <div ref={root}>
      <button type="button">Card {n}</button>
    </div>
  );
};

describe('useKeepFocus', () => {
  it('refocuses an element blurred by the same commit, not after a real blur', async () => {
    const { rerender } = render(<Probe n={1} />);
    const button = screen.getByRole('button');
    button.focus();
    button.blur();
    rerender(<Probe n={2} />);
    expect(document.activeElement).toBe(button);
    button.blur();
    await Promise.resolve();
    rerender(<Probe n={3} />);
    expect(document.activeElement).toBe(document.body);
  });
});
