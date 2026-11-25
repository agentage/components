import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './switch';

describe('Switch', () => {
  it('exposes the button through a forwarded ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} aria-label="Notifications" />);
    expect(ref.current).toBe(screen.getByRole('switch'));
  });

  it('reports its checked state', () => {
    render(<Switch checked aria-label="Notifications" />);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
  });

  it('toggles on click, Space and Enter', () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Notifications" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch');
    fireEvent.click(control);
    fireEvent.keyDown(control, { key: ' ' });
    fireEvent.keyDown(control, { key: 'Enter' });
    expect(onCheckedChange).toHaveBeenCalledTimes(3);
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
  });

  it('stays inert when disabled', () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Notifications" disabled onCheckedChange={onCheckedChange} />);
    fireEvent.keyDown(screen.getByRole('switch'), { key: ' ' });
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

const thumb = (): HTMLElement => document.querySelector('[data-slot="switch"] span') as HTMLElement;

describe('Switch sizes and states', () => {
  it('defaults to the 30x18 track with a 12 px thumb', () => {
    render(<Switch aria-label="Notifications" />);
    expect(screen.getByRole('switch').className).toContain('h-4.5 w-7.5');
    expect(thumb().className).toContain('size-3');
    expect(thumb().className).toContain('translate-x-0');
  });

  it('moves the thumb by 12 px when on', () => {
    render(<Switch aria-label="Notifications" checked />);
    expect(thumb().className).toContain('translate-x-3');
  });

  it('renders the small 24x14 size with a 10 px thumb', () => {
    render(<Switch aria-label="Notifications" size="sm" checked />);
    expect(screen.getByRole('switch').className).toContain('h-3.5 w-6');
    expect(thumb().className).toContain('size-2.5');
    expect(thumb().className).toContain('translate-x-2.5');
  });

  it('keeps disabled styles and a caller className', () => {
    render(<Switch aria-label="Notifications" disabled className="mt-4" />);
    const control = screen.getByRole('switch');
    expect(control.className).toContain('cursor-not-allowed opacity-50');
    expect(control.className).toContain('mt-4');
  });

  it('marks the control invalid with a destructive edge on error', () => {
    render(<Switch aria-label="Notifications" error />);
    const control = screen.getByRole('switch');
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(control.className).toContain('border-destructive');
  });

  it('spreads unknown props onto the button', () => {
    render(<Switch aria-label="Notifications" data-testid="sw" id="notify" />);
    expect(screen.getByTestId('sw')).toBe(screen.getByRole('switch'));
    expect(screen.getByRole('switch').id).toBe('notify');
  });
});
