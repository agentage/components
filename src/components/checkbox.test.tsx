import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('exposes the button through a forwarded ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} aria-label="Accept terms" />);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
  });

  it('passes through name, id and aria-label', () => {
    const { container } = render(<Checkbox id="terms" name="terms" aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' }).id).toBe('terms');
    expect(container.querySelector('input[type="checkbox"]')?.getAttribute('name')).toBe('terms');
  });

  it('reports the mixed state and sets indeterminate on the native input', () => {
    const { container } = render(<Checkbox name="all" indeterminate aria-label="Select all" />);
    expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('mixed');
    expect(container.querySelector<HTMLInputElement>('input[type="checkbox"]')?.indeterminate).toBe(
      true
    );
  });

  it('toggles on click and on Space', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Toggle" onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole('checkbox');
    fireEvent.click(box);
    fireEvent.keyDown(box, { key: ' ' });
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('stays inert when disabled', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Toggle" disabled onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('omits the native input when no name is given', () => {
    const { container } = render(<Checkbox aria-label="Toggle" />);
    expect(container.querySelector('input')).toBeNull();
  });
});

describe('Checkbox classes', () => {
  it('renders the unchecked box with a focus ring and a muted border', () => {
    render(<Checkbox aria-label="Toggle" />);
    const cls = screen.getByRole('checkbox').className;
    expect(cls).toContain('size-4');
    expect(cls).toContain('focus-ring');
    expect(cls).toContain('border-muted-foreground/50');
    expect(cls).not.toContain('bg-primary');
  });

  it('renders the checked, disabled box and merges className last', () => {
    render(<Checkbox aria-label="Toggle" checked disabled className="mt-4" />);
    const cls = screen.getByRole('checkbox').className;
    expect(cls).toContain('bg-primary');
    expect(cls).toContain('opacity-50');
    expect(cls).toContain('cursor-not-allowed');
    expect(cls.endsWith('mt-4')).toBe(true);
  });

  it('marks the control invalid and swaps the resting border on error', () => {
    render(<Checkbox aria-label="Toggle" error />);
    const box = screen.getByRole('checkbox');
    expect(box.getAttribute('aria-invalid')).toBe('true');
    expect(box.className).toContain('border-destructive');
    expect(box.className).not.toContain('border-muted-foreground/50');
  });

  it('leaves the resting border untouched when error is false', () => {
    render(<Checkbox aria-label="Toggle" error={false} />);
    const box = screen.getByRole('checkbox');
    expect(box.getAttribute('aria-invalid')).toBeNull();
    expect(box.className).toContain('border-muted-foreground/50');
    expect(box.className).not.toContain('border-destructive');
  });

  it('spreads unknown props onto the button', () => {
    render(<Checkbox aria-label="Toggle" data-testid="cb" />);
    expect(screen.getByTestId('cb')).toBe(screen.getByRole('checkbox'));
  });
});

describe('Checkbox size', () => {
  it('sm is a 13 px box with a 3 px radius', () => {
    render(<Checkbox aria-label="Toggle" size="sm" checked />);
    const cls = screen.getByRole('checkbox').className;
    expect(cls).toContain('size-[13px]');
    expect(cls).toContain('rounded-[3px]');
    expect(cls).not.toMatch(/(^| )size-4( |$)/);
  });
});
