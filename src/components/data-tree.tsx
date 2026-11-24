'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { ancestorsOf, defaultOpen, flatten, matchPaths } from './data-tree.model';
import { DataTreeRow } from './data-tree.row';
import { NavTree } from './nav-tree';

export type { DataKind } from './data-tree.model';

export interface DataTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Any JSON-like value: objects and arrays are branches, the rest are leaves. */
  value: unknown;
  /** Levels open on first render; 1 opens the root only. Default 1. */
  defaultExpandDepth?: number;
  /** Marks matching keys and values and opens the branches that hold them. */
  highlight?: string;
  /** Children shown per branch before a "Show n more" row. Default 100. */
  itemLimit?: number;
  /** Strings longer than this cut with a "+n" toggle. Default 80. */
  maxStringLength?: number;
  /** Shows the root object as its own row. */
  showRoot?: boolean;
  'aria-label'?: string;
}

const MORE =
  'flex h-7 w-full items-center rounded-md px-2 text-left text-xs text-muted-foreground transition-colors duration-fast hover:bg-accent hover:text-foreground focus-ring';

/** Hierarchical data viewer on NavTree rows: JSON keys and values coloured by type. */
export const DataTree = React.forwardRef<HTMLDivElement, DataTreeProps>(
  (
    {
      value,
      defaultExpandDepth = 1,
      highlight,
      itemLimit = 100,
      maxStringLength = 80,
      showRoot = false,
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(() => {
      const s = defaultOpen(value, defaultExpandDepth);
      s.add('$');
      return s;
    });
    const [limits, setLimits] = React.useState<Record<string, number>>({});
    const matches = React.useMemo(() => matchPaths(value, highlight ?? ''), [value, highlight]);
    // Branches the user shut while a search was active; a new search starts clean.
    const [shut, setShut] = React.useState({ q: highlight, paths: new Set<string>() });
    const shutNow = React.useMemo(
      () => (shut.q === highlight ? shut.paths : new Set<string>()),
      [shut, highlight]
    );
    const visible = React.useMemo(() => {
      if (matches.size === 0) return open;
      const all = new Set([...open, ...ancestorsOf(matches)]);
      for (const p of shutNow) all.delete(p);
      return all;
    }, [open, matches, shutNow]);
    const rows = flatten(value, visible, limits, itemLimit);
    const shown = showRoot ? rows : rows.slice(1);
    const shift = showRoot ? 0 : 1;
    const toggle = (path: string): void => {
      const closing = visible.has(path);
      setOpen((s) => {
        const next = new Set(s);
        if (closing) next.delete(path);
        else next.add(path);
        return next;
      });
      const paths = new Set(shutNow);
      if (closing) paths.add(path);
      else paths.delete(path);
      setShut({ q: highlight, paths });
    };
    return (
      <NavTree
        ref={ref}
        className={cn('px-0', className)}
        data-slot="data-tree"
        data-match-count={matches.size}
        {...props}
      >
        {shown.map((row) =>
          row.type === 'more' ? (
            <div
              key={`${row.path}#more`}
              role="treeitem"
              tabIndex={-1}
              aria-level={row.depth - shift + 1}
              aria-selected={false}
              style={{ paddingLeft: `${String(1.375 + (row.depth - shift) * 0.875)}rem` }}
              className={MORE}
              onClick={() =>
                setLimits((l) => ({ ...l, [row.path]: (l[row.path] ?? itemLimit) + itemLimit }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.currentTarget.click();
                }
              }}
            >
              Show {Math.min(row.hidden, itemLimit)} more of {row.hidden}
            </div>
          ) : (
            <DataTreeRow
              key={row.path}
              node={row}
              depth={row.depth - shift}
              open={visible.has(row.path)}
              highlight={highlight}
              matched={matches.has(row.path)}
              maxStringLength={maxStringLength}
              onToggle={() => toggle(row.path)}
            />
          )
        )}
      </NavTree>
    );
  }
);
DataTree.displayName = 'DataTree';
