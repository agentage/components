'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { useControlled } from '../lib/use-controlled';
import { cn } from '../lib/utils';
import { Count } from './count';
import { DisclosureChevron } from './disclosure';

const rootVariants = cva('flex min-w-0 items-center text-ui font-semibold text-foreground', {
  variants: {
    /** Both 32 px: `group` a ruled list or table group header, `section` an unruled section header. */
    variant: {
      group: 'h-8 border-b border-border bg-card pr-2',
      section: 'min-h-8',
    },
  },
  defaultVariants: { variant: 'group' },
});

const toggleVariants = cva('flex h-full min-w-0 flex-1 items-center gap-2 text-left', {
  variants: {
    variant: { group: 'px-2', section: 'min-h-8 rounded-md px-1' },
    interactive: {
      true: [
        'cursor-pointer transition-colors duration-fast hover:bg-accent focus-ring',
        'hover:[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]',
      ],
      false: '',
    },
  },
  defaultVariants: { variant: 'group', interactive: false },
});

export interface GroupHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  label: React.ReactNode;
  /** Quiet number after the label. */
  count?: React.ReactNode;
  /** Leading 14 px glyph of the group, for example a StatusGlyph. */
  icon?: React.ReactNode;
  /** Right-aligned muted text inside the toggle. */
  summary?: React.ReactNode;
  /** With `onOpenChange` the header is a collapse toggle with a chevron; open by default. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Id of the body the toggle controls; the toggle gets the id `${controls}-toggle`. */
  controls?: string;
  /** Buttons at the right edge, outside the toggle. */
  actions?: React.ReactNode;
  variant?: 'group' | 'section';
  /** Wraps the toggle in a heading of this level; the look stays the same. */
  level?: 2 | 3 | 4;
}

/** One header for every group and section: chevron, glyph, label, count, summary, actions. */
export const GroupHeader = React.forwardRef<HTMLDivElement, GroupHeaderProps>(
  (
    {
      label,
      count,
      icon,
      summary,
      open: openProp,
      onOpenChange,
      controls,
      actions,
      variant = 'group',
      level,
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useControlled(openProp, true, onOpenChange);
    const triggerId = controls && `${controls}-toggle`;
    const interactive = onOpenChange !== undefined;
    const inner = (
      <>
        {interactive && <DisclosureChevron open={open} />}
        {icon && (
          <span className="flex shrink-0 text-muted-foreground [&_svg]:size-3.5" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="min-w-0 truncate">{label}</span>
        {count !== undefined && <Count>{count}</Count>}
        {summary !== undefined && (
          <span className="ml-auto min-w-0 truncate pl-2 text-xs font-medium text-muted-foreground">
            {summary}
          </span>
        )}
      </>
    );
    const toggle = interactive ? (
      <button
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-controls={controls}
        onClick={() => setOpen(!open)}
        className={toggleVariants({ variant, interactive })}
        data-slot="group-header-toggle"
      >
        {inner}
      </button>
    ) : (
      <span id={triggerId} className={toggleVariants({ variant })}>
        {inner}
      </span>
    );
    const Heading = level ? (`h${String(level)}` as 'h3') : null;
    return (
      <div
        ref={ref}
        className={cn(rootVariants({ variant }), className)}
        data-slot="group-header"
        data-state={interactive ? (open ? 'open' : 'closed') : undefined}
        {...props}
      >
        {Heading ? (
          <Heading className="m-0 flex h-full min-w-0 flex-1 text-[length:inherit] font-[inherit]">
            {toggle}
          </Heading>
        ) : (
          toggle
        )}
        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </div>
    );
  }
);
GroupHeader.displayName = 'GroupHeader';
