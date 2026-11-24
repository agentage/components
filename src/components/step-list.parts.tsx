'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Disclosure } from './disclosure';
import { StatusGlyph } from './status-glyph';
import { ROW_STATUS_GLYPH, type RowStatus, type RowStatusAlias } from './status-glyph.status';

/** Status of a Step; the shared row vocabulary plus its aliases. */
export type StepStatus = RowStatus | RowStatusAlias;

interface StepListContextValue {
  size: 'sm' | 'md';
  glyphs: boolean;
}

export const StepListContext = React.createContext<StepListContextValue>({
  size: 'md',
  glyphs: false,
});

const LABEL: Record<RowStatus, string> = {
  ok: 'Done',
  error: 'Failed',
  running: 'Running',
  pending: 'Pending',
  skipped: 'Skipped',
};

export const HEAD =
  'grid w-full grid-cols-[46px_16px_minmax(0,1fr)_auto] items-center gap-2 px-2.5 text-left';
export const HEAD_SIZE = { sm: 'h-7 text-xs', md: 'h-9 text-ui' };

// Connector halves above and below the glyph (column centre at 10 + 46 + 8 + 8 = 72 px).
export const CONNECTOR = [
  'relative',
  'group-data-[glyphs]/steps:before:absolute group-data-[glyphs]/steps:before:left-[71.5px] group-data-[glyphs]/steps:before:top-0 group-data-[glyphs]/steps:before:h-[7px] group-data-[glyphs]/steps:before:w-px group-data-[glyphs]/steps:before:bg-border',
  'group-data-[glyphs]/steps:after:absolute group-data-[glyphs]/steps:after:left-[71.5px] group-data-[glyphs]/steps:after:top-[21px] group-data-[glyphs]/steps:after:bottom-0 group-data-[glyphs]/steps:after:w-px group-data-[glyphs]/steps:after:bg-border',
  'first:before:hidden [&:nth-last-child(1_of_[data-slot=step])]:after:hidden',
];

interface StepHeadProps {
  offset?: React.ReactNode;
  icon?: React.ReactNode;
  label: React.ReactNode;
  duration?: React.ReactNode;
  mono: boolean;
  status: RowStatus;
  errorLabel: string;
}

export const StepHead = ({
  offset,
  icon,
  label,
  duration,
  mono,
  status,
  errorLabel,
}: StepHeadProps) => {
  const { glyphs } = React.useContext(StepListContext);
  const error = status === 'error';
  const iconBox = (
    <span
      className={cn('flex [&_svg]:size-3.5', error ? 'text-destructive' : 'text-muted-foreground')}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
  return (
    <>
      <span className="font-mono text-muted-foreground">{offset}</span>
      {glyphs ? (
        <span className="relative z-[1] flex">
          <StatusGlyph {...ROW_STATUS_GLYPH[status]} label={LABEL[status]} />
        </span>
      ) : (
        iconBox
      )}
      <span
        className={cn(
          'flex min-w-0 items-center gap-1.5',
          mono && 'font-mono',
          error && 'text-destructive'
        )}
      >
        {glyphs && icon && iconBox}
        <span className="truncate">{label}</span>
        {error && ' '}
        {error && <span className="shrink-0">({errorLabel})</span>}
      </span>
      <span className="text-muted-foreground">{duration}</span>
    </>
  );
};

export const StepDetail = ({ id, open, error, children }: StepDetailProps) => (
  <Disclosure
    id={id}
    open={open}
    className={cn(
      'pb-2.5 pl-20 pr-2.5 text-xs wrap-anywhere',
      error ? 'text-destructive' : 'text-muted-foreground'
    )}
  >
    {children}
  </Disclosure>
);

interface StepDetailProps {
  id: string;
  open: boolean;
  error: boolean;
  children: React.ReactNode;
}
