import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './slider';

const thumb = (): HTMLElement =>
  document.querySelector('[data-slot="slider-thumb"]') as HTMLElement;

describe('Slider', () => {
  it('exposes the slider contract', () => {
    render(<Slider aria-label="Volume" defaultValue={30} min={10} max={50} />);
    const el = screen.getByRole('slider', { name: 'Volume' });
    expect(el.getAttribute('aria-valuenow')).toBe('30');
    expect(el.getAttribute('aria-valuemin')).toBe('10');
    expect(el.getAttribute('aria-valuemax')).toBe('50');
  });

  it('moves with arrows, Home, End and PageUp when uncontrolled', async () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={50} step={5} onValueChange={onValueChange} />);
    const el = screen.getByRole('slider');
    el.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(el.getAttribute('aria-valuenow')).toBe('55');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(el.getAttribute('aria-valuenow')).toBe('45');
    await userEvent.keyboard('{PageUp}');
    expect(el.getAttribute('aria-valuenow')).toBe('95');
    await userEvent.keyboard('{PageUp}');
    expect(el.getAttribute('aria-valuenow')).toBe('100');
    await userEvent.keyboard('{Home}');
    expect(el.getAttribute('aria-valuenow')).toBe('0');
    await userEvent.keyboard('{End}');
    expect(el.getAttribute('aria-valuenow')).toBe('100');
    expect(onValueChange).toHaveBeenLastCalledWith(100);
  });

  it('only reports in controlled mode until the parent updates the value', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Slider aria-label="Volume" value={20} onValueChange={onValueChange} />
    );
    const el = screen.getByRole('slider');
    el.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith(21);
    expect(el.getAttribute('aria-valuenow')).toBe('20');
    rerender(<Slider aria-label="Volume" value={21} onValueChange={onValueChange} />);
    expect(el.getAttribute('aria-valuenow')).toBe('21');
  });

  it('ignores keys when disabled and is not tabbable', async () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" disabled defaultValue={5} onValueChange={onValueChange} />);
    const el = screen.getByRole('slider');
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.tabIndex).toBe(-1);
    fireEvent.keyDown(el, { key: 'ArrowRight' });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(el.getAttribute('aria-valuenow')).toBe('5');
  });

  it('anchors steps to min and removes float noise', async () => {
    render(<Slider aria-label="Gain" defaultValue={0.1} min={0.1} max={1} step={0.1} />);
    const el = screen.getByRole('slider');
    el.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(el.getAttribute('aria-valuenow')).toBe('0.3');
  });

  it('does not render NaN when max equals min', () => {
    render(<Slider aria-label="Fixed" min={5} max={5} defaultValue={5} />);
    expect(thumb().style.left).not.toContain('NaN');
  });

  it('marks the control invalid on error', () => {
    render(<Slider aria-label="Volume" error />);
    expect(screen.getByRole('slider').getAttribute('aria-invalid')).toBe('true');
  });

  it('spreads unknown props onto the root and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Slider ref={ref} aria-label="Volume" data-testid="sl" id="vol" />);
    expect(screen.getByTestId('sl')).toBe(screen.getByRole('slider'));
    expect(ref.current).toBe(screen.getByRole('slider'));
    expect(screen.getByRole('slider').id).toBe('vol');
  });

  it('drags on a step grid anchored at min and still reaches an off-grid max', () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Level" min={3} max={30} step={5} onValueChange={onValueChange} />);
    const el = screen.getByRole('slider');
    el.getBoundingClientRect = () => ({ left: 0, width: 270 }) as DOMRect;
    // 20 % of 3..30 is 8.4, which snaps to 8 on the 3, 8, 13 grid (not to 10).
    fireEvent.pointerDown(el, { clientX: 54, pointerId: 1 });
    expect(el.getAttribute('aria-valuenow')).toBe('8');
    expect(document.activeElement).toBe(el);
    fireEvent.pointerMove(el, { clientX: 230, pointerId: 1 });
    expect(el.getAttribute('aria-valuenow')).toBe('28');
    fireEvent.pointerMove(el, { clientX: 500, pointerId: 1 });
    expect(el.getAttribute('aria-valuenow')).toBe('30');
    fireEvent.pointerUp(el, { pointerId: 1 });
    fireEvent.pointerMove(el, { clientX: 0, pointerId: 1 });
    expect(el.getAttribute('aria-valuenow')).toBe('30');
    expect(onValueChange).toHaveBeenLastCalledWith(30);
    fireEvent.keyDown(el, { key: 'ArrowLeft' });
    expect(el.getAttribute('aria-valuenow')).toBe('23');
  });

  it('ignores pointer input when disabled', () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Level" disabled onValueChange={onValueChange} />);
    const el = screen.getByRole('slider');
    el.getBoundingClientRect = () => ({ left: 0, width: 100 }) as DOMRect;
    fireEvent.pointerDown(el, { clientX: 50, pointerId: 1 });
    fireEvent.pointerMove(el, { clientX: 80, pointerId: 1 });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
