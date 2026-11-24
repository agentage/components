import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Disclosure, DisclosureChevron } from './disclosure';

describe('Disclosure', () => {
  it('keeps a shut body mounted but inert and marked closed', () => {
    render(
      <Disclosure open={false} data-testid="d">
        <button type="button">Inside</button>
      </Disclosure>
    );
    const body = screen.getByTestId('d');
    expect(body.hasAttribute('inert')).toBe(true);
    expect(body.dataset.state).toBe('closed');
    expect(screen.getByText('Inside')).toBeTruthy();
  });

  it('makes an open body interactive again', () => {
    render(
      <Disclosure open data-testid="d">
        x
      </Disclosure>
    );
    const body = screen.getByTestId('d');
    expect(body.hasAttribute('inert')).toBe(false);
    expect(body.dataset.state).toBe('open');
  });

  it('puts className on the content box and bodyClassName on the animated box', () => {
    render(
      <Disclosure open className="px-3" bodyClassName="mt-2" data-testid="d">
        content
      </Disclosure>
    );
    const body = screen.getByTestId('d');
    expect(body.className).toContain('mt-2');
    expect(body.className).toContain('grid');
    expect(screen.getByText('content').className).toBe('px-3');
  });

  it('adds the fade and shrink classes only on request', () => {
    const { rerender } = render(
      <Disclosure open={false} data-testid="d">
        x
      </Disclosure>
    );
    expect(screen.getByTestId('d').className).not.toContain('opacity-0');
    rerender(
      <Disclosure open={false} fade shrink data-testid="d">
        x
      </Disclosure>
    );
    expect(screen.getByTestId('d').className).toContain('data-[state=closed]:opacity-0');
    expect(screen.getByTestId('d').className).toContain('grid-cols-[minmax(0,1fr)]');
  });
});

describe('DisclosureChevron', () => {
  it('rotates when open and is hidden from assistive technology', () => {
    const { container, rerender } = render(<DisclosureChevron open={false} />);
    const svg = container.querySelector('[data-slot="disclosure-chevron"]') as SVGElement;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('class')).not.toContain('rotate-90');
    rerender(<DisclosureChevron open />);
    expect(svg.getAttribute('class')).toContain('rotate-90');
  });
});
