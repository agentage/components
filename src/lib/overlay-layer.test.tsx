import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from '../components/select';
import { DropdownMenu, DropdownMenuItem } from '../components/dropdown-menu';
import { Dialog } from '../components/dialog';
import { Popover } from '../components/popover';

const PopoverHarness = ({ content }: { content?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label="Filters"
      trigger={
        <button type="button" onClick={() => setOpen((o) => !o)}>
          Filters
        </button>
      }
      content={
        content ?? (
          <>
            <button type="button">First</button>
            <button type="button">Last</button>
          </>
        )
      }
    />
  );
};

const ModalWith = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen} title="Settings">
      {children}
    </Dialog>
  );
};

describe('overlay layer stack', () => {
  it('closes only the popover on Escape inside a modal, then the modal', async () => {
    const user = userEvent.setup();
    render(
      <ModalWith>
        <PopoverHarness />
      </ModalWith>
    );
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'First' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Filters' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Filters' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Settings' })).toBeNull();
  });

  it('keeps a popover open while an item of a menu opened inside it is pressed', async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(
      <PopoverHarness
        content={
          <DropdownMenu trigger={<button type="button">More</button>}>
            <DropdownMenuItem onClick={onPick}>Duplicate</DropdownMenuItem>
          </DropdownMenu>
        }
      />
    );
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('button', { name: 'More' }));
    await user.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(onPick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'More' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
  });

  it('closes an alert dialog over a modal without closing the modal', async () => {
    const user = userEvent.setup();
    const Harness = () => {
      const [confirm, setConfirm] = useState(false);
      return (
        <ModalWith>
          <button type="button" onClick={() => setConfirm(true)}>
            Discard
          </button>
          <Dialog
            open={confirm}
            onOpenChange={setConfirm}
            title="Discard changes?"
            onConfirm={() => {}}
          />
        </ModalWith>
      );
    };
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Discard' }));
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
  });

  it('closes a combobox list inside a modal on Escape and keeps the modal', async () => {
    const user = userEvent.setup();
    render(
      <ModalWith>
        <Select aria-label="Colour" options={[{ value: 'red', label: 'Red' }]} />
      </ModalWith>
    );
    const trigger = screen.getByRole('combobox', { name: 'Colour' });
    await user.click(trigger);
    await act(() => new Promise((r) => setTimeout(r, 0)));
    expect(screen.getByRole('listbox')).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
    expect(document.activeElement).toBe(trigger);
  });

  it('a backdrop press that dismisses a child layer does not close the modal', () => {
    const onOpenChange = vi.fn();
    const Harness = () => (
      <Dialog open onOpenChange={onOpenChange} title="Settings">
        <PopoverHarness />
      </Dialog>
    );
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    const backdrop = document.querySelector('[data-slot="dialog-backdrop"]') as HTMLElement;
    fireEvent.mouseDown(backdrop);
    fireEvent.click(backdrop);
    expect(screen.queryByRole('dialog', { name: 'Filters' })).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe('Popover keyboard', () => {
  it('moves focus in on open, and Tab past the last element closes it on the trigger', async () => {
    const user = userEvent.setup();
    render(
      <>
        <PopoverHarness />
        <button type="button">Next</button>
      </>
    );
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'First' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Last' }));
    await user.tab();
    expect(screen.queryByRole('dialog', { name: 'Filters' })).toBeNull();
    expect(document.activeElement).not.toBe(document.body);
  });

  it('Shift+Tab from the first element returns to the trigger', async () => {
    const user = userEvent.setup();
    render(<PopoverHarness />);
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.tab({ shift: true });
    expect(screen.queryByRole('dialog', { name: 'Filters' })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Filters' }));
  });

  it('names the trigger state and the surface', async () => {
    const user = userEvent.setup();
    render(<PopoverHarness />);
    const trigger = screen.getByRole('button', { name: 'Filters' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await user.click(trigger);
    const surface = screen.getByRole('dialog', { name: 'Filters' });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(surface.id);
  });
});
