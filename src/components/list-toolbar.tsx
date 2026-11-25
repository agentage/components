'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Chip } from './chip';
import { ToolbarFitContext, ToolbarMore, useFitItems, useToolbarFit } from './list-toolbar.fit';
import { listToolbarVariants } from './list-toolbar.variants';

export { ToolbarSearch } from './list-toolbar.search';
export type { ToolbarSearchProps } from './list-toolbar.search';

export { DisplayMenu, FilterMenu, ListToolbarIcons } from './list-toolbar.menus';
import { useRovingFocus } from '../lib/use-roving-focus';
export { ActiveFilters, ViewSwitch } from './list-toolbar.parts';
export type { ActiveFiltersProps, ViewSwitchOption, ViewSwitchProps } from './list-toolbar.parts';
export type { DisplayMenuProps, DisplayOption, FilterMenuProps } from './list-toolbar.menus';

export interface ListFilterOption {
  value: string;
  label: string;
  /** Leading glyph in the menu, for example a StatusGlyph. */
  icon?: React.ReactNode;
  /** Rows with this value under the other active controls; shown muted at the right. */
  count?: number;
}

export interface ListFilterGroup {
  id: string;
  label: string;
  options: ListFilterOption[];
}

// Plain buttons and chips rove; the search field, menus and radio groups keep their own keys.
const TOOLBAR_ITEMS = 'button:not(:disabled):not([role]), [data-slot="chip-body"][role="button"]';

export type ListToolbarProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * One 45 px row of list controls that never wraps. When it runs out of width, labels drop to
 * icons, the search folds to a button, and toggles move to a More menu. Trailing controls go in
 * `ListToolbarEnd`.
 */
export const ListToolbar = React.forwardRef<HTMLDivElement, ListToolbarProps>(
  ({ className, 'aria-label': ariaLabel, children, ...props }, ref) => {
    const inner = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => inner.current as HTMLDivElement);
    useRovingFocus(inner, { selector: TOOLBAR_ITEMS, orientation: 'horizontal' });
    useToolbarFit(inner, TOOLBAR_ITEMS);
    const [items, fit] = useFitItems();
    return (
      <ToolbarFitContext.Provider value={fit}>
        <div
          ref={inner}
          role="toolbar"
          aria-label={ariaLabel ?? 'List controls'}
          className={cn(listToolbarVariants(), className)}
          data-slot="list-toolbar"
          {...props}
        >
          {children}
          <ToolbarMore items={items} />
        </div>
      </ToolbarFitContext.Provider>
    );
  }
);
ListToolbar.displayName = 'ListToolbar';

export const ListToolbarEnd = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('ml-auto flex flex-none items-center gap-2', className)}
    data-slot="list-toolbar-end"
    {...props}
  />
));
ListToolbarEnd.displayName = 'ListToolbarEnd';

export interface ToolbarToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

/** A pressed-state chip, for example "Needs attention". */
export const ToolbarToggle = React.forwardRef<HTMLSpanElement, ToolbarToggleProps>(
  ({ pressed, onPressedChange, children, className }, ref) => {
    const fit = React.useContext(ToolbarFitContext);
    const id = React.useId();
    React.useLayoutEffect(() => {
      fit?.register({ id, label: children, pressed, onPressedChange });
    }, [fit, id, children, pressed, onPressedChange]);
    React.useLayoutEffect(() => () => fit?.unregister(id), [fit, id]);
    return (
      <Chip
        ref={ref}
        size="sm"
        pressed={pressed}
        onClick={() => onPressedChange(!pressed)}
        className={cn('flex-none', fit && 'group-data-[fit-menu]/list-toolbar:hidden', className)}
        data-fit-hide={fit ? 'menu' : undefined}
      >
        {children}
      </Chip>
    );
  }
);
ToolbarToggle.displayName = 'ToolbarToggle';
