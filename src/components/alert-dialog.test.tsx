import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog } from './alert-dialog';

const Harness = ({ onConfirm = vi.fn() }: { onConfirm?: () => void }): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ overflow: 'hidden' }}>
      <button type="button" onClick={() => setOpen(true)}>
        Delete
      </button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete machine?"
        description="This cannot be undone."
        onConfirm={onConfirm}
      />
    </div>
  );
};

describe('AlertDialog', () => {
  it('renders into document.body, escaping any clipping ancestor', () => {
    const { container } = render(
      <div style={{ overflow: 'hidden' }}>
        <AlertDialog open onOpenChange={vi.fn()} title="Delete machine?" onConfirm={vi.fn()} />
      </div>
    );
    expect(container.querySelector('[data-slot="alert-dialog"]')).toBeNull();
    expect(screen.getByRole('alertdialog').closest('body')).toBe(document.body);
  });

  it('locks body scroll while open', () => {
    const { unmount } = render(
      <AlertDialog open onOpenChange={vi.fn()} title="Delete machine?" onConfirm={vi.fn()} />
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('focuses the safe action and traps Tab inside', () => {
    render(<AlertDialog open onOpenChange={vi.fn()} title="Delete machine?" onConfirm={vi.fn()} />);
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    expect(document.activeElement).toBe(cancel);

    confirm.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(cancel);
  });

  it('closes on Escape and restores focus to the opener', () => {
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Delete' });
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByRole('alertdialog')).not.toBeNull();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});

// Frozen pre-CVA output of the destructive branch.
const confirmClass = (): string | undefined =>
  document.body.querySelectorAll('[role="alertdialog"] button')[1]?.className;

describe('AlertDialog buttons', () => {
  it('renders the confirm as a default Button', () => {
    render(<AlertDialog open onOpenChange={vi.fn()} title="T" onConfirm={vi.fn()} />);
    expect(confirmClass()).toContain('bg-primary');
    expect(confirmClass()).toContain('h-7');
  });

  it('renders the destructive confirm as a destructive Button', () => {
    render(
      <AlertDialog
        open
        onOpenChange={vi.fn()}
        title="T"
        onConfirm={vi.fn()}
        variant="destructive"
      />
    );
    expect(confirmClass()).toContain('bg-destructive-solid');
  });

  it('merges className last on the panel and spreads props', () => {
    render(
      <AlertDialog
        open
        onOpenChange={vi.fn()}
        title="T"
        onConfirm={vi.fn()}
        className="mt-4"
        id="ad"
      />
    );
    const panel = document.body.querySelector('[data-slot="alert-dialog-content"]');
    expect(panel?.className.endsWith(' mt-4')).toBe(true);
    expect(panel?.id).toBe('ad');
  });
});

describe('AlertDialog async confirm', () => {
  it('stays open and pending until the promise resolves', async () => {
    let resolve: () => void = () => {};
    const onOpenChange = vi.fn();
    render(
      <AlertDialog
        open
        onOpenChange={onOpenChange}
        title="Delete?"
        confirmLabel="Delete"
        onConfirm={() => new Promise<void>((r) => (resolve = r))}
      />
    );
    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmButton);
    expect(confirmButton.getAttribute('aria-busy')).toBe('true');
    expect(onOpenChange).not.toHaveBeenCalled();
    await act(async () => resolve());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('stays open when the confirm fails', async () => {
    const onOpenChange = vi.fn();
    render(
      <AlertDialog
        open
        onOpenChange={onOpenChange}
        title="Delete?"
        confirmLabel="Delete"
        onConfirm={() => Promise.reject(new Error('no'))}
      />
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    });
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
