'use client';

import * as React from 'react';
import type { ListSort } from '../lib/list-controls';
import { cn } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from './dropdown-menu';
import { ListToolbarIcons } from './list-toolbar.icons';
import { toolbarIconButtonVariants } from './list-toolbar.variants';

export { ListToolbarIcons } from './list-toolbar.icons';
export { FilterMenu } from './list-toolbar.filter';
export type { FilterMenuProps } from './list-toolbar.filter';

export interface DisplayOption {
  value: string;
  label: string;
}

export interface DisplayMenuProps {
  sortOptions?: DisplayOption[];
  sort?: ListSort | null;
  /** `null` when None is picked. */
  onSortChange?: (sort: ListSort | null) => void;
  /** "None" is always offered first. */
  groupOptions?: DisplayOption[];
  groupBy?: string | null;
  onGroupByChange?: (groupBy: string | null) => void;
  toggles?: DisplayOption[];
  flags?: Record<string, boolean>;
  onFlagChange?: (flag: string, on: boolean) => void;
  className?: string;
}

const NONE = '__none';

const SortSection = ({ sortOptions = [], sort, onSortChange }: DisplayMenuProps) => {
  const dir = sort?.dir ?? 'asc';
  return (
    <>
      <DropdownMenuLabel aria-hidden="true">Sort by</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        aria-label="Sort by"
        value={sort?.key ?? NONE}
        onValueChange={(key) => onSortChange?.(key === NONE ? null : { key, dir })}
      >
        <DropdownMenuRadioItem value={NONE}>None</DropdownMenuRadioItem>
        {sortOptions.map((o) => (
          <DropdownMenuRadioItem key={o.value} value={o.value}>
            {o.label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup
        aria-label="Direction"
        value={sort ? sort.dir : ''}
        onValueChange={(next) =>
          sort && onSortChange?.({ ...sort, dir: next === 'desc' ? 'desc' : 'asc' })
        }
      >
        <DropdownMenuRadioItem value="asc" disabled={!sort}>
          Ascending
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="desc" disabled={!sort}>
          Descending
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  );
};

/** Display options: Sort by and direction, Group by (None plus options), display toggles. */
export const DisplayMenu = React.forwardRef<HTMLButtonElement, DisplayMenuProps>((props, ref) => {
  const { groupOptions, groupBy, onGroupByChange, toggles, flags, onFlagChange } = props;
  const label = 'Display options';
  const sections = [
    props.sortOptions?.length ? <SortSection key="sort" {...props} /> : null,
    groupOptions?.length ? (
      <React.Fragment key="group">
        <DropdownMenuLabel aria-hidden="true">Group by</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          aria-label="Group by"
          value={groupBy ?? NONE}
          onValueChange={(v) => onGroupByChange?.(v === NONE ? null : v)}
        >
          <DropdownMenuRadioItem value={NONE}>None</DropdownMenuRadioItem>
          {groupOptions.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value}>
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </React.Fragment>
    ) : null,
    toggles?.length ? (
      <div key="toggles" role="group" aria-label="Show">
        <DropdownMenuLabel aria-hidden="true">Show</DropdownMenuLabel>
        {toggles.map((t) => (
          <DropdownMenuCheckboxItem
            key={t.value}
            checked={flags?.[t.value] ?? false}
            onCheckedChange={(on) => onFlagChange?.(t.value, on)}
          >
            {t.label}
          </DropdownMenuCheckboxItem>
        ))}
      </div>
    ) : null,
  ].filter(Boolean);

  return (
    <DropdownMenu
      aria-label={label}
      trigger={
        <button
          ref={ref}
          type="button"
          aria-label={label}
          title={label}
          className={cn(toolbarIconButtonVariants(), props.className)}
          data-slot="display-menu-trigger"
        >
          {ListToolbarIcons.display}
        </button>
      }
    >
      {sections.map((section, i) => (
        <React.Fragment key={i}>
          {i > 0 && <DropdownMenuSeparator />}
          {section}
        </React.Fragment>
      ))}
    </DropdownMenu>
  );
});
DisplayMenu.displayName = 'DisplayMenu';
