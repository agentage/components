'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Disclosure, DisclosureChevron } from './disclosure';
import { StatusGlyph } from './status-glyph';

import { CheckboxRow, glyphOf, summaryOf, type CheckStatus } from './check-list.parts';
import { normalizeRowStatus } from './status-glyph.status';

export type { CheckStatus } from './check-list.parts';
export { checkSummary } from './status-glyph.status';

export interface CheckListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Header row title, for example "Checks". */
  title?: React.ReactNode;
  /** Header summary; `true` (default) counts the rows: "6 of 6 passed", or "1 of 3" for checkboxes. */
  summary?: React.ReactNode | true;
  /** `card` (default): bordered card with a 36 px header. `plain`: rows under a small label. */
  variant?: 'card' | 'plain';
}

/**
 * A list of checks: 36 px status rows (glyph, label, quiet value) or, when the items carry
 * `onCheckedChange`, 28 px checkbox rows that strike through when done.
 */
export const CheckList = React.forwardRef<HTMLDivElement, CheckListProps>(
  ({ title, summary = true, variant = 'card', className, children, ...props }, ref) => {
    const text = summary === true ? summaryOf(children) : summary;
    const plain = variant === 'plain';
    return (
      <div
        ref={ref}
        className={cn(
          'flex min-w-0 flex-col',
          variant === 'card' && 'overflow-hidden rounded-lg border border-border bg-card',
          className
        )}
        data-slot="check-list"
        {...props}
      >
        {title !== undefined && (
          <div
            className={
              plain
                ? 'mb-1 flex h-5 items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-muted-foreground'
                : 'flex h-9 items-center gap-2 border-b border-border px-3 text-ui'
            }
            data-slot="check-list-head"
          >
            <span className={plain ? undefined : 'font-semibold'}>{title}</span>
            <span className={plain ? undefined : 'ml-auto text-xs text-muted-foreground'}>
              {text}
            </span>
          </div>
        )}
        <ul
          className={cn('m-0 flex list-none flex-col p-0', !plain && 'divide-y divide-border')}
          aria-label={typeof title === 'string' ? title : undefined}
        >
          {children}
        </ul>
      </div>
    );
  }
);
CheckList.displayName = 'CheckList';

export interface CheckItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'value'> {
  label: React.ReactNode;
  status?: CheckStatus;
  /** Right-aligned muted text: "fixed", "2 min 04 s", "41 of 41". */
  value?: React.ReactNode;
  /** With `onCheckedChange` the row is a 28 px checkbox row instead of a status row. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const ROW = 'flex min-h-9 w-full items-center gap-2.5 px-3 py-1.5 text-left text-ui';

/** One row of a CheckList; children become a detail that expands under the row. */
export const CheckItem = React.forwardRef<HTMLLIElement, CheckItemProps>(
  (
    {
      label,
      status = 'ok',
      value,
      checked,
      onCheckedChange,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const id = React.useId();
    const hasDetail = children !== undefined && children !== null && children !== false;
    if (onCheckedChange)
      return (
        <li
          ref={ref}
          className={cn('min-w-0', className)}
          data-slot="check-item"
          data-state={checked ? 'checked' : 'unchecked'}
          {...props}
        >
          <CheckboxRow
            label={label}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
          />
        </li>
      );
    const head = (
      <>
        <StatusGlyph {...glyphOf(status)} />
        <span
          className={cn('min-w-0 flex-1 truncate', status === 'skipped' && 'text-muted-foreground')}
        >
          {label}
        </span>
        {value !== undefined && (
          <span className="shrink-0 text-xs text-muted-foreground" data-slot="check-item-value">
            {value}
          </span>
        )}
        {hasDetail && <DisclosureChevron open={open} />}
      </>
    );
    return (
      <li
        ref={ref}
        className={cn('min-w-0', className)}
        data-slot="check-item"
        data-status={normalizeRowStatus(status)}
        {...props}
      >
        {hasDetail ? (
          <button
            type="button"
            className={cn(
              ROW,
              'transition-colors duration-fast hover:bg-accent focus-ring',
              'hover:[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]'
            )}
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen(!open)}
          >
            {head}
          </button>
        ) : (
          <div className={ROW}>{head}</div>
        )}
        {hasDetail && (
          <Disclosure
            id={id}
            open={open}
            className="px-3 pb-2.5 pl-[36px] text-xs text-muted-foreground wrap-anywhere"
          >
            {children}
          </Disclosure>
        )}
      </li>
    );
  }
);
CheckItem.displayName = 'CheckItem';
