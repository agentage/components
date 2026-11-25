'use client';

import { createContext } from 'react';

export interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
  variant: 'default' | 'section';
  level?: 2 | 3 | 4;
  /** True for the frame a stored value is applied: bodies skip the collapse animation. */
  restoring?: boolean;
}

export const AccordionContext = createContext<AccordionContextValue>({
  openItems: [],
  toggle: () => {},
  variant: 'default',
});

export interface AccordionItemContextValue {
  value: string;
  triggerId: string;
  contentId: string;
  disabled: boolean;
}

export const AccordionItemContext = createContext<AccordionItemContextValue>({
  value: '',
  triggerId: '',
  contentId: '',
  disabled: false,
});
