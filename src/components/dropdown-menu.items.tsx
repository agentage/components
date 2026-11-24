'use client';

import {
  MenuItem,
  MenuLabel,
  MenuSeparator,
  type MenuItemProps,
  type MenuLabelProps,
  type MenuSeparatorProps,
} from './menu.parts';
import {
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  type MenuCheckboxItemProps,
  type MenuRadioGroupProps,
  type MenuRadioItemProps,
} from './menu.selectable';

export type DropdownMenuItemProps = MenuItemProps;

export const DropdownMenuItem = (props: DropdownMenuItemProps): React.JSX.Element => (
  <MenuItem data-slot="dropdown-menu-item" {...props} />
);

export type DropdownMenuSeparatorProps = MenuSeparatorProps;

export const DropdownMenuSeparator = (props: DropdownMenuSeparatorProps): React.JSX.Element => (
  <MenuSeparator data-slot="dropdown-menu-separator" {...props} />
);

export type DropdownMenuLabelProps = MenuLabelProps;

export const DropdownMenuLabel = (props: DropdownMenuLabelProps): React.JSX.Element => (
  <MenuLabel data-slot="dropdown-menu-label" {...props} />
);

export type DropdownMenuCheckboxItemProps = MenuCheckboxItemProps;

export const DropdownMenuCheckboxItem = (
  props: DropdownMenuCheckboxItemProps
): React.JSX.Element => <MenuCheckboxItem data-slot="dropdown-menu-checkbox-item" {...props} />;

export type DropdownMenuRadioGroupProps = MenuRadioGroupProps;

export const DropdownMenuRadioGroup = (props: DropdownMenuRadioGroupProps): React.JSX.Element => (
  <MenuRadioGroup data-slot="dropdown-menu-radio-group" {...props} />
);

export type DropdownMenuRadioItemProps = MenuRadioItemProps;

export const DropdownMenuRadioItem = (props: DropdownMenuRadioItemProps): React.JSX.Element => (
  <MenuRadioItem data-slot="dropdown-menu-radio-item" {...props} />
);
