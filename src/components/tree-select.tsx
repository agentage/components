'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/utils';
import { useControlled } from '../lib/use-controlled';
import { Button } from './button';
import { fieldVariants } from './control.variants';
import { menuLabelVariants } from './menu.variants';
import { Truncate } from './truncate';
import { NavTree } from './nav-tree';
import { Popover } from './popover';
import { defaultPath, findPath, visibleRows, type TreeSelectNode } from './tree-select.model';
import { TreeRows, useExpanded } from './tree-select.rows';

export type { TreeSelectNode } from './tree-select.model';

export interface TreeSelectProps {
  nodes: TreeSelectNode[];
  /** The button that opens the picker. */
  trigger: React.ReactElement;
  /** Dialog title and accessible name, for example "Add a folder". */
  title: string;
  /** `single` picks on click or Enter and closes; `multi` toggles and confirms in the footer. */
  mode?: 'single' | 'multi';
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The picked ids: one in `single` mode, the confirmed set in `multi`. */
  onValueChange: (ids: string[]) => void;
  /** Already chosen ids: shown, but not pickable. */
  disabledIds?: string[];
  disabledLabel?: string;
  /** Ids open at first; by default every root, applied once nodes arrive. */
  defaultExpanded?: string[];
  searchPlaceholder?: string;
  confirmLabel?: (count: number) => string;
  formatPath?: (path: TreeSelectNode[]) => string;
  /** Classes of the picker panel. */
  className?: string;
}

/** Popover picker over a searchable NavTree: expand, collapse, single or multi pick, path footer. */
export const TreeSelect = React.forwardRef<HTMLElement, TreeSelectProps>(
  (
    {
      nodes,
      trigger,
      title,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      mode = 'single',
      onValueChange,
      disabledIds = [],
      disabledLabel = 'Added',
      defaultExpanded,
      searchPlaceholder = 'Search',
      confirmLabel = (n) => (n === 1 ? 'Add 1' : `Add ${String(n)}`),
      formatPath = defaultPath,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = useControlled(openProp, defaultOpen, onOpenChange);
    const [query, setQuery] = React.useState('');
    const [picked, setPicked] = React.useState<string[]>([]);
    const [active, setActive] = React.useState<string | null>(null);
    const [expanded, toggle] = useExpanded(nodes, defaultExpanded);
    const triggerRef = React.useRef<HTMLElement | null>(null);
    const setTrigger = (node: HTMLElement | null): void => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };
    const treeRef = React.useRef<HTMLDivElement>(null);
    const rows = visibleRows(nodes, expanded, query);
    const multi = mode === 'multi';

    const close = (refocus = true): void => {
      setOpen(false);
      setQuery('');
      setPicked([]);
      if (refocus) triggerRef.current?.focus();
    };
    const choose = (node: TreeSelectNode): void => {
      if (node.disabled || disabledIds.includes(node.id)) return;
      if (!multi) {
        onValueChange([node.id]);
        close();
      } else
        setPicked((p) => (p.includes(node.id) ? p.filter((x) => x !== node.id) : [...p, node.id]));
    };
    const footerPath = multi
      ? picked.map((id) => formatPath(findPath(nodes, id))).join(', ')
      : active
        ? formatPath(findPath(nodes, active))
        : '';

    const content = (
      <div className={cn('flex w-[300px] flex-col', className)} data-slot="tree-select">
        <div className={menuLabelVariants()}>{title}</div>
        <input
          type="search"
          // eslint-disable-next-line jsx-a11y/no-autofocus -- the picker opens to type a filter
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowDown') return;
            e.preventDefault();
            treeRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
          }}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className={cn(
            fieldVariants({ size: 'sm' }),
            'mx-1 mb-1 w-auto bg-background text-foreground'
          )}
        />
        <NavTree
          ref={treeRef}
          aria-label={title}
          aria-multiselectable={multi || undefined}
          className="max-h-[300px] overflow-auto"
        >
          {rows.length === 0 && (
            <p className="m-0 px-2 py-1.5 text-ui text-muted-foreground">No match</p>
          )}
          <TreeRows
            rows={rows}
            query={query}
            expanded={expanded}
            picked={picked}
            disabledIds={disabledIds}
            disabledLabel={disabledLabel}
            onToggle={toggle}
            onChoose={choose}
            onFocusRow={setActive}
          />
        </NavTree>
        <div
          className="mt-1 flex min-h-9 items-center gap-2 border-t border-border px-2.5 pt-1"
          data-slot="tree-select-footer"
        >
          <Truncate
            text={footerPath || (multi ? 'Nothing picked' : 'Pick one')}
            className="flex-1 font-mono text-xs text-muted-foreground"
          />
          {multi && (
            <Button
              size="sm"
              disabled={picked.length === 0}
              onClick={() => {
                onValueChange(picked);
                close();
              }}
            >
              {confirmLabel(picked.length)}
            </Button>
          )}
        </div>
      </div>
    );

    return (
      <Popover
        isOpen={open}
        onClose={() => close(false)}
        side="bottom"
        aria-label={title}
        className="min-w-0 p-1"
        onKeyDown={(e) => {
          if (e.key !== 'Escape') return;
          // Handled here so focus returns to the trigger; the popover's own listener never sees it.
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          close();
        }}
        trigger={
          <Slot
            ref={setTrigger}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => (open ? close() : setOpen(true))}
          >
            {trigger}
          </Slot>
        }
        content={content}
      />
    );
  }
);
TreeSelect.displayName = 'TreeSelect';
