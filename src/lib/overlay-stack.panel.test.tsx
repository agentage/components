import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Select } from '../components/select';
import { DateRangePicker } from '../components/date-picker.range';
import { Sheet } from '../components/sheet';
import { Popover } from '../components/popover';

afterEach(() => vi.unstubAllGlobals());

const btn = (name: string) => screen.getByRole('button', { name });
const focused = () => document.activeElement;
const setup = () => userEvent.setup();

/** A closed panel keeps `inert` by contract; nothing else may. */
const expectClean = () => {
  expect(document.querySelectorAll('[role="dialog"]:not(aside),[role="listbox"]').length).toBe(0);
  expect(document.body.style.overflow).toBe('');
  expect(document.querySelectorAll('[inert]:not(aside),[data-aria-hidden]').length).toBe(0);
  expect(document.querySelector('aside')?.closest('[aria-hidden="true"]') ?? null).toBeNull();
  expect(fireEvent.keyDown(document.body, { key: 'Escape' })).toBe(true);
};

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

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'pear', label: 'Pear' },
];

const narrow = (matches: boolean) =>
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches,
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));

const Inspector = ({ extra }: { extra?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Inspect
      </button>
      <Sheet mode="docked" open={open} onOpenChange={setOpen} title="Details">
        <InPopover children={<DateRangePicker />} />
        {extra}
      </Sheet>
    </>
  );
};

describe.each([false, true])('overlay stack: docked Sheet (narrow %s) > Popover > range', (n) => {
  it('Escape closes the range, the popover, then (as a dialog) the panel', async () => {
    narrow(n);
    const user = setup();
    render(<Inspector />);
    await user.click(btn('Inspect'));
    await user.click(btn('Filters'));
    await user.click(screen.getByRole('button', { name: /^Date range/ }));
    const range = screen.getByRole('dialog', { name: 'Date range' });
    expect(range.closest('[aria-hidden="true"],[inert]')).toBeNull();
    await user.click(screen.getByRole('dialog', { name: 'Filters' }));
    expect(screen.queryByRole('dialog', { name: 'Date range' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /^Date range/ }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Date range' })).toBeNull();
    expect(focused()).toBe(screen.getByRole('button', { name: /^Date range/ }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Filters' })).toBeNull();
    expect(focused()).toBe(btn('Filters'));
    await user.keyboard('{Escape}');
    const aside = document.querySelector('aside')!;
    expect(aside.getAttribute('data-state')).toBe(n ? 'closed' : 'open');
    if (n) expect(focused()).toBe(btn('Inspect'));
    else await user.click(btn('Close'));
    expectClean();
  });

  it('a press on the panel body closes both popovers and leaves the panel open', async () => {
    narrow(n);
    const user = setup();
    const { unmount } = render(<Inspector />);
    await user.click(btn('Inspect'));
    await user.click(btn('Filters'));
    await user.click(screen.getByRole('button', { name: /^Date range/ }));
    await user.click(screen.getByRole('heading', { name: 'Details' }));
    expect(screen.queryByRole('dialog', { name: 'Date range' })).toBeNull();
    expect(screen.queryByRole('dialog', { name: 'Filters' })).toBeNull();
    expect(document.querySelector('aside')!.getAttribute('data-state')).toBe('open');
    await user.click(btn('Filters'));
    await user.click(screen.getByRole('button', { name: /^Date range/ }));
    unmount();
    expectClean();
  });

  it('Escape in an inline Select closes only the combobox', async () => {
    narrow(n);
    const user = setup();
    render(<Inspector extra={<Select options={fruits} aria-label="Fruit" />} />);
    await user.click(btn('Inspect'));
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(document.querySelector('aside')!.getAttribute('data-state')).toBe('open');
  });
});
