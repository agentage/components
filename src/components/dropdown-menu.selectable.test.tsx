import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './dropdown-menu';

const Checks = () => {
  const [on, setOn] = useState(false);
  const [sort, setSort] = useState('name');
  return (
    <DropdownMenu trigger={<button type="button">Open</button>}>
      <DropdownMenuLabel>Status</DropdownMenuLabel>
      <DropdownMenuCheckboxItem checked={on} onCheckedChange={setOn}>
        Paused
      </DropdownMenuCheckboxItem>
      <DropdownMenuRadioGroup aria-label="Sort" value={sort} onValueChange={setSort}>
        <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="next">Next update</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuItem>Close me</DropdownMenuItem>
    </DropdownMenu>
  );
};

describe('DropdownMenu selectable items', () => {
  it('toggles a checkbox item without closing the menu', () => {
    render(<Checks />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const item = screen.getByRole('menuitemcheckbox', { name: 'Paused' });
    expect(item.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(item);
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Paused' }).getAttribute('aria-checked')
    ).toBe('true');
  });

  it('selects one radio item in a group and keeps the menu open', () => {
    render(<Checks />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Next update' }));
    expect(
      screen.getByRole('menuitemradio', { name: 'Next update' }).getAttribute('aria-checked')
    ).toBe('true');
    expect(screen.getByRole('menuitemradio', { name: 'Name' }).getAttribute('aria-checked')).toBe(
      'false'
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Close me' }));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('moves with the arrow keys across checkbox, radio and plain items', () => {
    render(<Checks />);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Open' }), { key: 'ArrowDown' });
    // Like the prototype, the checked item takes focus first.
    expect(document.activeElement).toBe(screen.getByRole('menuitemradio', { name: 'Name' }));
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(screen.getByRole('menuitemcheckbox'));
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Close me' }));
  });

  it('renders the 28 px item and the 210 px surface', () => {
    render(<Checks />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('menu').className).toContain('min-w-52.5');
    expect(screen.getByRole('menuitem').className).toContain('h-7');
  });

  it('keeps plain items open with closeOnSelect false', () => {
    const onClick = vi.fn();
    render(
      <DropdownMenu closeOnSelect={false} trigger={<button type="button">Open</button>}>
        <DropdownMenuItem onClick={onClick}>Stay</DropdownMenuItem>
      </DropdownMenu>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('menuitem'));
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  it('focuses the first item on a click open and keeps text aligned beside icons', () => {
    render(
      <DropdownMenu trigger={<button type="button">More</button>}>
        <DropdownMenuItem icon={<svg />}>Copy link</DropdownMenuItem>
        <DropdownMenuItem>Reset sample data</DropdownMenuItem>
      </DropdownMenu>
    );
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Copy link' }));
    expect(document.querySelectorAll('[data-slot="menu-icon"]')).toHaveLength(1);
    expect(screen.getByRole('menu').className).toContain('min-w-52.5');
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'More' }));
  });
});
