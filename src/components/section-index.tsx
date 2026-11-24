'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { navRowCountVariants, navRowVariants } from './nav-tree.variants';

/** The shared nav row at 13 px; `active` maps to the row's `selected` state. */
export const sectionIndexItemVariants = ({ active = false }: { active?: boolean } = {}): string =>
  cn(navRowVariants({ size: 'sm', selected: active }), 'px-2.5');

export interface SectionIndexSection {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Quiet trailing number, as on a NavRow. */
  count?: React.ReactNode;
  /** Unsaved edits in the section: a small dot plus `dirtyLabel` for screen readers. */
  dirty?: boolean;
}

export interface SectionIndexProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  sections: SectionIndexSection[];
  /** Id of the current section; pair with `useScrollSpy`. */
  activeId?: string;
  /** Called on click. Call `event.preventDefault()` to replace the default jump to `#id`. */
  onSelect?: (id: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  dirtyLabel?: string;
}

export const SectionIndex = React.forwardRef<HTMLElement, SectionIndexProps>(
  (
    {
      sections,
      activeId,
      onSelect,
      dirtyLabel = 'Unsaved changes',
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => (
    <nav
      ref={ref}
      aria-label={ariaLabel ?? 'Sections'}
      className={cn('flex flex-col', className)}
      data-slot="section-index"
      {...props}
    >
      <ul className="flex flex-col gap-px">
        {sections.map(({ id, label, icon, count, dirty }) => {
          const active = id === activeId;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active ? 'true' : undefined}
                className={sectionIndexItemVariants({ active })}
                onClick={(event) => onSelect?.(id, event)}
              >
                {icon && (
                  <span className="flex shrink-0 text-muted-foreground group-aria-[current]:text-primary [&_svg]:size-4">
                    {icon}
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate">{label}</span>
                {dirty && (
                  <>
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{dirtyLabel}</span>
                  </>
                )}
                {count !== undefined && <span className={navRowCountVariants()}>{count}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  )
);
SectionIndex.displayName = 'SectionIndex';
