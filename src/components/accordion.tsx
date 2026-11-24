'use client';

import * as React from 'react';
import { AccordionContext, AccordionItemContext } from './accordion.context';
import { nextListIndex } from '../lib/list-navigation';
import { useControlled } from '../lib/use-controlled';
import { cn } from '../lib/utils';
import { Disclosure } from './disclosure';

export { AccordionTrigger } from './accordion.trigger';
export type { AccordionTriggerProps } from './accordion.trigger';

const isStrings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((s) => typeof s === 'string');

const TRIGGERS = '[data-slot="accordion-trigger"]:not(:disabled)';

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /** `single` keeps at most one item open; `multiple` any number. Defaults to `single`. */
  type?: 'single' | 'multiple';
  /** Item values open at first. */
  defaultValue?: string[];
  /** Keep the open items in localStorage under this key. */
  storageKey?: string;
  /** `default` rows divided by rules; `section` 32 px section headers (icon, title, summary). */
  variant?: 'default' | 'section';
  /** Wraps each trigger in a heading of this level; the look stays the same. */
  level?: 2 | 3 | 4;
  children: React.ReactNode;
}

const ownTriggers = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(TRIGGERS)).filter(
    (el) => el.closest('[data-slot="accordion"]') === root && !el.closest('[inert]')
  );

// Every header stays a Tab stop (APG accordion); arrows, Home and End only move focus.
const moveFocus = (root: HTMLElement, e: KeyboardEvent): void => {
  const target = e.target as HTMLElement;
  if (e.defaultPrevented || !target.matches(TRIGGERS)) return;
  const items = ownTriggers(root);
  const next = nextListIndex(e.key, items.indexOf(target), items.length, false);
  if (next === null || !items.includes(target)) return;
  e.preventDefault();
  items[next]?.focus();
};

/** A set of collapsible items, one or many open; Up, Down, Home and End move between headers. */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = 'single',
      defaultValue = [],
      storageKey,
      variant = 'default',
      level,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const root = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => root.current as HTMLDivElement);
    React.useEffect(() => {
      const el = root.current;
      if (!el) return;
      const onKey = (e: KeyboardEvent): void => moveFocus(el, e);
      el.addEventListener('keydown', onKey);
      return () => el.removeEventListener('keydown', onKey);
    }, []);
    // A stored value of another shape (an older key) falls back to the default.
    const [openItems, setOpenItems, restoring] = useControlled(
      undefined,
      defaultValue,
      undefined,
      storageKey,
      isStrings
    );
    const toggle = React.useCallback(
      (item: string) => {
        const open = openItems.includes(item);
        if (type === 'single') setOpenItems(open ? [] : [item]);
        else setOpenItems(open ? openItems.filter((v) => v !== item) : [...openItems, item]);
      },
      [type, openItems, setOpenItems]
    );
    const ctx = React.useMemo(
      () => ({ openItems, toggle, variant, level, restoring }),
      [openItems, toggle, variant, level, restoring]
    );

    return (
      <AccordionContext.Provider value={ctx}>
        <div
          ref={root}
          className={cn(
            variant === 'section' ? 'border-t border-border' : 'divide-y divide-border',
            className
          )}
          data-slot="accordion"
          data-variant={variant === 'section' ? 'section' : undefined}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const AccordionItem = ({
  value,
  children,
  className,
  disabled = false,
  ...props
}: AccordionItemProps): React.JSX.Element => {
  const { openItems, variant } = React.useContext(AccordionContext);
  const isOpen = openItems.includes(value);
  const instanceId = React.useId();

  return (
    <AccordionItemContext.Provider
      value={{
        value,
        disabled,
        triggerId: `${instanceId}-trigger`,
        contentId: `${instanceId}-content`,
      }}
    >
      <div
        className={cn(variant === 'section' && 'border-b border-border', className)}
        data-state={isOpen ? 'open' : 'closed'}
        data-slot="accordion-item"
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { openItems, variant, restoring } = React.useContext(AccordionContext);
    const { value, triggerId, contentId } = React.useContext(AccordionItemContext);
    const open = openItems.includes(value);

    return (
      <Disclosure
        ref={ref}
        open={open}
        bodyClassName={restoring ? 'transition-none' : undefined}
        id={contentId || undefined}
        role="region"
        aria-labelledby={triggerId || undefined}
        className={cn(
          variant === 'section'
            ? 'flex flex-col gap-2.5 px-1 pb-4 pt-0.5 text-ui'
            : 'px-2 pb-3 text-ui text-muted-foreground',
          className
        )}
        data-slot="accordion-content"
        {...props}
      >
        {children}
      </Disclosure>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';
