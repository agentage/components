'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { DropdownMenu } from './dropdown-menu';

export const RowMenuIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
);

export interface RowMenuProps {
  /** Accessible name of the 24 px trigger, for example "Actions for release-notes". */
  label: string;
  /** `DropdownMenuItem`s and friends. */
  children: React.ReactNode;
  className?: string;
}

/** 24 px "more" button that opens a DropdownMenu; for list rows and cards. */
export const RowMenu = ({ label, children, className }: RowMenuProps): React.JSX.Element => (
  <DropdownMenu
    trigger={
      <button
        type="button"
        aria-label={label}
        title={label}
        className={cn(
          'relative z-10 grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-ring aria-expanded:bg-accent aria-expanded:text-foreground',
          className
        )}
        data-slot="row-menu-trigger"
      >
        <RowMenuIcon />
      </button>
    }
  >
    {children}
  </DropdownMenu>
);
