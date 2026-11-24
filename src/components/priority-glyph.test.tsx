import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PriorityGlyph } from './priority-glyph';

const lit = (el: Element) =>
  Array.from(el.querySelectorAll('rect')).filter((r) => r.getAttribute('opacity') === '1').length;

describe('PriorityGlyph', () => {
  it('lights 3, 2 and 1 bars for high, medium and low', () => {
    const { container } = render(
      <>
        <PriorityGlyph priority="high" />
        <PriorityGlyph priority="medium" />
        <PriorityGlyph priority="low" />
      </>
    );
    expect(Array.from(container.querySelectorAll('svg')).map(lit)).toEqual([3, 2, 1]);
  });

  it('names itself and draws urgent as a filled square', () => {
    render(<PriorityGlyph priority="urgent" />);
    const svg = screen.getByRole('img', { name: 'Urgent priority' });
    expect(svg.querySelector('rect')?.getAttribute('class')).toContain('fill-destructive');
  });

  it('is decorative when label is null and draws a dash for none', () => {
    const { container } = render(<PriorityGlyph priority="none" label={null} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.querySelectorAll('rect')).toHaveLength(0);
  });
});
