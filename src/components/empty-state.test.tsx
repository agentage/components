import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('centres by default', () => {
    const { container } = render(<EmptyState title="Nothing" />);
    const root = container.querySelector('[data-slot="empty-state"]') as HTMLElement;
    expect(root.dataset.align).toBe('center');
    expect(root.className).toContain('text-center');
  });

  it('renders a compact left-aligned block with align start', () => {
    const { container } = render(
      <EmptyState align="start" title="No services" description="Clear a filter." />
    );
    const root = container.querySelector('[data-slot="empty-state"]') as HTMLElement;
    expect(root.className).toContain('items-start');
    expect(screen.getByRole('heading', { name: 'No services' })).toBeTruthy();
  });
});
