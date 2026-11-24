'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Chip } from './chip';
import type { ListFilterGroup } from './list-toolbar';
import { ListToolbarIcons } from './list-toolbar.icons';
import { activeFilterChipVariants, activeFiltersVariants } from './list-toolbar.variants';
import { ToggleGroup } from './toggle-group';

const useOverflow = (ref: React.RefObject<HTMLDivElement | null>, deps: unknown) => {
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      el.dataset.overflow = String(el.scrollWidth > el.clientWidth + 1);
    };
    check();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, deps]);
};

export interface ActiveFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  groups: ListFilterGroup[];
  value: Record<string, string[]>;
  onRemove: (group: string, value: string) => void;
}

/** A removable chip per selected filter value, in group order. */
export const ActiveFilters = React.forwardRef<HTMLDivElement, ActiveFiltersProps>(
  ({ groups, value, onRemove, className, ...props }, forwarded) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(forwarded, () => ref.current as HTMLDivElement);
    const chips = groups.flatMap((g) =>
      g.options.filter((o) => value[g.id]?.includes(o.value)).map((o) => ({ group: g, option: o }))
    );
    useOverflow(ref, chips.length);
    return (
      <div
        ref={ref}
        className={cn(activeFiltersVariants(), className)}
        data-slot="active-filters"
        data-fit-hide="search"
        {...props}
      >
        {chips.map(({ group, option }) => (
          <Chip
            key={`${group.id}:${option.value}`}
            size="sm"
            className={activeFilterChipVariants()}
            onRemove={() => onRemove(group.id, option.value)}
            removeLabel={`Remove filter ${group.label}: ${option.label}`}
          >
            {group.label}: {option.label}
          </Chip>
        ))}
      </div>
    );
  }
);
ActiveFilters.displayName = 'ActiveFilters';

export interface ViewSwitchOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface ViewSwitchProps {
  value: string;
  onValueChange: (value: string) => void;
  /** Defaults to List and Cards; `board` has a built-in icon too. */
  options?: ViewSwitchOption[];
  'aria-label'?: string;
  className?: string;
}

const VIEW_ICONS: Record<string, React.ReactNode> = {
  ...ListToolbarIcons,
  table: ListToolbarIcons.list,
};

const DEFAULT_VIEWS: ViewSwitchOption[] = [
  { value: 'list', label: 'List view' },
  { value: 'cards', label: 'Cards view' },
];

/** View picker: a segmented icon-only `ToggleGroup`. */
export const ViewSwitch = React.forwardRef<HTMLDivElement, ViewSwitchProps>(
  (
    { value, onValueChange, options = DEFAULT_VIEWS, 'aria-label': ariaLabel = 'View', className },
    ref
  ) => (
    <ToggleGroup
      ref={ref}
      variant="segmented"
      value={value}
      onValueChange={onValueChange}
      aria-label={ariaLabel}
      className={cn('flex-none', className)}
      data-slot="view-switch"
      options={options.map((o) => ({ ...o, icon: o.icon ?? VIEW_ICONS[o.value], iconOnly: true }))}
    />
  )
);
ViewSwitch.displayName = 'ViewSwitch';
