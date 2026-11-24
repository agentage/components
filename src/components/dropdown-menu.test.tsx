import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './dropdown-menu';

const setup = (onPick = vi.fn()) => {
  render(
    <DropdownMenu trigger={<span>Actions</span>}>
      <DropdownMenuItem onClick={onPick}>View</DropdownMenuItem>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>Delete</DropdownMenuItem>
    </DropdownMenu>
  );
  return { trigger: screen.getByRole('button', { name: 'Actions' }), onPick };
};

describe('DropdownMenu', () => {
  it('forwards className to the menu content', () => {
    render(
      <DropdownMenu trigger={<span>Actions</span>} className="w-64">
        <DropdownMenuItem>View</DropdownMenuItem>
      </DropdownMenu>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu').className).toContain('w-64');
  });

  it('renders the trigger as a button announcing a menu', () => {
    const { trigger } = setup();
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('merges the semantics into an interactive trigger instead of nesting buttons', () => {
    const { container } = render(
      <DropdownMenu trigger={<button type="button">Actions</button>}>
        <DropdownMenuItem>View</DropdownMenuItem>
      </DropdownMenu>
    );
    expect(container.querySelectorAll('button')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).not.toBeNull();
  });

  it('opens on ArrowDown and focuses the first item', () => {
    const { trigger } = setup();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'View' }));
  });

  it('opens on Enter', () => {
    const { trigger } = setup();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('menu')).not.toBeNull();
  });

  it('moves focus with arrows, Home and End', () => {
    const { trigger } = setup();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const menu = screen.getByRole('menu');

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Edit' }));
    fireEvent.keyDown(menu, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Delete' }));
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'View' }));
  });

  it('closes on Escape and returns focus to the trigger', () => {
    const { trigger } = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('consumes the Escape that closes it', () => {
    const outer = vi.fn();
    const listen = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') outer();
    };
    document.addEventListener('keydown', listen);
    const { trigger } = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(outer).not.toHaveBeenCalled();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(outer).not.toHaveBeenCalled();
    document.removeEventListener('keydown', listen);
  });

  it('calls the item handler and closes', () => {
    const { trigger, onPick } = setup();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.click(screen.getByRole('menuitem', { name: 'View' }));
    expect(onPick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

describe('DropdownMenuItem classes', () => {
  it('renders the default variant as a dense 28 px row', () => {
    render(<DropdownMenuItem>View</DropdownMenuItem>);
    const cls = screen.getByRole('menuitem').className;
    for (const c of [
      'h-7',
      'rounded-md',
      'focus-ring',
      'text-popover-foreground',
      'hover:bg-accent',
    ]) {
      expect(cls).toContain(c);
    }
  });

  it('renders the destructive variant and merges className last', () => {
    render(
      <DropdownMenuItem variant="destructive" className="mt-4">
        Delete
      </DropdownMenuItem>
    );
    const cls = screen.getByRole('menuitem').className;
    expect(cls).toContain('text-destructive');
    expect(cls).not.toContain('text-popover-foreground');
    expect(cls.endsWith('mt-4')).toBe(true);
  });

  it('renders the separator and a small uppercase label and spreads props', () => {
    render(
      <>
        <DropdownMenuSeparator className="mt-4" id="sep" />
        <DropdownMenuLabel className="mt-4">L</DropdownMenuLabel>
      </>
    );
    expect(screen.getByRole('separator').className).toContain('h-px');
    expect(screen.getByRole('separator').id).toBe('sep');
    const label = screen.getByText('L').className;
    expect(label).toContain('uppercase');
    expect(label.endsWith('mt-4')).toBe(true);
  });
});
