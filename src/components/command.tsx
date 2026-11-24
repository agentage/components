'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';
import { DialogBackdrop, DialogPortal, useDialogShell } from './dialog-shell';
import { OverlayLayerProvider } from '../lib/overlay-layer';
import { Kbd } from './kbd';
import { CommandContext } from './command.context';
import { commandContentVariants } from './command.variants';

export { commandContentVariants, commandItemVariants } from './command.variants';

const SearchIcon = (): React.JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    data-slot="command-search-icon"
    className="command-search-icon shrink-0 text-muted-foreground"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  children: ReactNode;
  /** Accessible name for the search input. */
  'aria-label'?: string;
  /** Accessible name for the palette dialog. */
  dialogLabel?: string;
  /** Spread onto the search input - id, data-testid, autoComplete, etc. */
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'type' | 'role'
  >;
  /** Ref to the search input. */
  inputRef?: React.Ref<HTMLInputElement>;
}

export const Command = ({
  open,
  onOpenChange,
  placeholder = 'Type a command or search...',
  children,
  className,
  'aria-label': ariaLabel = 'Search',
  dialogLabel = 'Command palette',
  inputProps,
  inputRef: externalInputRef,
  ...props
}: CommandProps): React.JSX.Element | null => {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listId = `${useId()}-list`;
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const { mounted, layer } = useDialogShell(dialogRef, open, close);

  const register = useCallback((id: string, text: string) => {
    setItems((prev) => [...prev.filter((item) => item.id !== id), { id, text }]);
    return (): void => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    };
  }, []);

  const query = search.trim().toLowerCase();
  const matches = items.filter((item) => item.text.includes(query)).map((item) => item.id);
  // Registration order drifts from the DOM when items mount late or rename; arrows follow the DOM.
  const ordered = (): string[] =>
    [...matches].sort((a, b) => {
      const na = document.getElementById(a);
      const nb = document.getElementById(b);
      if (!na || !nb) return 0;
      return na.compareDocumentPosition(nb) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

  useEffect(() => {
    if (open) setSearch('');
  }, [open]);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (!activeId || !matches.includes(activeId)) setActiveId(ordered()[0] ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ordered reads the same matches
  }, [activeId, matches]);

  useEffect(() => {
    if (!activeId) return;
    document.getElementById(activeId)?.scrollIntoView?.({ block: 'nearest' });
  }, [activeId]);

  const move = (delta: number): void => {
    const list = ordered();
    if (list.length === 0) return;
    const current = activeId ? list.indexOf(activeId) : -1;
    setActiveId(list[(current + delta + list.length) % list.length]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowDown') move(1);
    else if (e.key === 'ArrowUp') move(-1);
    else if (e.key === 'Home') setActiveId(ordered()[0] ?? null);
    else if (e.key === 'End') setActiveId(ordered().at(-1) ?? null);
    else if (e.key === 'Enter' && activeId && !e.nativeEvent.isComposing)
      document.getElementById(activeId)?.click();
    else return;
    e.preventDefault();
  };

  if (!open || !mounted) return null;

  return (
    <DialogPortal>
      <CommandContext.Provider
        value={{
          query,
          activeId,
          setActiveId,
          matchCount: matches.length,
          ready,
          isMatch: (id) => matches.includes(id),
          register,
        }}
      >
        <OverlayLayerProvider layer={layer}>
          <div
            className="fixed inset-0 z-[var(--z-overlay,50)] flex items-start justify-center pt-[20vh]"
            data-slot="command"
          >
            <DialogBackdrop layer={layer} onClick={close} />
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={dialogLabel}
              className={cn(commandContentVariants(), className)}
              data-slot="command-content"
              {...props}
            >
              <div className="flex h-10 items-center gap-2 border-b border-border px-3">
                <SearchIcon />
                <input
                  {...inputProps}
                  ref={externalInputRef}
                  type="text"
                  role="combobox"
                  aria-label={ariaLabel}
                  aria-expanded
                  aria-autocomplete="list"
                  aria-controls={listId}
                  aria-activedescendant={activeId ?? undefined}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    inputProps?.onKeyDown?.(e);
                    if (!e.defaultPrevented) handleKeyDown(e);
                  }}
                  placeholder={inputProps?.placeholder ?? placeholder}
                  data-slot="command-input"
                  className={cn(
                    'h-7.5 min-w-0 flex-1 bg-transparent text-ui text-foreground outline-none placeholder:text-muted-foreground',
                    inputProps?.className
                  )}
                />
                <Kbd className="hidden sm:inline-flex">Esc</Kbd>
              </div>
              <div id={listId} role="listbox" className="max-h-80 overflow-y-auto p-1.5">
                {children}
              </div>
            </div>
          </div>
        </OverlayLayerProvider>
      </CommandContext.Provider>
    </DialogPortal>
  );
};
export { CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from './command.parts';
export type { CommandGroupProps, CommandItemProps } from './command.parts';
