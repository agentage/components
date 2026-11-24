import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ContextMenu, ContextMenuItem } from './context-menu';
import { DropdownMenu, DropdownMenuItem } from './dropdown-menu';
import { Modal } from './modal';
import { Sheet } from './sheet';

describe('dialog names and close', () => {
  it('names a Modal from aria-label when it has no title', () => {
    render(
      <Modal open onOpenChange={() => {}} aria-label="Settings">
        Body
      </Modal>
    );
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
  });

  it('gives a Sheet without a title a close button', () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open onOpenChange={onOpenChange} aria-label="Filters">
        Body
      </Sheet>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('controlled menus', () => {
  it('opens and closes a DropdownMenu from its open prop', () => {
    const { rerender } = render(
      <DropdownMenu open trigger={<button type="button">More</button>}>
        <DropdownMenuItem>Rename</DropdownMenuItem>
      </DropdownMenu>
    );
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeTruthy();
    rerender(
      <DropdownMenu open={false} trigger={<button type="button">More</button>}>
        <DropdownMenuItem>Rename</DropdownMenuItem>
      </DropdownMenu>
    );
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('reports a trigger click to onOpenChange while controlled', () => {
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu
        open={false}
        onOpenChange={onOpenChange}
        trigger={<button type="button">More</button>}
      >
        <DropdownMenuItem>Rename</DropdownMenuItem>
      </DropdownMenu>
    );
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes a ContextMenu when open turns false and keeps focus while the parent rerenders', () => {
    const Harness = ({ open }: { open?: boolean }) => {
      const [, setTick] = useState(0);
      return (
        <ContextMenu
          open={open}
          onOpenChange={() => setTick((t) => t + 1)}
          trigger={<div>Target</div>}
        >
          <ContextMenuItem>One</ContextMenuItem>
          <ContextMenuItem>Two</ContextMenuItem>
        </ContextMenu>
      );
    };
    const { rerender } = render(<Harness />);
    fireEvent.contextMenu(screen.getByText('Target'));
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect(document.activeElement?.textContent).toBe('Two');
    rerender(<Harness />);
    expect(document.activeElement?.textContent).toBe('Two');
    rerender(<Harness open={false} />);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

describe('menu Tab', () => {
  it('closes the menu and moves on from the trigger', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DropdownMenu trigger={<button type="button">More</button>}>
          <DropdownMenuItem>Rename</DropdownMenuItem>
        </DropdownMenu>
        <button type="button">Next</button>
      </>
    );
    await user.click(screen.getByRole('button', { name: 'More' }));
    expect(document.activeElement?.getAttribute('role')).toBe('menuitem');
    await act(async () => {
      await user.tab();
    });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Next' }));
  });
});
