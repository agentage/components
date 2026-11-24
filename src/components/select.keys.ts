'use client';

import * as React from 'react';
import { nextListIndex } from '../lib/list-navigation';
import type { SelectOption } from './select';

/** Index of the next enabled option for a navigation key, or null when the key does not navigate. */
export const nextEnabled = (key: string, active: number, list: SelectOption[]): number | null => {
  const enabled = list.flatMap((o, i) => (o.disabled ? [] : [i]));
  const next = nextListIndex(key, enabled.indexOf(active), enabled.length, false);
  return next === null ? null : enabled[next];
};

/** Type-ahead: a printable key jumps to the next enabled label that starts with the typed text. */
export const useTypeAhead = (list: SelectOption[]): ((key: string, active: number) => number) => {
  const typed = React.useRef({ text: '', at: 0 });
  return (key, active) => {
    const now = Date.now();
    const t = typed.current;
    t.text = now - t.at > 500 ? key : t.text + key;
    t.at = now;
    const from = t.text.length === 1 ? active + 1 : active;
    const order = [...list.keys()].map((_, i) => (from + i + list.length) % list.length);
    const hit = order.find(
      (i) => !list[i].disabled && list[i].label.toLowerCase().startsWith(t.text.toLowerCase())
    );
    return hit ?? -1;
  };
};
