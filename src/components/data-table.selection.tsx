'use client';

import * as React from 'react';
import { Checkbox } from './checkbox';
import { useControlled } from './data-table.state';

export type DataTableSelection = 'single' | 'multi';

export interface SelectionState {
  mode?: DataTableSelection;
  selected: string[];
  /** Click or Space on a row checkbox; `range` extends from the last toggled row (Shift). */
  toggle: (key: string, range: boolean) => void;
  /** Single selection: makes this row the current one. */
  setCurrent: (key: string) => void;
  /** Header checkbox: selects every displayed row, or clears them when all are selected. */
  toggleAll: () => void;
  all: boolean;
  some: boolean;
}

/** Selection over the displayed order (after sort and grouping), so a Shift range follows the screen. */
export const useSelection = (
  mode: DataTableSelection | undefined,
  order: string[],
  controlled: string[] | undefined,
  initial: string[] | undefined,
  onChange?: (keys: string[]) => void
): SelectionState => {
  const [selected, setSelected] = useControlled(controlled, initial ?? [], onChange);
  const anchor = React.useRef<string | null>(null);
  const shown = new Set(order);
  const count = selected.filter((k) => shown.has(k)).length;

  const toggle = (key: string, range: boolean): void => {
    const from = anchor.current === null ? -1 : order.indexOf(anchor.current);
    const to = order.indexOf(key);
    anchor.current = key;
    if (range && from >= 0 && to >= 0) {
      const span = order.slice(Math.min(from, to), Math.max(from, to) + 1);
      setSelected([...new Set([...selected, ...span])]);
    } else {
      setSelected(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);
    }
  };

  return {
    mode,
    selected,
    toggle,
    setCurrent: (key) => setSelected([key]),
    toggleAll: () =>
      setSelected(
        count === order.length && order.length > 0
          ? selected.filter((k) => !shown.has(k))
          : [...new Set([...selected, ...order])]
      ),
    all: order.length > 0 && count === order.length,
    some: count > 0 && count < order.length,
  };
};

export interface SelectBoxProps {
  checked: boolean;
  indeterminate?: boolean;
  label: string;
  onToggle: (range: boolean) => void;
}

/** 13 px checkbox of the select column; lifted above the stretched row activator. */
export const SelectBox = ({ checked, indeterminate, label, onToggle }: SelectBoxProps) => {
  const shift = React.useRef(false);
  return (
    <Checkbox
      size="sm"
      checked={checked}
      indeterminate={indeterminate}
      aria-label={label}
      className="relative z-10"
      data-slot="data-table-select"
      onClick={(e) => {
        shift.current = e.shiftKey;
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        shift.current = e.shiftKey;
      }}
      onCheckedChange={() => onToggle(shift.current)}
    />
  );
};

/** Width of the select column: 16 px edge padding + 13 px box + 5 px gap. */
export const SELECT_COLUMN_WIDTH = '34px';
