'use client';

import * as React from 'react';
import { OverlayLayerProvider, useOverlayLayer } from '../lib/overlay-layer';
import { useAnchorPosition } from '../lib/use-anchor-position';
import { useControlled } from '../lib/use-controlled';
import { cn } from '../lib/utils';
import { nextEnabled, useTypeAhead } from './select.keys';
import { SelectList, SelectSearch } from './select.list';
import { SelectTrigger, splitField } from './select.parts';
import { selectTriggerVariants } from './select.variants';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  options: SelectOption[];
  value?: string;
  /** Uncontrolled start value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Adds a search box that filters the options by label. */
  searchable?: boolean;
  disabled?: boolean;
  error?: boolean;
  /** Trigger height: `md` 30 px (default), `sm` 26 px. */
  size?: 'sm' | 'md';
  /** Texts for the search box placeholder and the empty message. */
  labels?: { search?: string; empty?: string };
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>((allProps, ref) => {
  const {
    options,
    value: valueProp,
    defaultValue,
    onValueChange,
    placeholder = 'Select...',
    searchable = false,
    disabled = false,
    error = false,
    size = 'md',
    labels,
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
  const listRef = React.useRef<HTMLDivElement>(null);
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();
  const [width, setWidth] = React.useState<number>();
  const { top, left } = useAnchorPosition(rootRef, surfaceRef, open, { align: 'start', offset: 4 });
  React.useLayoutEffect(() => setWidth(rootRef.current?.offsetWidth), [open]);

  const selectedOption = options.find((o) => o.value === value);
  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
  const optionId = (i: number): string => `${listId}-opt-${String(i)}`;
  const typeAhead = useTypeAhead(filtered);

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
    setActiveIndex(searchable ? -1 : options.findIndex((o) => o.value === value));
    const t = setTimeout(() => (searchable ? inputRef : listRef).current?.focus(), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the open edge resets the list
  }, [open]);

  React.useEffect(() => {
    if (open && activeIndex >= 0)
      document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- optionId is derived from a stable id
  }, [open, activeIndex]);

  const select = (option: SelectOption): void => {
    if (!option.disabled) setValue(option.value);
    if (!option.disabled) close(true);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
    if (e.key === 'Enter' || (e.key === ' ' && !searchable)) {
      if (e.nativeEvent.isComposing || activeIndex < 0 || activeIndex >= filtered.length) return;
      e.preventDefault();
      select(filtered[activeIndex]);
      return;
    }
    const next = nextEnabled(e.key, activeIndex, filtered);
    if (next !== null) {
      e.preventDefault();
      setActiveIndex(next);
    } else if (!searchable && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const hit = typeAhead(e.key, activeIndex);
      if (hit >= 0) setActiveIndex(hit);
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn('relative flex', className)}
      data-slot="select"
      {...props}
      onBlur={(e) => {
        props.onBlur?.(e);
        if (open && !rootRef.current?.contains(e.relatedTarget as Node | null)) close(false);
      }}
    >
      <SelectTrigger
        ref={triggerRef}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
          e.preventDefault();
          setOpen(true);
        }}
        open={open}
        listId={listId}
        field={field}
        invalid={error}
        placeholder={placeholder}
        empty={!selectedOption}
        className={cn(selectTriggerVariants({ size, error }))}
      >
        {selectedOption?.label ?? placeholder}
      </SelectTrigger>
      {open && (
        <OverlayLayerProvider layer={layer}>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keeps focus in the search field or list on a scrollbar or padding press */}
          <div
            ref={surfaceRef}
            onMouseDown={(e) => {
              if (e.target !== inputRef.current) e.preventDefault();
            }}
            style={{ position: 'fixed', top, left, width }}
            className="z-[var(--z-dropdown,100)] rounded-lg border border-border bg-popover shadow-[var(--shadow-popover)] motion-safe:animate-menu-in"
            data-slot="select-content"
          >
            {searchable && (
              <SelectSearch
                ref={inputRef}
                value={search}
                label={labels?.search ?? 'Search...'}
                listId={listId}
                activeId={activeIndex >= 0 ? optionId(activeIndex) : undefined}
                onChange={(v) => {
                  setSearch(v);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleKeyDown}
              />
            )}
            <SelectList
              ref={listRef}
              id={listId}
              options={filtered}
              value={value}
              activeIndex={activeIndex}
              optionId={optionId}
              emptyLabel={labels?.empty ?? 'No results found.'}
              onPick={select}
              focusable={!searchable}
              label={field['aria-label'] ?? placeholder}
              onKeyDown={handleKeyDown}
            />
          </div>
        </OverlayLayerProvider>
      )}
    </div>
  );
});
Select.displayName = 'Select';
