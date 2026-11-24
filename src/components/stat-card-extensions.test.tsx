import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MiniBars, Sparkline, StatComparison } from './stat-card-extensions';

describe('StatComparison', () => {
  it('shows new when the previous value is zero', () => {
    const { container } = render(<StatComparison current={5} previous={0} />);
    expect(container.textContent).toContain('new');
    expect(container.textContent).not.toContain('0.0%');
  });

  it('reads a drop as Down with a positive percentage', () => {
    const { container } = render(<StatComparison current={88} previous={100} />);
    expect(screen.getByText('Down')).toBeTruthy();
    expect(container.textContent).toContain('12.0%');
    expect(container.textContent).not.toContain('-12.0%');
  });
});

describe('MiniBars', () => {
  it('never gives a bar a negative height', () => {
    const { container } = render(<MiniBars data={[-4, 2, 6]} />);
    const heights = Array.from(container.querySelectorAll('rect')).map((r) =>
      Number(r.getAttribute('height'))
    );
    expect(heights).toHaveLength(3);
    expect(heights.every((h) => h >= 0)).toBe(true);
    expect(heights[0]).toBe(0);
  });
});

describe('Sparkline dots', () => {
  it('draws min, max and last dots in screen units, so a wide card never stretches them', () => {
    const { container } = render(<Sparkline data={[2, 9, 1, 4]} showMinMax showLastDot />);
    const dots = Array.from(container.querySelectorAll('[data-slot="sparkline-dot"]'));
    expect(dots).toHaveLength(3);
    expect(container.querySelector('circle')).toBeNull();
    for (const d of dots) {
      expect(d.getAttribute('vector-effect')).toBe('non-scaling-stroke');
      expect(d.getAttribute('stroke-linecap')).toBe('round');
    }
    expect(container.querySelector('polyline')?.getAttribute('vector-effect')).toBe(
      'non-scaling-stroke'
    );
  });
});
