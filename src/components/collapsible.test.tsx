import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

const setup = (props: { defaultOpen?: boolean; onOpenChange?: (open: boolean) => void } = {}) =>
  render(
    <Collapsible {...props}>
      <CollapsibleTrigger>Details</CollapsibleTrigger>
      <CollapsibleContent>Body copy</CollapsibleContent>
    </Collapsible>
  );

describe('Collapsible', () => {
  it('toggles content from the trigger', () => {
    setup();
    const trigger = screen.getByRole('button', { name: 'Details' });
    const region = (): HTMLElement =>
      document.querySelector('[data-slot="collapsible-content"]') as HTMLElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(region().hasAttribute('inert')).toBe(true);
    expect(region().dataset.state).toBe('closed');

    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(region().hasAttribute('inert')).toBe(false);
    expect(region().dataset.state).toBe('open');
  });

  it('wires aria-controls to the content id', () => {
    setup({ defaultOpen: true });
    const trigger = screen.getByRole('button', { name: 'Details' });
    const region = screen.getByRole('region');
    expect(trigger.getAttribute('aria-controls')).toBe(region.id);
    expect(region.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(region.textContent).toBe('Body copy');
  });

  it('reports open changes', () => {
    const onOpenChange = vi.fn();
    setup({ onOpenChange });
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('renders the trigger as its child when asChild is set', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger asChild>
          <a href="#more">More</a>
        </CollapsibleTrigger>
        <CollapsibleContent>Body copy</CollapsibleContent>
      </Collapsible>
    );
    const link = screen.getByRole('link', { name: 'More' });
    fireEvent.click(link);
    expect(link.getAttribute('aria-expanded')).toBe('true');
  });

  it('draws a chevron and a count on the compact trigger', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger count={3}>Failed</CollapsibleTrigger>
        <CollapsibleContent>Body copy</CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByRole('button', { name: /Failed/ });
    expect(trigger.querySelector('svg')).toBeTruthy();
    expect(trigger.textContent).toBe('Failed3');
  });
});

describe('Collapsible root', () => {
  it('forwards a ref and spreads props on the root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Collapsible ref={ref} id="c1" aria-label="Filters">
        <span>body</span>
      </Collapsible>
    );
    expect(ref.current?.id).toBe('c1');
    expect(ref.current?.getAttribute('aria-label')).toBe('Filters');
  });
});
