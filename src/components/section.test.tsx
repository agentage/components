import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Section } from './section';

describe('Section', () => {
  it('merges className last and spreads props on the root', () => {
    const { container } = render(
      <Section title="T" className="mt-2" id="sec" data-x="s">
        body
      </Section>
    );
    const root = container.querySelector('[data-slot="section"]') as HTMLElement;
    expect(root.className.endsWith('mt-2')).toBe(true);
    expect(root.id).toBe('sec');
    expect(root.dataset.x).toBe('s');
  });

  it('hides the decorative icon from assistive tech', () => {
    const { container } = render(
      <Section title="T" icon={<svg />}>
        body
      </Section>
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});

describe('Section heading', () => {
  it('renders an h2 title above a divider', () => {
    const { container } = render(<Section title="General">body</Section>);
    const root = container.querySelector('[data-slot="section"]') as HTMLElement;
    expect(root.className).toContain('border-b');
    expect(screen.getByRole('heading', { level: 2, name: 'General' })).toBeTruthy();
  });
});
