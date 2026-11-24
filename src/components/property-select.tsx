'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Badge } from './badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './dropdown-menu';
import { PropertyValue, usePropertyLabel } from './description-list.property';

export interface PropertyOption {
  value: string;
  label: string;
  /** Glyph, icon, avatar or colour dot shown before the label, in the menu and the value. */
  icon?: React.ReactNode;
}

export interface PropertySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: PropertyOption[];
  disabled?: boolean;
  /** Classes of the value button. */
  className?: string;
}

const MENU = 'max-h-[min(420px,70vh)] overflow-auto';

/** Single choice: a menu of options with a check on the current one; closes on pick. */
export const PropertySelect = React.forwardRef<HTMLButtonElement, PropertySelectProps>(
  ({ value, onValueChange, options, disabled, className }, ref) => {
    const label = usePropertyLabel();
    const current = options.find((o) => o.value === value);
    return (
      <DropdownMenu
        align="start"
        aria-label={label}
        className={MENU}
        trigger={
          <PropertyValue
            ref={ref}
            valueText={current?.label ?? 'None'}
            disabled={disabled}
            className={className}
          >
            {current?.icon}
            <span className="truncate">{current?.label ?? 'None'}</span>
          </PropertyValue>
        }
      >
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value} icon={o.icon} closeOnClick>
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenu>
    );
  }
);
PropertySelect.displayName = 'PropertySelect';

export interface PropertyMultiSelectProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  options: PropertyOption[];
  /** Shown when nothing is picked, for example "Add label". */
  placeholder?: string;
  className?: string;
}

/** Several choices: checkbox items that keep the menu open; the value shows as 20 px chips. */
export const PropertyMultiSelect = React.forwardRef<HTMLButtonElement, PropertyMultiSelectProps>(
  ({ value, onValueChange, options, placeholder = 'Add', className }, ref) => {
    const label = usePropertyLabel();
    const picked = options.filter((o) => value.includes(o.value));
    const text = picked.length ? picked.map((o) => o.label).join(', ') : 'none';
    return (
      <DropdownMenu
        align="start"
        aria-label={label}
        className={MENU}
        trigger={
          <PropertyValue
            ref={ref}
            valueText={text}
            className={cn('h-auto min-h-6 flex-wrap py-0.5', className)}
          >
            {picked.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {picked.map((o) => (
              <Badge
                key={o.value}
                variant="outline-muted"
                className="[&_svg]:size-3"
                data-slot="property-chip"
              >
                {o.icon}
                {o.label}
              </Badge>
            ))}
          </PropertyValue>
        }
      >
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        {options.map((o) => (
          <DropdownMenuCheckboxItem
            key={o.value}
            icon={o.icon}
            checked={value.includes(o.value)}
            onCheckedChange={(on) =>
              onValueChange(on ? [...value, o.value] : value.filter((v) => v !== o.value))
            }
          >
            {o.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenu>
    );
  }
);
PropertyMultiSelect.displayName = 'PropertyMultiSelect';
