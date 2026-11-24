import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActionBar, type ActionBarAction } from './action-bar';
import { DropdownMenuItem } from './dropdown-menu';

const make = (spy = vi.fn()): { actions: ActionBarAction[]; tail: ActionBarAction[] } => ({
  actions: [
    { id: 'allow', label: 'Allow', kbd: 'A', variant: 'primary', onSelect: () => spy('allow') },
    { id: 'deny', label: 'Deny', kbd: 'D', variant: 'destructive', onSelect: () => spy('deny') },
  ],
  tail: [{ id: 'snooze', label: 'Snooze', kbd: 'H', onSelect: () => spy('snooze') }],
});

const restore: (() => void)[] = [];
const stub = (prop: 'clientWidth' | 'offsetWidth', get: (el: HTMLElement) => number) => {
  const desc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop);
  Object.defineProperty(HTMLElement.prototype, prop, {
    configurable: true,
    get(this: HTMLElement) {
      return get(this);
    },
  });
  restore.push(() => desc && Object.defineProperty(HTMLElement.prototype, prop, desc));
};

afterEach(() => restore.splice(0).forEach((f) => f()));

describe('ActionBar', () => {
  it('renders a toolbar of buttons, with key hints only while hotkeys are on', () => {
    const spy = vi.fn();
    const { rerender } = render(<ActionBar {...make(spy)} />);
    expect(screen.getByRole('toolbar', { name: 'Actions' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Allow' }).getAttribute('aria-keyshortcuts')).toBe(
      null
    );
    rerender(<ActionBar {...make(spy)} hotkeys />);
    const allow = screen.getByRole('button', { name: /Allow/ });
    expect(allow.getAttribute('aria-keyshortcuts')).toBe('A');
    expect(allow.textContent).toBe('AllowA');
    fireEvent.click(allow);
    expect(spy).toHaveBeenCalledWith('allow');
    expect(screen.getByRole('button', { name: /Snooze/ })).toBeTruthy();
  });

  it('fires actions from their keys when hotkeys is on, not while typing', () => {
    const spy = vi.fn();
    render(
      <>
        <input aria-label="reply" />
        <ActionBar {...make(spy)} hotkeys />
      </>
    );
    fireEvent.keyDown(document.body, { key: 'd' });
    expect(spy).toHaveBeenCalledWith('deny');
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'h' });
    expect(spy).not.toHaveBeenCalledWith('snooze');
  });

  it('ignores held keys and keys meant for an open menu or another dialog', () => {
    const spy = vi.fn();
    render(
      <>
        <div role="menu">
          <button type="button" role="menuitem">
            Item
          </button>
        </div>
        <div role="dialog" aria-label="Other">
          <button type="button">Inside</button>
        </div>
        <ActionBar {...make(spy)} hotkeys />
      </>
    );
    fireEvent.keyDown(screen.getByRole('menuitem'), { key: 'd' });
    fireEvent.keyDown(screen.getByRole('button', { name: 'Inside' }), { key: 'd' });
    fireEvent.keyDown(document.body, { key: 'd', repeat: true });
    expect(spy).not.toHaveBeenCalled();
    fireEvent.keyDown(document.body, { key: 'd' });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('opens the menu action from its key', () => {
    render(
      <ActionBar
        {...make()}
        hotkeys
        menu={{
          label: 'Assign',
          kbd: 'S',
          children: <DropdownMenuItem>Someone</DropdownMenuItem>,
        }}
      />
    );
    fireEvent.keyDown(document.body, { key: 's' });
    expect(screen.getByRole('menuitem', { name: 'Someone' })).toBeTruthy();
  });

  it('opens the menu action', () => {
    render(
      <ActionBar
        {...make()}
        menu={{
          label: 'Assign',
          kbd: 'G',
          children: <DropdownMenuItem>release service</DropdownMenuItem>,
        }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Assign/ }));
    expect(screen.getByRole('menuitem', { name: 'release service' })).toBeTruthy();
  });

  it('folds the tail, then secondary actions, into More when narrow', () => {
    stub('clientWidth', (el) => (el.dataset.slot === 'action-bar' ? 150 : 0));
    stub('offsetWidth', (el) => (el.dataset.slot === 'action-bar-tail' ? 40 : 80));
    render(<ActionBar {...make()} />);
    const bar = screen.getByRole('toolbar');
    expect(bar.dataset.level).toBe('2');
    expect(screen.queryByRole('button', { name: /Deny/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByRole('menuitem', { name: /Deny/ })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /Snooze/ })).toBeTruthy();
  });

  it('folds the menu action too when even that does not fit', () => {
    stub('clientWidth', (el) => (el.dataset.slot === 'action-bar' ? 100 : 0));
    stub('offsetWidth', () => 80);
    render(
      <ActionBar
        {...make()}
        menu={{ label: 'Assign', children: <DropdownMenuItem>release service</DropdownMenuItem> }}
      />
    );
    expect(screen.getByRole('toolbar').dataset.level).toBe('3');
    expect(screen.queryByRole('button', { name: /Assign/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByRole('menuitem', { name: 'release service' })).toBeTruthy();
  });

  it('limits hotkeys to the scope element', () => {
    const spy = vi.fn();
    const Scoped = () => {
      const ref = useRef<HTMLDivElement>(null);
      return (
        <div ref={ref} data-testid="pane" tabIndex={-1}>
          <ActionBar {...make(spy)} hotkeys hotkeyScope={ref} />
        </div>
      );
    };
    render(<Scoped />);
    fireEvent.keyDown(document.body, { key: 'a' });
    expect(spy).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByTestId('pane'), { key: 'a' });
    expect(spy).toHaveBeenCalledWith('allow');
  });

  it('measures again when a label grows under the same id', () => {
    stub('clientWidth', (el) => (el.dataset.slot === 'action-bar' ? 300 : 0));
    stub('offsetWidth', (el) =>
      el.dataset.slot === 'action-bar-tail' ? 40 : (el.textContent?.length ?? 0) * 10
    );
    const acts = (label: string): ActionBarAction[] => [
      { id: 'approve', label, variant: 'primary' },
      { id: 'deny', label: 'Deny' },
    ];
    const { rerender } = render(<ActionBar actions={acts('Approve')} tail={make().tail} />);
    expect(screen.getByRole('toolbar').dataset.level).toBe('0');
    rerender(<ActionBar actions={acts('Approving the whole request now')} tail={make().tail} />);
    expect(screen.getByRole('toolbar').dataset.level).not.toBe('0');
  });
});
