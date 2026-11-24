import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusDot, statusDotVariants } from './status-dot';

const root = (container: HTMLElement): HTMLElement =>
  container.querySelector('[data-slot="status-dot"]') as HTMLElement;
const glyph = (container: HTMLElement): SVGElement =>
  root(container).querySelector('[data-slot="status-glyph"]') as SVGElement;

describe('StatusDot (deprecated preset over StatusGlyph)', () => {
  it('announces the state on the root when there is no label', () => {
    const { container } = render(<StatusDot variant="online" />);
    expect(screen.getByRole('img', { name: 'online' })).toBe(root(container));
  });

  it('names a dot without a variant by its default, never "undefined"', () => {
    render(<StatusDot />);
    expect(screen.getByRole('img', { name: 'offline' })).toBeTruthy();
  });

  it('lets the visible label carry the meaning', () => {
    const { container } = render(<StatusDot variant="error" label="Failed" />);
    expect(root(container).getAttribute('aria-label')).toBe(null);
    expect(root(container).getAttribute('role')).toBe(null);
    expect(screen.getByText('Failed')).toBeTruthy();
  });

  it('keeps a caller-supplied aria-label', () => {
    render(<StatusDot variant="working" aria-label="Syncing" />);
    expect(screen.getByRole('img', { name: 'Syncing' })).toBeTruthy();
  });

  it('draws a decorative StatusGlyph mapped from the variant', () => {
    const { container, rerender } = render(<StatusDot variant="warning" />);
    expect(glyph(container).getAttribute('aria-hidden')).toBe('true');
    expect(glyph(container).dataset.shape).toBe('disc');
    rerender(<StatusDot variant="paused" />);
    expect(glyph(container).dataset.shape).toBe('ring');
  });

  it('pulses working, pending and running only when motion is allowed', () => {
    for (const variant of ['working', 'pending', 'running'] as const) {
      const { container, unmount } = render(<StatusDot variant={variant} />);
      expect(glyph(container).getAttribute('class')).toContain('motion-safe:animate-breathe');
      unmount();
    }
  });

  it('forwards className and props to the root wrapper', () => {
    const { container } = render(<StatusDot variant="primary" className="mr-2" data-x="r" />);
    expect(root(container).className).toContain('mr-2');
    expect(root(container).dataset.x).toBe('r');
    expect(glyph(container).getAttribute('class')).not.toContain('mr-2');
  });
});

describe('statusDotVariants', () => {
  it('keeps the 0.20 class strings, with pulses behind motion-safe', () => {
    expect(statusDotVariants({ variant: 'info', size: 'lg' })).toBe(
      'inline-block shrink-0 rounded-full bg-info size-2.5'
    );
    expect(statusDotVariants({ variant: 'pending' })).toContain('motion-safe:animate-pulse');
  });
});
