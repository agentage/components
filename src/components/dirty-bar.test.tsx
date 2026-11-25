import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DirtyBar } from './dirty-bar';

const bar = (container: HTMLElement): HTMLElement =>
  container.querySelector('[data-slot="dirty-bar"]') as HTMLElement;

const handlers = () => ({ onSave: vi.fn(), onDiscard: vi.fn(), onStay: vi.fn(), onLeave: vi.fn() });

describe('DirtyBar', () => {
  it('stays mounted but hidden and inert when clean', () => {
    const { container } = render(<DirtyBar dirty={false} {...handlers()} />);
    const el = bar(container);
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.hasAttribute('inert')).toBe(true);
    expect(el.className).toContain('invisible');
    expect(el.dataset.state).toBe('clean');
  });

  it('is a labelled region with Discard and Save when dirty', () => {
    const h = handlers();
    render(<DirtyBar dirty {...h} />);
    const region = screen.getByRole('region', { name: 'Unsaved changes' });
    expect(region.hasAttribute('inert')).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.click(screen.getByRole('button', { name: 'Discard' }));
    expect(h.onSave).toHaveBeenCalledTimes(1);
    expect(h.onDiscard).toHaveBeenCalledTimes(1);
  });

  it('blocks both actions while pending, keeps focus on Save and marks the region busy', () => {
    const h = handlers();
    const { rerender } = render(<DirtyBar dirty {...h} />);
    screen.getByRole('button', { name: 'Save' }).focus();
    rerender(<DirtyBar dirty pending {...h} />);
    const save = screen.getByRole('button', { name: 'Saving' });
    expect(document.activeElement).toBe(save);
    expect(save.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Discard' }));
    expect(h.onDiscard).not.toHaveBeenCalled();
    expect(screen.getByRole('region').getAttribute('aria-busy')).toBe('true');
  });

  it('returns focus to the opener after a save hides the bar', () => {
    const h = handlers();
    const Page = ({ dirty }: { dirty: boolean }) => (
      <>
        <input aria-label="Name" />
        <DirtyBar dirty={dirty} {...h} />
      </>
    );
    const { rerender } = render(<Page dirty />);
    const field = screen.getByLabelText('Name');
    field.focus();
    fireEvent.focus(screen.getByRole('button', { name: 'Save' }), { relatedTarget: field });
    screen.getByRole('button', { name: 'Save' }).focus();
    rerender(<Page dirty={false} />);
    expect(document.activeElement).toBe(field);
  });

  it('lands on Save when Stay leaves the confirm mode', () => {
    const h = handlers();
    const { rerender } = render(<DirtyBar dirty leaving {...h} />);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Stay' }));
    rerender(<DirtyBar dirty {...h} />);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Save' }));
  });

  it('switches to the leave confirm and focuses Stay', () => {
    const h = handlers();
    render(<DirtyBar dirty leaving {...h} />);
    expect(screen.getByText('Leave without saving?')).toBeTruthy();
    const stay = screen.getByRole('button', { name: 'Stay' });
    expect(document.activeElement).toBe(stay);
    fireEvent.click(stay);
    fireEvent.click(screen.getByRole('button', { name: 'Discard and leave' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save and leave' }));
    expect(h.onStay).toHaveBeenCalledTimes(1);
    expect(h.onLeave).toHaveBeenCalledTimes(1);
    expect(h.onSave).toHaveBeenCalledTimes(1);
  });

  it('takes custom copy and merges className', () => {
    const { container } = render(
      <DirtyBar
        dirty
        {...handlers()}
        labels={{ message: '2 fields changed', save: 'Apply' }}
        aria-label="Pending edits"
        className="bottom-6"
      />
    );
    expect(screen.getByText('2 fields changed')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Pending edits' })).toBeTruthy();
    expect(bar(container).className).toContain('bottom-6');
  });
});

describe('DirtyBar quiet discard', () => {
  it('renders Discard as a quiet button that blends into the bar', () => {
    render(<DirtyBar dirty onSave={() => {}} onDiscard={() => {}} />);
    expect(screen.getByRole('button', { name: 'Discard' }).className).toContain('bg-transparent');
  });
});
