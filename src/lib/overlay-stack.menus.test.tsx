import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Command, CommandItem } from '../components/command';
import { DropdownMenu, DropdownMenuItem } from '../components/dropdown-menu';
import { Dialog } from '../components/dialog';
import { Tooltip } from '../components/tooltip';

const btn = (name: string) => screen.getByRole('button', { name });
const focused = () => document.activeElement;
const locked = () => document.body.style.overflow === 'hidden';
const expectOnTop = (el: HTMLElement) => {
  expect(el.closest('[aria-hidden="true"]')).toBeNull();
  expect(el.closest('[inert]')).toBeNull();
};

const expectClean = () => {
  expect(
    document.querySelectorAll('[role="dialog"],[role="menu"],[role="tooltip"],[data-aria-hidden]')
      .length
  ).toBe(0);
  expect(document.body.style.overflow).toBe('');
  expect(document.body.style.paddingRight).toBe('');
  expect(document.querySelectorAll('[inert]').length).toBe(0);
  for (const el of Array.from(document.body.children))
    expect(el.getAttribute('aria-hidden')).toBeNull();
  expect(fireEvent.keyDown(document.body, { key: 'Escape' })).toBe(true);
};

describe('overlay stack: Tooltip inside a DropdownMenu item', () => {
  const Menu = () => (
    <DropdownMenu trigger="Actions">
      <Tooltip content="Copies the link">
        <DropdownMenuItem>Copy</DropdownMenuItem>
      </Tooltip>
      <DropdownMenuItem>Rename</DropdownMenuItem>
    </DropdownMenu>
  );

  it('Escape hides the tooltip first, then closes the menu', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(btn('Actions'));
    expect(focused()).toBe(screen.getByRole('menuitem', { name: 'Copy' }));
    expectOnTop(await screen.findByRole('tooltip'));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(focused()).toBe(screen.getByRole('menuitem', { name: 'Copy' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(focused()).toBe(btn('Actions'));
    expectClean();
  });

  it('a press on the tooltip counts as inside the menu', async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(btn('Actions'));
    fireEvent.mouseDown(await screen.findByRole('tooltip'));
    expect(screen.getByRole('menu')).toBeTruthy();
    await user.click(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
    expectClean();
  });
});
const ModalAndCommand = ({ closeModal = false }: { closeModal?: boolean }) => {
  const [m, setM] = useState(false);
  const [c, setC] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setM(true)}>
        Open modal
      </button>
      <Dialog open={m && !closeModal} onOpenChange={setM} title="Settings">
        <button type="button" onClick={() => setC(true)}>
          Search
        </button>
      </Dialog>
      <Command open={c} onOpenChange={setC}>
        <CommandItem onSelect={() => setC(false)}>Go home</CommandItem>
      </Command>
    </>
  );
};

describe('overlay stack: Command over an open Dialog', () => {
  it('Escape and its backdrop close the palette first, then the modal', async () => {
    const user = userEvent.setup();
    render(<ModalAndCommand />);
    await user.click(btn('Open modal'));
    await user.click(btn('Search'));
    const palette = screen.getByRole('dialog', { name: 'Command palette' });
    expectOnTop(palette);
    expect(focused()).toBe(screen.getByRole('combobox', { name: 'Search' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).toBeNull();
    expect(focused()).toBe(btn('Search'));
    await user.click(btn('Search'));
    const backdrops = document.querySelectorAll<HTMLElement>('[data-slot="dialog-backdrop"]');
    await user.click(backdrops[backdrops.length - 1]);
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(focused()).toBe(btn('Open modal'));
    expectClean();
  });

  it('closing the lower modal first still releases the lock when the palette closes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ModalAndCommand />);
    await user.click(btn('Open modal'));
    await user.click(btn('Search'));
    rerender(<ModalAndCommand closeModal />);
    expect(screen.queryByRole('dialog', { name: 'Settings' })).toBeNull();
    expect(locked()).toBe(true);
    await user.keyboard('{Escape}');
    expectClean();
  });
});
