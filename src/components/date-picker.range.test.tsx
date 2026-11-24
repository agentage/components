import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker, resolveDateRange, type DateRange } from './date-picker';

const trigger = () => screen.getByRole('button', { name: /^Date range/ });

describe('DatePicker range mode', () => {
  it('applies a preset and shows its label on the 28 px trigger', () => {
    const onValueChange = vi.fn();
    render(<DatePicker mode="range" onValueChange={onValueChange} />);
    expect(trigger().className).toContain('h-7');
    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole('button', { name: 'Last 24 hours' }));
    const range = onValueChange.mock.calls[0][0] as { from: Date; to: Date; label: string };
    expect(range.label).toBe('Last 24 hours');
    expect(range.to.getTime() - range.from.getTime()).toBe(24 * 3_600_000);
    expect(trigger().textContent).toContain('Last 24 hours');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('accepts typed relative input and flags garbage', () => {
    const onValueChange = vi.fn();
    render(<DatePicker mode="range" onValueChange={onValueChange} />);
    fireEvent.click(trigger());
    const field = screen.getByLabelText('Type a range');
    fireEvent.change(field, { target: { value: 'soon' } });
    expect(field.getAttribute('aria-invalid')).toBe('true');
    fireEvent.change(field, { target: { value: '6h' } });
    fireEvent.keyDown(field, { key: 'Enter' });
    expect(onValueChange.mock.calls[0][0].label).toBe('Last 6 hours');
  });

  it('shows the day pair only under Custom', () => {
    const onValueChange = vi.fn();
    render(
      <DatePicker
        mode="range"
        defaultValue={{ from: new Date(2026, 10, 1), to: new Date(2026, 10, 3) }}
        onValueChange={onValueChange}
      />
    );
    fireEvent.click(trigger());
    expect(screen.queryByLabelText('From')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect((screen.getByLabelText('From') as HTMLInputElement).value).toBe('2026-11-01');
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2026-11-05' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    const r = onValueChange.mock.calls[0][0] as { from: Date; to: Date };
    expect(r.from.getDate()).toBe(1);
    expect(r.to.getDate()).toBe(5);
  });
});

describe('DatePicker relative ranges', () => {
  it('keeps a preset relative and shows its own label', () => {
    const onValueChange = vi.fn();
    const presets = [{ value: '24h', label: 'Past day' }];
    render(<DatePicker mode="range" presets={presets} onValueChange={onValueChange} />);
    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole('button', { name: 'Past day' }));
    const range = onValueChange.mock.calls[0][0] as DateRange;
    expect(range.expression).toBe('now-24h');
    const later = new Date(range.to.getTime() + 3_600_000);
    expect(resolveDateRange(range, later).to).toEqual(later);
    expect(trigger().textContent).toContain('Past day');
    fireEvent.click(trigger());
    expect(screen.getByRole('button', { name: 'Past day' }).getAttribute('aria-pressed')).toBe(
      'true'
    );
  });

  it('keeps typed now-6h relative and an absolute pick without an expression', () => {
    const onValueChange = vi.fn();
    render(<DatePicker mode="range" onValueChange={onValueChange} />);
    fireEvent.click(trigger());
    const field = screen.getByLabelText('Type a range');
    fireEvent.change(field, { target: { value: 'now-6h' } });
    fireEvent.keyDown(field, { key: 'Enter' });
    expect(onValueChange.mock.calls[0][0].expression).toBe('now-6h');
    fireEvent.click(trigger());
    fireEvent.change(screen.getByLabelText('Type a range'), {
      target: { value: '2026-11-01 to 2026-11-03' },
    });
    fireEvent.keyDown(screen.getByLabelText('Type a range'), { key: 'Enter' });
    expect(onValueChange.mock.calls[1][0].expression).toBeUndefined();
  });
});

describe('DatePicker single mode', () => {
  it('shows an uncontrolled defaultValue', () => {
    render(<DatePicker defaultValue={new Date(2026, 0, 15, 12)} />);
    expect(screen.getByRole('button').textContent).toMatch(/15/);
  });
});
