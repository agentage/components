'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import type { TabsVariant } from './tabs.variants';
import { TabsContext, tabsId } from './tabs.context';
import { tabsContentVariants, tabsListVariants } from './tabs.variants';

export type { TabsVariant };

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  children: React.ReactNode;
}

export const Tabs = ({
  defaultValue = '',
  value: controlledValue,
  onValueChange,
  variant = 'pill',
  className,
  children,
  ...props
}: TabsProps): React.JSX.Element => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [triggers, setTriggers] = React.useState<string[]>([]);
  const [panels, setPanels] = React.useState<string[]>([]);
  const registerPanel = React.useCallback((v: string) => {
    setPanels((prev) => (prev.includes(v) ? prev : [...prev, v]));
    return () => setPanels((prev) => prev.filter((x) => x !== v));
  }, []);
  const instanceId = React.useId();
  const value = controlledValue ?? internalValue;

  const handleValueChange = (newValue: string): void => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  // Triggers self-register (in child order) so the list stays tabbable with nothing selected.
  const registerTrigger = React.useCallback((triggerValue: string) => {
    setTriggers((prev) => (prev.includes(triggerValue) ? prev : [...prev, triggerValue]));
    return () => {
      setTriggers((prev) => prev.filter((v) => v !== triggerValue));
    };
  }, []);

  return (
    <TabsContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        instanceId,
        variant,
        hasActive: triggers.includes(value),
        firstValue: triggers[0] ?? null,
        registerTrigger,
        panels,
        registerPanel,
      }}
    >
      <div className={cn('flex flex-col', className)} data-slot="tabs" {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = React.useContext(TabsContext);

    return (
      <div
        ref={ref}
        className={cn(tabsListVariants({ variant }), className)}
        role="tablist"
        data-slot="tabs-list"
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = 'TabsList';

export { TabsTrigger } from './tabs.trigger';
export type { TabsTriggerProps } from './tabs.trigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value: contentValue, className, children, ...props }, ref) => {
    const { value, instanceId, registerPanel } = React.useContext(TabsContext);
    React.useEffect(() => registerPanel(contentValue), [registerPanel, contentValue]);

    if (value !== contentValue) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={tabsId(instanceId, 'panel', contentValue)}
        aria-labelledby={tabsId(instanceId, 'trigger', contentValue)}
        tabIndex={0}
        data-slot="tabs-content"
        className={cn(tabsContentVariants(), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';
