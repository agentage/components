'use client';

import * as React from 'react';
import { ComboboxItem, ComboboxTrigger, splitField } from './combobox.parts';
import { comboboxTriggerVariants } from './combobox.variants';
import { nextListIndex } from '../lib/list-navigation';
import { OverlayLayerProvider, useOverlayLayer } from '../lib/overlay-layer';
import { useAnchorPosition } from '../lib/use-anchor-position';
import { useControlled } from '../lib/use-controlled';
import { cn } from '../lib/utils';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface ComboboxProps extends React.HTMLAttributes<HTMLDivElement> {
  options: ComboboxOption[];
  value?: string;
  /** Uncontrolled start value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  error?: boolean;
  /** Trigger height: `md` 30 px (default), `sm` 26 px. */
  size?: 'sm' | 'md';
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>((allProps, ref) => {
  const {
    options,
    value: valueProp,
    defaultValue,
    onValueChange,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyMessage = 'No results found.',
    disabled = false,
    error = false,
    size = 'md',
    className,
    ...rest
  } = allProps;
  const [field, props] = splitField(rest);
  // `value={undefined}` from a form reset means empty, as in 0.20, not a switch to uncontrolled.
  const controlled = Object.prototype.hasOwnProperty.call(allProps, 'value');
  const [inner, setValue] = useControlled<string | undefined>(valueProp, defaultValue, (v) =>
    v === undefined ? undefined : onValueChange?.(v)
  );
  const value = controlled ? valueProp : inner;
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();
  const [width, setWidth] = React.useState<number>();
  const { top, left } = useAnchorPosition(rootRef, surfaceRef, open, {
    align: 'start',
    offset: 4,
  });
  React.useLayoutEffect(() => {
    if (open) setWidth(rootRef.current?.offsetWidth);
  }, [open]);

  const selectedOption = options.find((o) => o.value === value);
  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
  const optionId = (index: number): string => `${listId}-opt-${String(index)}`;

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);
  const close = (restore: boolean): void => {
    setOpen(false);
    if (restore) triggerRef.current?.focus();
  };
  const layer = useOverlayLayer(open, {
    refs: [rootRef],
    onEscape: () => close(true),
    onOutside: () => close(false),
  });

  React.useEffect(() => {
    if (!open) return;
    setSearch('');
    setActiveIndex(-1);
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    if (open && activeIndex >= 0)
      document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- optionId is derived from a stable id
  }, [open, activeIndex]);

  const select = (option: ComboboxOption): void => {
    setValue(option.value);
    close(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing || activeIndex < 0 || activeIndex >= filtered.length) return;
      e.preventDefault();
      select(filtered[activeIndex]);
      return;
    }
    const next = nextListIndex(e.key, activeIndex, filtered.length, false);
    if (next === null) return;
    e.preventDefault();
    setActiveIndex(next);
  };

  return (
    <div
      ref={rootRef}
      className={cn('relative', className)}
      data-slot="combobox"
      {...props}
      onBlur={(e) => {
        props.onBlur?.(e);
        if (open && !rootRef.current?.contains(e.relatedTarget as Node | null)) close(false);
      }}
    >
      <ComboboxTrigger
        ref={triggerRef}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        open={open}
        listId={listId}
        field={field}
        invalid={error}
        placeholder={placeholder}
        className={cn(
          comboboxTriggerVariants({
            size,
            disabled,
            placeholder: !selectedOption,
            error,
          })
        )}
      >
        {selectedOption?.label ?? placeholder}
      </ComboboxTrigger>
      {open && (
        <OverlayLayerProvider layer={layer}>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keeps focus in the search field on a scrollbar or padding press */}
          <div
            ref={surfaceRef}
            onMouseDown={(e) => {
              if (e.target !== inputRef.current) e.preventDefault();
            }}
            style={{ position: 'fixed', top, left, width }}
            className="z-[var(--z-dropdown,100)] rounded-lg border border-border bg-popover shadow-[var(--shadow-popover)] motion-safe:animate-menu-in"
            data-slot="combobox-content"
          >
            <div className="px-2.5 py-2">
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                aria-expanded
                aria-autocomplete="list"
                aria-controls={listId}
                aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
                className="w-full bg-transparent text-ui text-foreground focus-ring placeholder:text-muted-foreground"
              />
            </div>
            <div className="max-h-50 overflow-y-auto border-t border-border">
              {/* The empty message sits beside the listbox: a listbox may only own options. */}
              <div id={listId} role="listbox" className="p-1 empty:hidden">
                {filtered.map((option, index) => (
                  <ComboboxItem
                    key={option.value}
                    id={optionId(index)}
                    option={option}
                    active={index === activeIndex}
                    selected={option.value === value}
                    onPick={() => select(option)}
                  />
                ))}
              </div>
              <div
                aria-live="polite"
                className={
                  filtered.length === 0
                    ? 'py-4 text-center text-ui text-muted-foreground'
                    : 'sr-only'
                }
              >
                {filtered.length === 0 ? emptyMessage : ''}
              </div>
            </div>
          </div>
        </OverlayLayerProvider>
      )}
    </div>
  );
});
Combobox.displayName = 'Combobox';
