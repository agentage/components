import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StatusBar, type StatusBarCell } from './status-bar';

const CELLS: StatusBarCell[] = [
  { tone: 'success', label: 'Day 1, up' },
  { tone: 'warning', label: 'Day 2, degraded', title: 'Degraded for 12 min' },
  { tone: 'destructive', label: 'Day 3, down' },
  { tone: 'empty', label: 'Day 4, no data' },
];

const ticks = () => screen.getAllByRole('img');

describe('StatusBar', () => {
  it('is a labelled group of named ticks with name and summary', () => {
    render(<StatusBar label="Last 4 days" cells={CELLS} name="API" summary="99.98 percent" />);
    expect(screen.getByRole('group', { name: 'Last 4 days' })).toBeTruthy();
    expect(ticks().map((t) => t.getAttribute('aria-label'))).toEqual(CELLS.map((c) => c.label));
    expect(screen.getByText('API')).toBeTruthy();
    expect(screen.getByText('99.98 percent')).toBeTruthy();
  });

  // jsdom has no layout: the shape contract (half height, a top gap) is checked by its classes.
  it.each(['sm', 'md'] as const)('codes non-ok ticks by shape at size %s', (size) => {
    render(<StatusBar label="Days" cells={CELLS} size={size} />);
    const [ok, degraded, down] = ticks();
    expect(ok?.className).toContain('h-full');
    expect(degraded?.className).toContain('h-1/2');
    expect(down?.className).toContain('h-full');
    expect(down?.className).toMatch(
      /mask-image:linear-gradient\(to_bottom,#000_0_\d+px,transparent/
    );
    expect(ok?.className).toContain('rounded-[2px]');
  });

  it('keeps the tooltip on the same cell when a new cell arrives in a full window', () => {
    const days = (n: number): StatusBarCell[] =>
      Array.from({ length: n }, (_, i) => ({
        id: `d${String(i)}`,
        tone: 'success',
        label: `Day ${String(i)}`,
      }));
    const { rerender } = render(<StatusBar label="Days" cells={days(3)} slots={3} />);
    const tick = screen.getByRole('img', { name: 'Day 2' });
    fireEvent.pointerEnter(tick);
    rerender(<StatusBar label="Days" cells={days(4)} slots={3} />);
    expect(screen.getByRole('img', { name: 'Day 2' })).toBe(tick);
    expect(screen.getByRole('tooltip').textContent).toBe('Day 2');
  });

  it('slots 0 shows no ticks', () => {
    render(<StatusBar label="Days" cells={CELLS} slots={0} />);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  it('moves between ticks with the arrow keys and shows the tooltip on focus', () => {
    render(<StatusBar label="Days" cells={CELLS} />);
    const [first, second] = ticks();
    expect(first?.tabIndex).toBe(0);
    expect(second?.tabIndex).toBe(-1);
    act(() => first?.focus());
    expect(screen.getByRole('tooltip').textContent).toBe('Day 1, up');
    fireEvent.keyDown(first as HTMLElement, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(second);
    expect(screen.getByRole('tooltip').textContent).toBe('Degraded for 12 min');
    expect(second?.getAttribute('aria-describedby')).toBe(screen.getByRole('tooltip').id);
    fireEvent.keyDown(second as HTMLElement, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('shows the tooltip on hover and hides it on leave', () => {
    render(<StatusBar label="Days" cells={CELLS} />);
    const down = ticks()[2] as HTMLElement;
    fireEvent.pointerEnter(down);
    expect(screen.getByRole('tooltip').textContent).toBe('Day 3, down');
    fireEvent.pointerLeave(down);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('pads to slots, keeps the newest cells and renders clickable ticks as buttons', () => {
    const onClick = vi.fn();
    const { container, rerender } = render(<StatusBar label="Days" cells={CELLS} slots={6} />);
    const track = container.querySelector('[data-slot="status-bar-track"]') as HTMLElement;
    expect(track.children).toHaveLength(6);
    expect(track.children[0]?.getAttribute('aria-hidden')).toBe('true');
    rerender(
      <StatusBar
        label="Days"
        size="sm"
        slots={2}
        cells={[...CELLS, { tone: 'primary', label: 'Now', onClick }]}
      />
    );
    expect(ticks().map((t) => t.getAttribute('aria-label'))).toEqual(['Day 4, no data']);
    fireEvent.click(screen.getByRole('button', { name: 'Now' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
