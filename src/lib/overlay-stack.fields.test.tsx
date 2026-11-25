import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeAll, describe, expect, it } from 'vitest';
import { Popover } from '../components/popover';
import { Select } from '../components/select';
import { Sheet } from '../components/sheet';

beforeAll(() => {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const btn = (name: string) => screen.getByRole('button', { name });
const focused = () => document.activeElement;
const setup = () => userEvent.setup({ pointerEventsCheck: 0 });

/** Also checks the residue overlays leave: pointer-events, scroll lock and aria-hidden marks. */
const expectClean = () => {
  expect(document.querySelectorAll('[role="dialog"],[role="listbox"]').length).toBe(0);
  expect(document.body.style.overflow).toBe('');
  expect(document.body.style.pointerEvents).toBe('');
  expect(document.body.hasAttribute('data-scroll-locked')).toBe(false);
  expect(document.body.className).toBe('');
  expect(document.querySelectorAll('[data-aria-hidden],[inert]:not(aside)').length).toBe(0);
  for (const el of Array.from(document.body.children))
    expect(el.getAttribute('aria-hidden')).toBeNull();
  expect(fireEvent.keyDown(document.body, { key: 'Escape' })).toBe(true);
};

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'pear', label: 'Pear' },
];

const Fruit = ({ searchable }: { searchable?: boolean }) => (
  <Select options={fruits} aria-label="Fruit" placeholder="Pick" searchable={searchable} />
);

const InSheet = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open sheet
      </button>
      <Sheet open={open} onOpenChange={setOpen} title="Edit">
        {children}
      </Sheet>
    </>
  );
};

describe('overlay stack: Sheet > Select', () => {
  it('Escape closes the Select to its trigger, then the Sheet to its opener', async () => {
    const user = setup();
    render(<InSheet children={<Fruit />} />);
    await user.click(btn('Open sheet'));
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    const list = screen.getByRole('listbox');
    expect(list.closest('[aria-hidden="true"]')).toBeNull();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Edit' })).toBeTruthy();
    expect(focused()).toBe(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.keyboard('{Escape}');
    expect(focused()).toBe(btn('Open sheet'));
    expectClean();
  });

  it('a press on the page outside the open Select leaves the Sheet open', async () => {
    const user = setup();
    render(<InSheet children={<Fruit />} />);
    await user.click(btn('Open sheet'));
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    fireEvent.pointerDown(document.documentElement);
    fireEvent.mouseDown(document.documentElement);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Edit' })).toBeTruthy();
    await user.keyboard('{Escape}');
    expectClean();
  });
});

const InPopover = ({ children }: { children: React.ReactNode }) => {
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
      content={children}
    />
  );
};

describe('overlay stack: unmount with the list open', () => {
  it('unmounting Sheet > Select with the listbox open leaves the body clean', async () => {
    const user = setup();
    const { unmount } = render(<InSheet children={<Fruit />} />);
    await user.click(btn('Open sheet'));
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    expect(screen.getByRole('listbox')).toBeTruthy();
    unmount();
    expectClean();
  });
});

describe('overlay stack: Select inside a Popover', () => {
  it('picking an option keeps the popover open; Escape closes only the list first', async () => {
    const user = setup();
    render(<InPopover children={<Fruit />} />);
    await user.click(btn('Filters'));
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.click(screen.getByRole('option', { name: 'Pear' }));
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Fruit' }).textContent).toContain('Pear');
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(focused()).toBe(btn('Filters'));
    expectClean();
  });
});

describe('overlay stack: searchable Select in a Sheet', () => {
  it('Escape and a press inside the sheet close only the list', async () => {
    const user = setup();
    render(<InSheet children={<Fruit searchable />} />);
    await user.click(btn('Open sheet'));
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    expect(screen.getByRole('listbox')).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(focused()).toBe(screen.getByRole('combobox', { name: 'Fruit' }));
    expect(screen.getByRole('dialog', { name: 'Edit' })).toBeTruthy();
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.click(screen.getByRole('heading', { name: 'Edit' }));
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Edit' })).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(focused()).toBe(btn('Open sheet'));
    expectClean();
  });
});
