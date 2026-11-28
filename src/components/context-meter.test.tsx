import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContextMeter, meterTone } from './context-meter';

describe('ContextMeter', () => {
  it('is a meter named with its percent', () => {
    render(<ContextMeter value={150} max={200} size="md" />);
    const meter = screen.getByRole('meter', { name: 'Context window 75%' });
    expect(meter.getAttribute('aria-valuenow')).toBe('75');
    expect(meter.className).toContain('text-warning');
    expect(meter.querySelector('svg')?.getAttribute('width')).toBe('64');
  });

  it('turns neutral, warning and danger at 75 and 90 percent', () => {
    expect(meterTone(74)).toBe('text-muted-foreground');
    expect(meterTone(75)).toBe('text-warning');
    expect(meterTone(90)).toBe('text-destructive');
  });

  it('clamps the value and draws no arc at zero', () => {
    const { rerender } = render(<ContextMeter value={-5} label="Budget" />);
    const meter = screen.getByRole('meter', { name: 'Budget 0%' });
    expect(meter.querySelectorAll('circle')).toHaveLength(1);
    rerender(<ContextMeter value={400} label="Budget" />);
    expect(screen.getByRole('meter', { name: 'Budget 100%' }).className).toContain(
      'text-destructive'
    );
  });

  it('counts a non-finite value as zero', () => {
    render(<ContextMeter value={Number.NaN} />);
    const meter = screen.getByRole('meter', { name: 'Context window 0%' });
    expect(meter.getAttribute('aria-valuenow')).toBe('0');
  });
});
