import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from './dialog';

const Harness = ({
  onConfirm,
  onOpenChange,
  description,
}: {
  onConfirm: () => void;
  onOpenChange?: (open: boolean) => void;
  description?: string;
}) => {
  const [open, setOpen] = useState(false);
  const change = (next: boolean): void => {
    setOpen(next);
    onOpenChange?.(next);
  };
  return (
    <>
      <button type="button" onClick={() => change(true)}>
        Delete record
      </button>
      <Dialog
        open={open}
        onOpenChange={change}
        title="Delete work-notes?"
        description={description}
        tone="destructive"
        confirmText="work-notes"
        confirmLabel="Delete"
        onConfirm={onConfirm}
      />
    </>
  );
};

const setup = (onConfirm = vi.fn()) => {
  const user = userEvent.setup();
  render(<Harness onConfirm={onConfirm} description="This deletes every note in the record." />);
  return { user, onConfirm };
};

const confirmButton = (): HTMLButtonElement =>
  screen.getByRole('button', { name: 'Delete' }) as HTMLButtonElement;

describe('Dialog confirmText', () => {
  it('opens the destructive dialog from the opener', async () => {
    const { user } = setup();
    expect(screen.queryByRole('alertdialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Delete record' }));
    expect(screen.getByRole('alertdialog', { name: 'Delete work-notes?' })).not.toBeNull();
    expect(screen.getByText('This deletes every note in the record.')).not.toBeNull();
  });

  it('enables confirm only on an exact match and announces the state', async () => {
    const { user, onConfirm } = setup();
    await user.click(screen.getByRole('button', { name: 'Delete record' }));
    const input = screen.getByLabelText(/Type/);
    const hint = document.getElementById(input.getAttribute('aria-describedby') ?? '');

    expect(confirmButton().disabled).toBe(true);
    expect(hint?.getAttribute('aria-live')).toBe('polite');
    expect(hint?.textContent).toBe('Enter the exact phrase to enable Delete.');

    await user.type(input, 'work-note');
    expect(confirmButton().disabled).toBe(true);

    await user.type(input, 's');
    expect(confirmButton().disabled).toBe(false);
    expect(hint?.textContent).toBe('Phrase matches - Delete is enabled.');

    await user.type(input, ' ');
    expect(confirmButton().disabled).toBe(true);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('fires onConfirm and closes once the phrase matches', async () => {
    const { user, onConfirm } = setup();
    await user.click(screen.getByRole('button', { name: 'Delete record' }));
    await user.type(screen.getByLabelText(/Type/), 'work-notes');
    await user.click(confirmButton());
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('cancels on Escape and clears the typed phrase for the next open', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onConfirm={vi.fn()} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Delete record' }));
    await user.type(screen.getByLabelText(/Type/), 'work-notes');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    await user.click(screen.getByRole('button', { name: 'Delete record' }));
    expect((screen.getByLabelText(/Type/) as HTMLInputElement).value).toBe('');
    expect(confirmButton().disabled).toBe(true);
  });

  it('lands focus on cancel and restores it to the opener on close', async () => {
    const { user } = setup();
    const trigger = screen.getByRole('button', { name: 'Delete record' });
    await user.click(trigger);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(document.activeElement).toBe(trigger);
  });
});
