import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InspectorPanel } from './inspector-panel';

afterEach(() => localStorage.clear());

const panel = (props: Partial<React.ComponentProps<typeof InspectorPanel>> = {}) => (
  <InspectorPanel open onOpenChange={() => {}} title="Root" {...props}>
    body
  </InspectorPanel>
);

describe('InspectorPanel', () => {
  it('is a labelled complementary region with a Close button', () => {
    const close = vi.fn();
    render(panel({ onOpenChange: close }));
    expect(screen.getByRole('complementary', { name: 'Root' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(close).toHaveBeenCalledWith(false);
  });

  it('closes to 0 width and becomes inert', () => {
    const { container } = render(panel({ open: false }));
    const aside = container.querySelector('aside');
    expect(aside?.style.width).toBe('0px');
    expect(aside?.hasAttribute('inert')).toBe(true);
  });

  it('resizes with the keyboard inside its bounds and stores the width', () => {
    const { container } = render(panel({ storageKey: 'insp', defaultWidth: 380 }));
    const handle = screen.getByRole('separator', { name: 'Resize panel' });
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(container.querySelector('aside')?.style.width).toBe('396px');
    fireEvent.keyDown(handle, { key: 'End' });
    expect(handle.getAttribute('aria-valuenow')).toBe('420');
    fireEvent.keyDown(handle, { key: 'ArrowRight', shiftKey: true });
    fireEvent.keyDown(handle, { key: 'ArrowRight', shiftKey: true });
    expect(handle.getAttribute('aria-valuenow')).toBe('360');
    expect(localStorage.getItem('insp')).toBe('360');
  });

  it('resizes by dragging the left edge', () => {
    render(panel({ defaultWidth: 380 }));
    const handle = screen.getByRole('separator', { name: 'Resize panel' });
    fireEvent.pointerDown(handle, { clientX: 500, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 480, pointerId: 1 });
    fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(handle.getAttribute('aria-valuenow')).toBe('400');
  });
});

describe('InspectorPanel below 760 px', () => {
  const mockNarrow = (matches: boolean) => {
    window.matchMedia = ((query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
  };
  afterEach(() => {
    Reflect.deleteProperty(window, 'matchMedia');
  });

  it('is a modal dialog: focus moves in, Escape closes, focus returns to the opener', () => {
    mockNarrow(true);
    const close = vi.fn();
    const { rerender } = render(
      <>
        <button type="button">Opener</button>
        {panel({ open: false, onOpenChange: close })}
      </>
    );
    screen.getByRole('button', { name: 'Opener' }).focus();
    rerender(
      <>
        <button type="button">Opener</button>
        {panel({ onOpenChange: close })}
      </>
    );
    const dialog = screen.getByRole('dialog', { name: 'Root' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(close).toHaveBeenCalledWith(false);
    rerender(
      <>
        <button type="button">Opener</button>
        {panel({ open: false, onOpenChange: close })}
      </>
    );
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Opener' }));
  });

  it('stays a non-modal region on wide screens and ignores Escape', () => {
    mockNarrow(false);
    const close = vi.fn();
    render(panel({ onOpenChange: close }));
    fireEvent.keyDown(screen.getByRole('complementary'), { key: 'Escape' });
    expect(close).not.toHaveBeenCalled();
  });
});
