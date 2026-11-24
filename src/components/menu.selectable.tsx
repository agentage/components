'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { MenuItem, type MenuItemProps } from './menu.parts';

const CheckMark = ({ on }: { on: boolean }): React.JSX.Element => (
  <svg
    viewBox="0 0 24 24"
    className={cn(
      'ml-auto size-4 shrink-0 fill-none stroke-current stroke-2 text-primary',
      !on && 'invisible'
    )}
    aria-hidden="true"
    data-slot="menu-check"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SelectableItem = ({
  role,
  checked,
  className,
  children,
  closeOnClick = false,
  icon,
  meta,
  ...props
}: MenuItemProps & {
  role: string;
  checked: boolean;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
}) => (
  <MenuItem
    role={role}
    aria-checked={checked}
    closeOnClick={closeOnClick}
    className={cn('justify-start', className)}
    icon={icon}
    {...props}
  >
    <span className="min-w-0 flex-1 truncate text-left">{children}</span>
    {meta !== undefined && (
      <span className="shrink-0 text-xs text-muted-foreground" data-slot="menu-meta">
        {meta}
      </span>
    )}
    <CheckMark on={checked} />
  </MenuItem>
);

export interface MenuCheckboxItemProps extends Omit<MenuItemProps, 'role'> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Leading glyph, for example a status icon. */
  icon?: React.ReactNode;
  /** Quiet trailing text before the check mark, for example a count. */
  meta?: React.ReactNode;
}

/** `role="menuitemcheckbox"`: toggles without closing the menu unless `closeOnClick`. */
export const MenuCheckboxItem = ({
  checked,
  onCheckedChange,
  onClick,
  ...props
}: MenuCheckboxItemProps): React.JSX.Element => (
  <SelectableItem
    role="menuitemcheckbox"
    checked={checked}
    data-slot="menu-checkbox-item"
    onClick={(e) => {
      onClick?.(e);
      onCheckedChange?.(!checked);
    }}
    {...props}
  />
);

const RadioContext = React.createContext<{ value?: string; onValueChange?: (v: string) => void }>(
  {}
);

export interface MenuRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const MenuRadioGroup = ({
  value,
  onValueChange,
  ...props
}: MenuRadioGroupProps): React.JSX.Element => (
  <RadioContext.Provider value={{ value, onValueChange }}>
    <div role="group" data-slot="menu-radio-group" {...props} />
  </RadioContext.Provider>
);

export interface MenuRadioItemProps extends Omit<MenuItemProps, 'role' | 'value'> {
  value: string;
  icon?: React.ReactNode;
}

/** `role="menuitemradio"` inside a `MenuRadioGroup`; keeps the menu open by default. */
export const MenuRadioItem = ({
  value,
  onClick,
  ...props
}: MenuRadioItemProps): React.JSX.Element => {
  const group = React.useContext(RadioContext);
  return (
    <SelectableItem
      role="menuitemradio"
      checked={group.value === value}
      data-slot="menu-radio-item"
      onClick={(e) => {
        onClick?.(e);
        group.onValueChange?.(value);
      }}
      {...props}
    />
  );
};
