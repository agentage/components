import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UsageMeter } from './usage-meter';

const meter = (): HTMLElement => screen.getByRole('meter');

describe('UsageMeter (deprecated preset over Progress)', () => {
  it('names the meter through the label row and exposes the value range', () => {
    render(<UsageMeter label="Storage" value={17} max={100} />);
    expect(screen.getByRole('meter', { name: 'Storage' })).toBe(meter());
    expect(meter().getAttribute('aria-valuenow')).toBe('17');
    expect(meter().getAttribute('aria-valuemax')).toBe('100');
    expect(meter().getAttribute('aria-valuetext')).toBe('17 / 100');
    expect(screen.getByText('17 / 100')).toBeTruthy();
  });

  it('adds the level to the value text past the thresholds', () => {
    const { rerender } = render(<UsageMeter label="Storage" value={85} max={100} />);
    expect(meter().getAttribute('aria-valuetext')).toBe('85 / 100, warning');
    rerender(<UsageMeter label="Reports" value={55} max={100} thresholds={{ warning: 0.5 }} />);
    expect(meter().getAttribute('aria-valuetext')).toBe('55 / 100, warning');
    rerender(<UsageMeter label="Storage" value={96} max={100} />);
    expect(meter().getAttribute('aria-valuetext')).toBe('96 / 100, critical');
  });

  it('formats the value and clamps aria-valuenow to max', () => {
    render(
      <UsageMeter
        label="Storage"
        value={120}
        max={100}
        formatValue={(v, m) => `${String(v)} MB of ${String(m)} MB`}
      />
    );
    expect(screen.getByText('120 MB of 100 MB')).toBeTruthy();
    expect(meter().getAttribute('aria-valuenow')).toBe('100');
    expect(meter().getAttribute('aria-valuetext')).toBe('120 MB of 100 MB, critical');
  });

  it('hides the value when showValue is false and forwards ref plus className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <UsageMeter ref={ref} label="Storage" value={1} max={10} showValue={false} className="mt-4" />
    );
    expect(screen.queryByText('1 / 10')).toBeNull();
    expect(ref.current?.contains(meter())).toBe(true);
    expect(ref.current?.dataset.slot).toBe('usage-meter');
  });

  it('treats a zero max as empty rather than dividing by zero', () => {
    render(<UsageMeter label="Storage" value={5} max={0} />);
    expect(meter().getAttribute('aria-valuetext')).toBe('5 / 0');
  });
});
