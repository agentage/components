'use client';

import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { nextListIndex } from '../lib/list-navigation';
import { isTopLayer, type OverlayLayer } from '../lib/overlay-layer';
import { cn } from '../lib/utils';
import { menuItemVariants, menuLabelVariants } from './menu.variants';

/** `sm` is the menu; `md` is the deprecated pre-0.21 size. */
export type MenuSize = 'sm' | 'md';

/** Shared by every menu surface (dropdown, context) so items can close their own menu. */
export const MenuCloseContext = React.createContext<{
  close: () => void;
  size?: MenuSize;
  closeOnSelect?: boolean;
}>({ close: () => {} });

export const MENU_ITEM_SELECTOR = ['menuitem', 'menuitemcheckbox', 'menuitemradio']
  .map((role) => `[role="${role}"]:not(:disabled)`)
  .join(', ');

export const menuItems = (menu: HTMLElement | null): HTMLElement[] =>
  Array.from(menu?.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR) ?? []);

export const focusMenuItem = (menu: HTMLElement | null, index: number): void => {
  const items = menuItems(menu);
  if (items.length === 0) return;
  items[((index % items.length) + items.length) % items.length].focus();
};

/** Arrow / Home / End move focus inside the surface; Escape and Tab dismiss it. */
export const handleMenuKeyDown = (
  e: React.KeyboardEvent<HTMLElement>,
  close: () => void,
  layer?: OverlayLayer
): void => {
  const items = menuItems(e.currentTarget);
  const current = items.indexOf(document.activeElement as HTMLElement);

  if (e.key === 'Escape') {
    // A child layer (a tooltip on an item) is on top: the shared stack closes that one first.
    if (layer && !isTopLayer(layer)) return;
    // The menu consumes the Escape that closes it, so an outer Escape handler does not also fire.
    e.preventDefault();
    e.stopPropagation();
    close();
  } else if (e.key === 'Tab') {
    // Focus goes back to the trigger first, so the default Tab moves on from there.
    close();
    return;
  } else {
    const next = nextListIndex(e.key, current, items.length, false);
    if (next === null) return;
    items[next].focus();
  }
  e.preventDefault();
};

export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof menuItemVariants> {
  /** Overrides the menu-level `closeOnSelect`. */
  closeOnClick?: boolean;
  /** Leading 16 px icon; items without one stay aligned with those that have one. */
  icon?: React.ReactNode;
}

export const MenuItem = ({
  className,
  variant,
  closeOnClick,
  onClick,
  icon,
  children,
  ...props
}: MenuItemProps): React.JSX.Element => {
  const { close, size, closeOnSelect = true } = React.useContext(MenuCloseContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    onClick?.(e);
    if (closeOnClick ?? closeOnSelect) close();
  };

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      onClick={handleClick}
      className={cn(menuItemVariants({ variant, size }), className)}
      data-slot="menu-item"
      {...props}
    >
      {icon && (
        <span
          className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4"
          aria-hidden="true"
          data-slot="menu-icon"
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};

export type MenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export const MenuSeparator = ({ className, ...props }: MenuSeparatorProps): React.JSX.Element => {
  const { size } = React.useContext(MenuCloseContext);
  return (
    <div
      className={cn('my-1 h-px bg-border', size === 'md' && '-mx-1', className)}
      role="separator"
      data-slot="menu-separator"
      {...props}
    />
  );
};

export type MenuLabelProps = React.HTMLAttributes<HTMLDivElement>;

export const MenuLabel = ({ className, ...props }: MenuLabelProps): React.JSX.Element => {
  const { size } = React.useContext(MenuCloseContext);
  return (
    <div className={cn(menuLabelVariants({ size }), className)} data-slot="menu-label" {...props} />
  );
};
