import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GroupHeader } from './group-header';

describe('GroupHeader', () => {
  it('toggles aria-expanded through onOpenChange', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <GroupHeader label="Open items" open onOpenChange={onOpenChange} controls="body" />
    );
    const toggle = screen.getByRole('button', { name: /Open items/ });
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-controls')).toBe('body');
    fireEvent.click(toggle);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    rerender(<GroupHeader label="Open items" open={false} onOpenChange={onOpenChange} />);
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it('renders count, summary, icon and actions beside the toggle', () => {
    const onAdd = vi.fn();
    const { container } = render(
      <GroupHeader
        label="Review"
        count={4}
        summary="2 done"
        icon={<svg data-testid="icon" />}
        onOpenChange={() => {}}
        actions={
          <button type="button" onClick={onAdd}>
            Add
          </button>
        }
      />
    );
    expect(container.querySelector('[data-slot="count"]')?.textContent).toBe('4');
    expect(screen.getByText('2 done')).toBeTruthy();
    expect(screen.getByTestId('icon')).toBeTruthy();
    const toggle = container.querySelector('[data-slot="group-header-toggle"]') as HTMLElement;
    expect(toggle.contains(screen.getByText('Add'))).toBe(false);
    fireEvent.click(screen.getByText('Add'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('is static without onOpenChange', () => {
    const { container } = render(<GroupHeader label="Static" count={2} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(container.querySelector('[data-slot="group-header-toggle"]')).toBeNull();
    expect(container.querySelector('[data-slot="disclosure-chevron"]')).toBeNull();
    expect((container.firstChild as HTMLElement).dataset.state).toBeUndefined();
  });

  it('marks the open state on the root and shows the chevron', () => {
    const { container, rerender } = render(<GroupHeader label="G" open onOpenChange={() => {}} />);
    const root = container.firstChild as HTMLElement;
    expect(root.dataset.state).toBe('open');
    expect(container.querySelector('[data-slot="disclosure-chevron"]')).not.toBeNull();
    rerender(<GroupHeader label="G" open={false} onOpenChange={() => {}} />);
    expect(root.dataset.state).toBe('closed');
  });

  it('wraps the toggle in a heading of the given level', () => {
    render(<GroupHeader label="Section" level={3} onOpenChange={() => {}} variant="section" />);
    expect(screen.getByRole('heading', { level: 3 })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3 }).querySelector('button')).not.toBeNull();
  });

  it('sticks to the top on request, names the toggle by id and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<GroupHeader ref={ref} label="G" sticky triggerId="t1" onOpenChange={() => {}} />);
    expect(ref.current?.className).toContain('sticky');
    expect(screen.getByRole('button').id).toBe('t1');
  });
});
