'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Count } from './count';
import { TabsContext, tabsId } from './tabs.context';
import { tabsTriggerVariants } from './tabs.variants';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
  /** Quiet trailing number, for example the number of files. */
  count?: React.ReactNode;
  /** Unsaved edits in the panel: a 6 px dot plus `dirtyLabel` for screen readers. */
  dirty?: boolean;
  dirtyLabel?: string;
}

const NAV_KEYS: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (i, n) => (i + 1) % n,
  ArrowLeft: (i, n) => (i - 1 + n) % n,
  Home: () => 0,
  End: (_i, n) => n - 1,
};

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  (
    {
      value: triggerValue,
      className,
      children,
      count,
      dirty = false,
      dirtyLabel = 'Unsaved changes',
      disabled = false,
      onKeyDown,
      onClick,
      ...props
    },
    ref
  ) => {
    const {
      value,
      onValueChange,
      instanceId,
      variant,
      hasActive,
      firstValue,
      registerTrigger,
      panels,
    } = React.useContext(TabsContext);
    const isActive = value === triggerValue;

    React.useEffect(() => {
      if (disabled) return;
      return registerTrigger(triggerValue);
    }, [disabled, registerTrigger, triggerValue]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      onKeyDown?.(e);
      const move = NAV_KEYS[e.key];
      const tablist = e.currentTarget.closest('[role="tablist"]');
      if (e.defaultPrevented || !move || !tablist) return;

      const tabs = Array.from(
        tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')
      );
      const next = tabs[move(tabs.indexOf(e.currentTarget), tabs.length)];
      if (!next) return;

      e.preventDefault();
      next.focus();
      const nextValue = next.getAttribute('data-value');
      if (nextValue) {
        onValueChange(nextValue);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={
          isActive && panels.includes(triggerValue)
            ? tabsId(instanceId, 'panel', triggerValue)
            : undefined
        }
        id={tabsId(instanceId, 'trigger', triggerValue)}
        data-value={triggerValue}
        tabIndex={isActive || (!hasActive && firstValue === triggerValue) ? 0 : -1}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          onValueChange(triggerValue);
        }}
        onKeyDown={handleKeyDown}
        data-slot="tabs-trigger"
        className={cn(tabsTriggerVariants({ variant, active: isActive }), className)}
        {...props}
      >
        {children}
        {count !== undefined && (
          <Count data-slot="tabs-count" className="text-current">
            {count}
          </Count>
        )}
        {dirty && (
          <>
            <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span className="sr-only">{dirtyLabel}</span>
          </>
        )}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';
