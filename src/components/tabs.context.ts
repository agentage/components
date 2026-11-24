'use client';

import * as React from 'react';
import type { TabsVariant } from './tabs.variants';

export interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  instanceId: string;
  variant: TabsVariant;
  /** True when the current value matches one of the registered triggers. */
  hasActive: boolean;
  firstValue: string | null;
  registerTrigger: (value: string) => () => void;
  /** Mounted panel values; a trigger only points at a panel that exists. */
  panels: string[];
  registerPanel: (value: string) => () => void;
}

export const TabsContext = React.createContext<TabsContextValue>({
  value: '',
  onValueChange: () => {},
  instanceId: '',
  variant: 'pill',
  hasActive: true,
  firstValue: null,
  registerTrigger: () => () => {},
  panels: [],
  registerPanel: () => () => {},
});

/** IDREF-safe id for a tab or panel; values like "api keys" would split an IDREF list. */
export const tabsId = (instanceId: string, part: 'panel' | 'trigger', value: string): string =>
  `${instanceId}-${part}-${value.replace(/[^\w-]/g, (c) => `_${c.charCodeAt(0).toString(16)}`)}`;
