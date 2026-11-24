'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { useRovingFocus } from '../lib/use-roving-focus';
import { DisclosureChevron } from './disclosure';
import {
  navListVariants,
  navRowCountVariants,
  navRowPillVariants,
  navRowVariants,
} from './nav-tree.variants';

const ITEM = '[role="treeitem"]';
const CHEVRON = '[data-slot="nav-row-chevron"]';

export type NavTreeProps = React.HTMLAttributes<HTMLDivElement>;

/** `role="tree"` container: one Tab stop, Up/Down/Home/End move between visible rows. */
export const NavTree = React.forwardRef<HTMLDivElement, NavTreeProps>(
  ({ className, ...props }, ref) => {
    const inner = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => inner.current as HTMLDivElement);
    useRovingFocus(inner, { selector: ITEM, loop: false });

    return (
      <div
        ref={inner}
        role="tree"
        className={cn(navListVariants(), className)}
        data-slot="nav-tree"
        {...props}
      />
    );
  }
);
NavTree.displayName = 'NavTree';

const levelOf = (el: Element): number => Number(el.getAttribute('aria-level') ?? '1');

/** Nearest earlier row one level up, or the next row (first child) when `down`. */
const relative = (row: HTMLElement, down: boolean): HTMLElement | undefined => {
  const tree = row.closest('[role="tree"]');
  const rows = tree ? Array.from(tree.querySelectorAll<HTMLElement>(ITEM)) : [];
  const index = rows.indexOf(row);
  if (down) return rows[index + 1];
  return rows
    .slice(0, index)
    .reverse()
    .find((r) => levelOf(r) < levelOf(row));
};

export interface NavRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Nesting depth, 0 for top-level rows. */
  depth?: number;
  selected?: boolean;
  /** Leave undefined for a leaf; true or false shows the chevron. */
  expanded?: boolean;
  onToggle?: () => void;
  icon?: React.ReactNode;
  /** Quiet trailing number, for example the item count of a folder. */
  count?: React.ReactNode;
  /** Loud trailing badge, for example the number of items that need attention. */
  pill?: React.ReactNode;
  /** Shows a small dot and adds `dirtyLabel` to the accessible name. */
  dirty?: boolean;
  dirtyLabel?: string;
}

const Chevron = ({ expanded }: { expanded?: boolean }) => (
  <span
    className="grid size-4 shrink-0 place-items-center rounded-sm"
    data-slot={expanded === undefined ? undefined : 'nav-row-chevron'}
    aria-hidden="true"
  >
    {expanded !== undefined && <DisclosureChevron open={expanded} className="text-current" />}
  </span>
);

const useRowKeys = (expanded: boolean | undefined, onToggle?: () => void) =>
  React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.target !== e.currentTarget) return;
      const row = e.currentTarget;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
      } else if (e.key === 'ArrowRight' && expanded !== undefined) {
        e.preventDefault();
        if (expanded) relative(row, true)?.focus();
        else onToggle?.();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (expanded) onToggle?.();
        else relative(row, false)?.focus();
      }
    },
    [expanded, onToggle]
  );

const NavRowTrail = ({ count, pill, dirty, dirtyLabel }: NavRowProps) => (
  <>
    {dirty && (
      <>
        <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
        <span className="sr-only">{dirtyLabel}</span>
      </>
    )}
    {count !== undefined && <span className={navRowCountVariants()}>{count}</span>}
    {pill !== undefined && <span className={navRowPillVariants()}>{pill}</span>}
  </>
);

/** One dense row of a `NavTree`: depth indent, chevron, icon, label, count, pill, dirty dot. */
export const NavRow = React.forwardRef<HTMLDivElement, NavRowProps>(
  (
    {
      depth = 0,
      selected = false,
      expanded,
      onToggle,
      icon,
      count,
      pill,
      dirty,
      dirtyLabel = 'Unsaved changes',
      className,
      style,
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const keys = useRowKeys(expanded, onToggle);
    // A parent row without its own onClick toggles from anywhere on the row, by mouse or key.
    const togglesOnClick = onClick === undefined && expanded !== undefined;
    return (
      <div
        ref={ref}
        role="treeitem"
        tabIndex={-1}
        aria-level={depth + 1}
        aria-selected={selected}
        aria-expanded={expanded}
        className={cn(navRowVariants({ selected }), className)}
        style={{ ...style, paddingLeft: `${String(0.375 + depth * 0.875)}rem` }}
        data-slot="nav-row"
        onClick={(e) => {
          if (togglesOnClick || (e.target as HTMLElement).closest(CHEVRON)) onToggle?.();
          else onClick?.(e);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!e.defaultPrevented) keys(e);
        }}
        {...props}
      >
        <Chevron expanded={expanded} />
        {icon && (
          <span className="flex shrink-0 text-muted-foreground group-aria-selected:text-primary [&_svg]:size-4">
            {icon}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate">{children}</span>
        <NavRowTrail count={count} pill={pill} dirty={dirty} dirtyLabel={dirtyLabel} />
      </div>
    );
  }
);
NavRow.displayName = 'NavRow';
