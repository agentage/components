'use client';
// Docs-only composition of Badge, Truncate, Select and Button (was the unreleased PathList).

import * as React from 'react';
import { cn } from '../../src/lib/utils';
import { Badge, Button, Select, Truncate } from '../../src';

export interface PathEntry {
  id: string;
  /** Source chip, for example the source name. */
  source: string;
  path: string;
  access?: string;
}

export interface PathAccessOption {
  value: string;
  label: string;
}

export interface PathListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  entries: PathEntry[];
  /** Options of the inline access select; omit for no select. */
  accessOptions?: PathAccessOption[];
  onAccessChange?: (id: string, access: string) => void;
  onRemove?: (id: string) => void;
  /** The add control under the rows, for example a TreeSelect with an "Add folder" button. */
  add?: React.ReactNode;
  /** Shown instead of the rows when there are none. */
  empty?: React.ReactNode;
  /** Accessible name of the list. */
  label?: string;
}

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-3.5 fill-none stroke-current stroke-2"
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

/** Mounted paths: source chip, mono path, an access select and remove, then the add control. */
export const PathList = React.forwardRef<HTMLDivElement, PathListProps>(
  (
    {
      entries,
      accessOptions,
      onAccessChange,
      onRemove,
      add,
      empty,
      label = 'Paths',
      className,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn('flex min-w-0 flex-col items-start gap-2.5', className)}
      data-slot="path-list"
      {...props}
    >
      {entries.length === 0 ? (
        <div className="text-ui text-muted-foreground" data-slot="path-list-empty">
          {empty ?? 'Nothing added yet.'}
        </div>
      ) : (
        <ul aria-label={label} className="m-0 flex w-full list-none flex-col gap-1.5 p-0">
          {entries.map((e) => (
            <li
              key={e.id}
              className="flex min-h-9 min-w-0 items-center gap-2.5 rounded-md border border-border pl-2.5 pr-1.5"
              data-slot="path-row"
            >
              <Badge variant="outline-muted" className="shrink-0 text-foreground">
                {e.source}
              </Badge>
              <Truncate
                text={e.path}
                position="middle"
                className="flex-1 font-mono text-xs text-muted-foreground"
              />
              {accessOptions && (
                <Select
                  size="sm"
                  className="min-w-[112px] flex-none"
                  aria-label={`Access for ${e.source} ${e.path}`}
                  value={e.access}
                  onValueChange={(v) => onAccessChange?.(e.id, v)}
                  options={accessOptions}
                />
              )}
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${e.source} ${e.path}`}
                  title="Remove"
                  className="text-muted-foreground"
                  onClick={() => onRemove(e.id)}
                >
                  <XIcon />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
      {add}
    </div>
  )
);
PathList.displayName = 'PathList';
