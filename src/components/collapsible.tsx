'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Count } from './count';
import { Disclosure, DisclosureChevron } from './disclosure';

export interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
  triggerId: string;
  contentId: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue>({
  open: true,
  toggle: () => {},
  triggerId: '',
  contentId: '',
});

/** State and ids of the nearest Collapsible, for a custom trigger. */
export const useCollapsible = (): CollapsibleContextValue => useContext(CollapsibleContext);

export interface CollapsibleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    { open: controlledOpen, defaultOpen = false, onOpenChange, children, className, ...props },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = controlledOpen ?? internalOpen;
    const instanceId = useId();

    const toggle = (): void => {
      const next = !isOpen;
      setInternalOpen(next);
      onOpenChange?.(next);
    };

    return (
      <CollapsibleContext.Provider
        value={{
          open: isOpen,
          toggle,
          triggerId: `${instanceId}-trigger`,
          contentId: `${instanceId}-content`,
        }}
      >
        <div
          ref={ref}
          className={className}
          data-slot="collapsible"
          data-state={isOpen ? 'open' : 'closed'}
          {...props}
        >
          {typeof children === 'function'
            ? (children as (props: { open: boolean; toggle: () => void }) => ReactNode)({
                open: isOpen,
                toggle,
              })
            : children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);
Collapsible.displayName = 'Collapsible';

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  /** Leading chevron that turns when open. Default true (not drawn with asChild). */
  chevron?: boolean;
  /** Quiet trailing count, for example the number of items inside. */
  count?: React.ReactNode;
}

export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ asChild = false, chevron = true, count, className, children, onClick, ...props }, ref) => {
    const { open, toggle, triggerId, contentId } = useContext(CollapsibleContext);
    const Comp = asChild ? Slot : 'button';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
      onClick?.(e);
      if (!e.defaultPrevented) toggle();
    };

    return (
      <Comp
        ref={ref}
        {...(asChild ? {} : { type: 'button' as const })}
        id={triggerId || undefined}
        aria-expanded={open}
        aria-controls={contentId || undefined}
        onClick={handleClick}
        className={cn(
          'flex h-7 w-full items-center gap-2 rounded-md px-2 text-ui font-medium transition-colors duration-fast',
          'text-foreground hover:bg-accent',
          'focus-ring',
          className
        )}
        data-slot="collapsible-trigger"
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {chevron && <DisclosureChevron open={open} />}
            <span className="min-w-0 truncate text-left">{children}</span>
            {count !== undefined && <Count>{count}</Count>}
          </>
        )}
      </Comp>
    );
  }
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export type CollapsibleContentProps = React.HTMLAttributes<HTMLDivElement>;

export const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, triggerId, contentId } = useContext(CollapsibleContext);

    return (
      <Disclosure
        ref={ref}
        open={open}
        id={contentId || undefined}
        role="region"
        aria-labelledby={triggerId || undefined}
        className={className}
        data-slot="collapsible-content"
        {...props}
      >
        {children}
      </Disclosure>
    );
  }
);
CollapsibleContent.displayName = 'CollapsibleContent';
