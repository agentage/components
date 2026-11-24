'use client';

import * as React from 'react';
import { activeFilterCount } from '../lib/list-controls';
import { cn } from '../lib/utils';
import { Badge } from './badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './dropdown-menu';
import type { ListFilterGroup } from './list-toolbar';
import { ListToolbarIcons } from './list-toolbar.icons';
import { toolbarButtonVariants } from './list-toolbar.variants';

export interface FilterMenuProps {
  groups: ListFilterGroup[];
  value: Record<string, string[]>;
  onToggle: (group: string, value: string) => void;
  onClear: () => void;
  label?: string;
  clearLabel?: string;
  className?: string;
}

/** Filter button with the active count; a menu of groups with multi-select items and Clear all. */
/** The ref and `className` land on the trigger button. */
export const FilterMenu = React.forwardRef<HTMLButtonElement, FilterMenuProps>(
  (
    {
      groups,
      value,
      onToggle,
      onClear,
      label = 'Filter',
      clearLabel = 'Clear all filters',
      className,
    },
    ref
  ) => {
    const count = activeFilterCount(value);
    return (
      <DropdownMenu
        align="start"
        aria-label={label}
        className="max-h-[min(460px,72vh)] overflow-auto"
        trigger={
          <button
            ref={ref}
            type="button"
            className={cn(
              toolbarButtonVariants(),
              'group-data-[fit-labels]/list-toolbar:px-1.5',
              className
            )}
            data-slot="filter-menu-trigger"
          >
            {ListToolbarIcons.filter}
            <span className="group-data-[fit-labels]/list-toolbar:sr-only">{label}</span>
            <Badge count={count} />
            {count > 0 && <span className="sr-only"> active</span>}
          </button>
        }
      >
        {groups.map((group, index) => (
          <div key={group.id} role="group" aria-label={group.label}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel aria-hidden="true">{group.label}</DropdownMenuLabel>
            {group.options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                icon={option.icon}
                meta={option.count}
                checked={value[group.id]?.includes(option.value) ?? false}
                onCheckedChange={() => onToggle(group.id, option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onClear} disabled={count === 0}>
          {clearLabel}
        </DropdownMenuItem>
      </DropdownMenu>
    );
  }
);
FilterMenu.displayName = 'FilterMenu';
