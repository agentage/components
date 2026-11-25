'use client';

import * as React from 'react';
import { SelectItem } from './select.parts';
import type { SelectOption } from './select';

export interface SelectSearchProps {
  value: string;
  label: string;
  listId: string;
  activeId?: string;
  onChange: (value: string) => void;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

export const SelectSearch = React.forwardRef<HTMLInputElement, SelectSearchProps>(
  ({ value, label, listId, activeId, onChange, onKeyDown }, ref) => (
    <div className="px-2.5 py-2">
      <input
        ref={ref}
        type="text"
        role="combobox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={label}
        aria-label={label}
        aria-expanded
        aria-autocomplete="list"
        aria-controls={listId}
        aria-activedescendant={activeId}
        className="w-full bg-transparent text-ui text-foreground focus-ring placeholder:text-muted-foreground"
      />
    </div>
  )
);
SelectSearch.displayName = 'SelectSearch';

export interface SelectListProps {
  id: string;
  options: SelectOption[];
  value?: string;
  activeIndex: number;
  optionId: (index: number) => string;
  emptyLabel: string;
  onPick: (option: SelectOption) => void;
  /** A plain list takes focus and the keys itself; with a search box the input does. */
  focusable: boolean;
  label: string;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
}

export const SelectList = React.forwardRef<HTMLDivElement, SelectListProps>(
  (
    { id, options, value, activeIndex, optionId, emptyLabel, onPick, focusable, label, onKeyDown },
    ref
  ) => (
    <div className="max-h-50 overflow-y-auto border-border [&:not(:first-child)]:border-t">
      {/* The empty message sits beside the listbox: a listbox may only own options. */}
      <div
        ref={ref}
        id={id}
        role="listbox"
        tabIndex={focusable ? -1 : undefined}
        aria-label={focusable ? label : undefined}
        aria-activedescendant={focusable && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        onKeyDown={focusable ? onKeyDown : undefined}
        className="p-1 outline-none empty:hidden"
      >
        {options.map((option, index) => (
          <SelectItem
            key={option.value}
            id={optionId(index)}
            option={option}
            active={index === activeIndex}
            selected={option.value === value}
            onPick={() => onPick(option)}
          />
        ))}
      </div>
      <div
        aria-live="polite"
        className={
          options.length === 0 ? 'py-4 text-center text-ui text-muted-foreground' : 'sr-only'
        }
      >
        {options.length === 0 ? emptyLabel : ''}
      </div>
    </div>
  )
);
SelectList.displayName = 'SelectList';
