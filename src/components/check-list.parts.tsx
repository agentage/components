'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Checkbox } from './checkbox';
import type { StatusGlyphProps } from './status-glyph';
import {
  checkSummary,
  normalizeRowStatus,
  ROW_STATUS_GLYPH,
  type RowStatus,
  type RowStatusAlias,
} from './status-glyph.status';

/** Status of a CheckItem; the shared row vocabulary plus its aliases. */
export type CheckStatus = RowStatus | RowStatusAlias;

const LABEL: Record<RowStatus, string> = {
  ok: 'Passed',
  error: 'Failed',
  pending: 'Pending',
  running: 'Running',
  skipped: 'Skipped',
};

export const glyphOf = (status: CheckStatus): StatusGlyphProps => {
  const s = normalizeRowStatus(status);
  return { ...ROW_STATUS_GLYPH[s], label: LABEL[s] };
};

type ItemShape = { status?: CheckStatus; checked?: boolean; onCheckedChange?: unknown };

const itemsOf = (children: React.ReactNode): ItemShape[] =>
  React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((c) => c.props as ItemShape);

/** Status rows count "6 of 6 passed"; checkbox rows count "1 of 3". */
export const summaryOf = (children: React.ReactNode): string => {
  const items = itemsOf(children);
  if (items.some((i) => i.onCheckedChange !== undefined))
    return `${String(items.filter((i) => i.checked).length)} of ${String(items.length)}`;
  return checkSummary(items.map((i) => i.status ?? 'ok'));
};

export interface CheckboxRowProps {
  label: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

/** 28 px checkbox row; a done row is muted and struck through. */
export const CheckboxRow = ({
  label,
  checked = false,
  onCheckedChange,
  disabled,
}: CheckboxRowProps) => {
  const id = React.useId();
  return (
    <div className="flex h-7 items-center gap-2 text-ui">
      <Checkbox
        id={id}
        size="sm"
        checked={checked}
        onCheckedChange={(v) => onCheckedChange?.(v)}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className={cn(
          'min-w-0 flex-1 cursor-pointer select-none truncate transition-colors duration-fast',
          checked && 'text-muted-foreground line-through'
        )}
      >
        {label}
      </label>
    </div>
  );
};
