import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog, DialogFooter } from './dialog';

const Harness = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    // The clipping ancestor a non-portalled overlay would be trapped inside.
    <div style={{ overflow: 'hidden' }}>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Dialog open={open} onOpenChange={setOpen} title="Create Report">
        <button type="button">Save</button>
      </Dialog>
    </div>
  );
};

describe('Dialog', () => {
  it('renders into document.body, escaping any clipping ancestor', () => {
    const { container } = render(
      <div style={{ overflow: 'hidden' }}>
        <Dialog open onOpenChange={vi.fn()} title="Create Report">
          content
        </Dialog>
      </div>
    );
    expect(container.querySelector('[data-slot="dialog"]')).toBeNull();
    expect(screen.getByRole('dialog').closest('body')).toBe(document.body);
  });

  it('locks body scroll while open and releases it on close', () => {
    const { rerender } = render(
      <Dialog open onOpenChange={vi.fn()} title="Create Report">
        content
      </Dialog>
    );
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).not.toBe('');

    rerender(
      <Dialog open={false} onOpenChange={vi.fn()} title="Create Report">
        content
      </Dialog>
    );
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('moves focus inside on open and restores it to the opener on close', () => {
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();
    fireEvent.click(opener);

    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});

// Frozen panel classes; the look must not drift.
const PANEL_BASE =
  'relative z-10 w-full rounded-lg border border-border bg-background shadow-[var(--shadow-popover)] outline-none';

const panelClass = (): string | undefined =>
  document.body.querySelector('[data-slot="dialog-content"]')?.className;

describe('Dialog dismiss', () => {
  it('closes from the close button and from a backdrop click', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="Create Report">
        body
      </Dialog>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    fireEvent.mouseDown(document.querySelector('[data-slot="dialog-backdrop"]') as Element);
    fireEvent.click(document.querySelector('[data-slot="dialog-backdrop"]') as Element);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});

describe('Dialog class parity', () => {
  it('renders the panel byte-identically', () => {
    render(
      <Dialog open onOpenChange={vi.fn()}>
        body
      </Dialog>
    );
    expect(panelClass()).toBe(`${PANEL_BASE} max-w-md`);
  });

  it('merges className last and spreads props onto the panel', () => {
    render(
      <Dialog open onOpenChange={vi.fn()} className="mt-4" id="m">
        body
      </Dialog>
    );
    expect(panelClass()).toBe(`${PANEL_BASE} max-w-md mt-4`);
    expect(document.body.querySelector('#m')).not.toBeNull();
  });

  it('keeps the DialogFooter surface unchanged', () => {
    render(<DialogFooter className="pt-2">f</DialogFooter>);
    expect(document.body.querySelector('[data-slot="dialog-footer"]')?.className).toBe(
      'flex items-center justify-end gap-2 border-t border-border -mx-4 -mb-4 mt-4 px-4 py-3 bg-muted/30 rounded-b-lg pt-2'
    );
  });
});
