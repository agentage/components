import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusGlyph, type StatusGlyphShape } from './status-glyph';

const SHAPES: StatusGlyphShape[] = [
  'ring',
  'dashed',
  'disc',
  'check',
  'cross',
  'question',
  'alert',
  'slash',
  'clock',
];

const glyph = (container: HTMLElement): SVGSVGElement =>
  container.querySelector('[data-slot="status-glyph"]') as SVGSVGElement;

describe('StatusGlyph', () => {
  it('renders every shape as inline svg', () => {
    for (const shape of SHAPES) {
      const { container, unmount } = render(<StatusGlyph shape={shape} />);
      const svg = glyph(container);
      expect(svg.tagName.toLowerCase()).toBe('svg');
      expect(svg.dataset.shape).toBe(shape);
      expect(svg.childElementCount).toBeGreaterThan(0);
      unmount();
    }
  });

  it('is decorative without a label', () => {
    const { container } = render(<StatusGlyph shape="disc" />);
    expect(glyph(container).getAttribute('aria-hidden')).toBe('true');
    expect(glyph(container).getAttribute('role')).toBeNull();
  });

  it('is a named image with a label', () => {
    const { getByRole } = render(<StatusGlyph shape="check" tone="success" label="Succeeded" />);
    const img = getByRole('img', { name: 'Succeeded' });
    expect(img.getAttribute('aria-hidden')).toBeNull();
    expect(img.getAttribute('class')).toContain('text-success');
  });

  it('dashes the dashed ring only', () => {
    const { container, rerender } = render(<StatusGlyph shape="dashed" />);
    expect(container.querySelector('[stroke-dasharray]')).not.toBeNull();
    rerender(<StatusGlyph shape="ring" />);
    expect(container.querySelector('[stroke-dasharray]')).toBeNull();
  });

  it('breathes only when pulse is set, and only for motion-safe users', () => {
    const { container, rerender } = render(<StatusGlyph shape="disc" pulse />);
    expect(glyph(container).getAttribute('class')).toContain('motion-safe:animate-breathe');
    rerender(<StatusGlyph shape="disc" />);
    expect(glyph(container).getAttribute('class')).not.toContain('animate-breathe');
  });

  it('maps size and merges className', () => {
    const { container } = render(<StatusGlyph shape="ring" size="md" className="mr-1" />);
    const cls = glyph(container).getAttribute('class') ?? '';
    expect(cls).toContain('size-4');
    expect(cls).toContain('mr-1');
  });
});

describe('StatusGlyph progress and dot shapes', () => {
  it('draws the half and three-quarters progress shapes with one path each', () => {
    const { container } = render(
      <>
        <StatusGlyph shape="half" />
        <StatusGlyph shape="three-quarters" />
      </>
    );
    const shapes = Array.from(container.querySelectorAll('svg')).map((s) => [
      s.dataset.shape,
      s.querySelectorAll('path').length,
    ]);
    expect(shapes).toEqual([
      ['half', 1],
      ['three-quarters', 1],
    ]);
  });

  it('draws the dot as one filled 6 px circle', () => {
    const { container } = render(<StatusGlyph shape="dot" tone="success" />);
    const svg = container.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('data-shape')).toBe('dot');
    const circle = svg.querySelector('circle') as SVGCircleElement;
    expect(circle.getAttribute('r')).toBe('3');
    expect(circle.getAttribute('fill')).toBe('currentColor');
    expect(svg.getAttribute('class')).toContain('text-success');
  });
});
