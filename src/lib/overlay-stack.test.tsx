import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { AlertDialog } from '../components/alert-dialog';
import { DropdownMenu, DropdownMenuItem } from '../components/dropdown-menu';
import { Modal } from '../components/modal';
import { Popover } from '../components/popover';

const btn = (name: string) => screen.getByRole('button', { name });
const focused = () => document.activeElement;
const locked = () => document.body.style.overflow === 'hidden';

/** Nothing left behind once every layer closed: portals, lock, inert, aria-hidden, listeners. */
const expectClean = () => {
  expect(
    document.querySelectorAll('[role="dialog"],[role="menu"],[role="alertdialog"]').length
  ).toBe(0);
  expect(document.body.style.overflow).toBe('');
  expect(document.body.style.paddingRight).toBe('');
  expect(document.querySelectorAll('[inert]').length).toBe(0);
  for (const el of Array.from(document.body.children))
    expect(el.getAttribute('aria-hidden')).toBeNull();
  for (const el of Array.from(document.querySelectorAll('[aria-hidden="true"]:not(svg)')))
    expect(el.querySelector('button,input,[tabindex]')).toBeNull();
  // The stack calls preventDefault while any layer is registered, so true means it is empty.
  expect(fireEvent.keyDown(document.body, { key: 'Escape' })).toBe(true);
};

const expectOnTop = (el: HTMLElement) => {
  expect(el.closest('[aria-hidden="true"]')).toBeNull();
  expect(el.closest('[inert]')).toBeNull();
};

const Stack = () => {
  const [m, setM] = useState(false);
  const [p, setP] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setM(true)}>
        Open modal
      </button>
      <Modal open={m} onOpenChange={setM} title="Settings">
        <Popover
          open={p}
          onOpenChange={setP}
          label="Filters"
          trigger={
            <button type="button" onClick={() => setP((o) => !o)}>
              Filters
            </button>
          }
          content={
            <DropdownMenu trigger="Sort">
              <DropdownMenuItem>Name</DropdownMenuItem>
            </DropdownMenu>
          }
        />
      </Modal>
    </>
  );
};

const openStack = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(btn('Open modal'));
  await user.click(btn('Filters'));
  await user.click(btn('Sort'));
  expect(screen.getByRole('menu')).toBeTruthy();
};

describe('overlay stack: Modal > Popover > DropdownMenu', () => {
  it('Escape closes one layer per press and focus walks back down', async () => {
    const user = userEvent.setup();
    render(<Stack />);
    await openStack(user);
    expect(locked()).toBe(true);
    expectOnTop(screen.getByRole('menu'));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
    expect(focused()).toBe(btn('Sort'));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Filters' })).toBeNull();
    expect(focused()).toBe(btn('Filters'));
    expect(locked()).toBe(true);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(focused()).toBe(btn('Open modal'));
    expectClean();
  });

  it('an outside press closes only the layers above the pressed one', async () => {
    const user = userEvent.setup();
    render(<Stack />);
    await openStack(user);
    await user.click(screen.getByRole('dialog', { name: 'Filters' }));
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Filters' }).contains(focused())).toBe(true);
    await user.click(btn('Sort'));
    await user.click(screen.getByRole('heading', { name: 'Settings' }));
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.queryByRole('dialog', { name: 'Filters' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Settings' }).contains(focused())).toBe(true);
    await user.click(btn('Filters'));
    const backdrop = document.querySelector<HTMLElement>('[data-slot="dialog-backdrop"]')!;
    await user.click(backdrop);
    expect(screen.queryByRole('dialog', { name: 'Filters' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
    await user.click(backdrop);
    expect(screen.queryByRole('dialog')).toBeNull();
    expectClean();
  });

  it('unmounting the tree with every layer open leaves the stack clean', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Stack />);
    await openStack(user);
    unmount();
    expectClean();
  });
});

const ModalAndAlert = () => {
  const [m, setM] = useState(false);
  const [a, setA] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setM(true)}>
        Open modal
      </button>
      <Modal open={m} onOpenChange={setM} title="Settings">
        <button type="button" onClick={() => setA(true)}>
          Delete
        </button>
        <AlertDialog open={a} onOpenChange={setA} title="Delete item?" onConfirm={() => {}} />
      </Modal>
    </>
  );
};

describe('overlay stack: AlertDialog over Modal', () => {
  it('Escape and the alert backdrop close the alert only; the lock holds until the modal closes', async () => {
    const user = userEvent.setup();
    render(<ModalAndAlert />);
    await user.click(btn('Open modal'));
    await user.click(btn('Delete'));
    expectOnTop(screen.getByRole('alertdialog'));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(focused()).toBe(btn('Delete'));
    expect(locked()).toBe(true);
    await user.click(btn('Delete'));
    const backdrops = document.querySelectorAll<HTMLElement>('[data-slot="dialog-backdrop"]');
    await user.click(backdrops[backdrops.length - 1]);
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
    expect(focused()).toBe(btn('Delete'));
    await user.keyboard('{Escape}');
    expect(focused()).toBe(btn('Open modal'));
    expectClean();
  });

  it('unmounting both open dialogs at once releases the scroll lock', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<ModalAndAlert />);
    await user.click(btn('Open modal'));
    await user.click(btn('Delete'));
    unmount();
    expectClean();
  });
});
