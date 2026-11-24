'use client';

import * as React from 'react';
import { useRovingFocus } from '../lib/use-roving-focus';
import { cn, MUTED_ON_HOVER } from '../lib/utils';
import {
  CONNECTOR,
  HEAD,
  HEAD_SIZE,
  StepDetail,
  StepHead,
  StepListContext,
  useOpen,
  type StepStatus,
} from './step-list.parts';
import { normalizeRowStatus } from './status-glyph.status';

export type { StepStatus } from './step-list.parts';

export interface StepListProps extends React.HTMLAttributes<HTMLOListElement> {
  /** `md` 36 px rows at 13 px (default), `sm` 28 px sub-step rows at 12 px. */
  size?: 'sm' | 'md';
  /** A status glyph per step, joined by a connector line; the step icon moves next to the label. */
  glyphs?: boolean;
  /** Last row, for example the total duration. */
  footer?: React.ReactNode;
}

const ROVING = '[data-slot="step-head"]';

/** Compact step timeline: a bordered `ol` of `Step` rows; Up and Down move between steps. */
export const StepList = React.forwardRef<HTMLOListElement, StepListProps>(
  ({ size = 'md', glyphs = false, footer, className, children, ...props }, ref) => {
    const inner = React.useRef<HTMLOListElement>(null);
    React.useImperativeHandle(ref, () => inner.current as HTMLOListElement);
    useRovingFocus(inner, { selector: ROVING, loop: false });
    return (
      <StepListContext.Provider value={{ size, glyphs }}>
        <ol
          ref={inner}
          className={cn(
            'group/steps m-0 flex list-none flex-col divide-y divide-border rounded-lg border border-border p-0',
            className
          )}
          data-slot="step-list"
          data-glyphs={glyphs || undefined}
          {...props}
        >
          {children}
          {footer && (
            <li
              className={cn(
                'flex h-8 items-center justify-between gap-2 px-2.5 text-muted-foreground',
                size === 'md' ? 'text-ui' : 'text-xs'
              )}
              data-slot="step-list-footer"
            >
              {footer}
            </li>
          )}
        </ol>
      </StepListContext.Provider>
    );
  }
);
StepList.displayName = 'StepList';

export interface StepProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'title'> {
  label: React.ReactNode;
  /** Time since the start, shown first in mono, for example `+0:12`. */
  offset?: React.ReactNode;
  icon?: React.ReactNode;
  duration?: React.ReactNode;
  /** Monospace label, for tool and command names. */
  mono?: boolean;
  /** `error` marks the edge, colours the row and adds `errorLabel` as text. */
  status?: StepStatus;
  errorLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Step = React.forwardRef<HTMLLIElement, StepProps>(
  (
    {
      label,
      offset,
      icon,
      duration,
      mono = true,
      status: statusIn = 'ok',
      errorLabel = 'error',
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { size } = React.useContext(StepListContext);
    const [open, toggle] = useOpen(controlledOpen, defaultOpen, onOpenChange);
    const detailId = React.useId();
    const status = normalizeRowStatus(statusIn);
    const error = status === 'error';
    const head = { offset, icon, label, duration, mono, status, errorLabel };
    const expandable = children !== undefined && children !== null && children !== false;

    return (
      <li
        ref={ref}
        className={cn(
          CONNECTOR,
          error &&
            '[background:linear-gradient(var(--color-destructive),var(--color-destructive))_left/2px_100%_no-repeat]',
          size === 'md' && 'group-data-[glyphs]/steps:after:top-[25px]',
          size === 'md' && 'group-data-[glyphs]/steps:before:h-[11px]',
          className
        )}
        data-slot="step"
        data-status={status}
        {...props}
      >
        {expandable ? (
          <button
            type="button"
            className={cn(
              HEAD,
              HEAD_SIZE[size],
              'transition-colors hover:bg-accent focus-ring',
              MUTED_ON_HOVER
            )}
            aria-expanded={open}
            aria-controls={detailId}
            onClick={toggle}
            data-slot="step-head"
          >
            <StepHead {...head} />
          </button>
        ) : (
          <div className={cn(HEAD, HEAD_SIZE[size])}>
            <StepHead {...head} />
          </div>
        )}
        {expandable && (
          <StepDetail id={detailId} open={open} error={error}>
            {children}
          </StepDetail>
        )}
      </li>
    );
  }
);
Step.displayName = 'Step';
