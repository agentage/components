'use client';

import * as React from 'react';
import { AccordionContext, AccordionItemContext } from './accordion.context';
import { cn } from '../lib/utils';
import { Count } from './count';
import { DisclosureChevron } from './disclosure';

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Quiet count after the label. */
  count?: React.ReactNode;
  /** Leading 14 px glyph after the chevron. */
  icon?: React.ReactNode;
  /** Right-aligned muted text: a path, a version, "3 items". */
  summary?: React.ReactNode;
}

const BASE = [
  'flex w-full items-center gap-2 rounded-md text-ui text-foreground cursor-pointer text-left',
  'transition-colors duration-fast hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50',
  'hover:[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]',
  'focus-ring',
];
const LOOK = {
  default: 'min-h-9 px-2 py-1.5 font-medium',
  section: 'h-8 px-1 font-semibold',
};

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, count, icon, summary, disabled, ...props }, ref) => {
    const { toggle, openItems, variant, level } = React.useContext(AccordionContext);
    const item = React.useContext(AccordionItemContext);
    const isOpen = openItems.includes(item.value);

    const button = (
      <button
        ref={ref}
        type="button"
        id={item.triggerId || undefined}
        onClick={() => toggle(item.value)}
        aria-expanded={isOpen}
        aria-controls={item.contentId || undefined}
        disabled={disabled ?? item.disabled}
        className={cn(BASE, LOOK[variant], className)}
        data-slot="accordion-trigger"
        {...props}
      >
        <DisclosureChevron open={isOpen} />
        {icon && (
          <span className="flex shrink-0 text-muted-foreground [&_svg]:size-3.5" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={cn('min-w-0 flex-1', variant === 'section' && 'truncate')}>
          {children}
          {count !== undefined && <Count className="ml-2">{count}</Count>}
        </span>
        {summary !== undefined && (
          <span className="min-w-0 shrink truncate pl-2 text-xs font-medium text-muted-foreground">
            {summary}
          </span>
        )}
      </button>
    );
    if (!level) return button;
    const Heading = `h${String(level)}` as 'h3';
    return <Heading className="m-0 text-[length:inherit] font-[inherit]">{button}</Heading>;
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';
