'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { ToolbarFitContext } from './list-toolbar.fit';
import { ListToolbarIcons } from './list-toolbar.icons';
import { toolbarIconButtonVariants, toolbarSearchVariants } from './list-toolbar.variants';

export interface ToolbarSearchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  value: string;
  onValueChange: (value: string) => void;
}

// Opened from the folded button, the field covers the row, so nothing beside it moves.
const OVERLAY = [
  'group-data-[fit-search]/list-toolbar:absolute group-data-[fit-search]/list-toolbar:inset-0',
  'group-data-[fit-search]/list-toolbar:z-10 group-data-[fit-search]/list-toolbar:flex',
  'group-data-[fit-search]/list-toolbar:items-center group-data-[fit-search]/list-toolbar:px-4',
  'group-data-[fit-search]/list-toolbar:bg-background',
];

/** Filter by name. Escape clears a non-empty query; in a narrow toolbar it folds to a button. */
export const ToolbarSearch = React.forwardRef<HTMLInputElement, ToolbarSearchProps>(
  (
    { value, onValueChange, className, onKeyDown, onBlur, placeholder = 'Search', ...props },
    ref
  ) => {
    const fit = React.useContext(ToolbarFitContext);
    const [open, setOpen] = React.useState(false);
    const input = React.useRef<HTMLInputElement>(null);
    const button = React.useRef<HTMLButtonElement>(null);
    const returnFocus = React.useRef(false);
    React.useImperativeHandle(ref, () => input.current as HTMLInputElement);
    React.useLayoutEffect(() => {
      if (open) input.current?.focus();
      else if (returnFocus.current) button.current?.focus();
      returnFocus.current = false;
    }, [open]);
    const name = props['aria-label'] ?? placeholder;
    const field = (
      <input
        ref={input}
        type="search"
        autoComplete="off"
        aria-label={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key !== 'Escape' || (!value && !open)) return;
          e.stopPropagation();
          if (value) onValueChange('');
          else {
            returnFocus.current = true;
            setOpen(false);
          }
        }}
        onBlur={(e) => {
          onBlur?.(e);
          setOpen(false);
        }}
        className={cn(
          toolbarSearchVariants(),
          fit && 'group-data-[fit-search]/list-toolbar:max-w-none',
          className
        )}
        data-slot="toolbar-search"
        {...props}
      />
    );
    if (!fit) return field;
    return (
      <>
        <button
          ref={button}
          type="button"
          aria-label={value ? `${name}: ${value}` : name}
          title={value ? `${name}: ${value}` : name}
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={cn(
            toolbarIconButtonVariants(),
            'hidden flex-none group-data-[fit-search]/list-toolbar:inline-flex',
            value && 'bg-accent text-foreground'
          )}
          data-fit-show="search"
          data-slot="toolbar-search-toggle"
        >
          {ListToolbarIcons.search}
        </button>
        <span
          className={cn('contents', open ? OVERLAY : 'group-data-[fit-search]/list-toolbar:hidden')}
        >
          {field}
        </span>
      </>
    );
  }
);
ToolbarSearch.displayName = 'ToolbarSearch';
