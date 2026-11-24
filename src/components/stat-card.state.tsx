'use client';

import * as React from 'react';
import { Button } from './button';
import type { CardError } from './card-state';
import { StatusGlyph } from './status-glyph';

const isCardError = (e: unknown): e is CardError =>
  typeof e === 'object' && e !== null && 'message' in e && !React.isValidElement(e);

/** One-line empty and error bodies, so a stat card keeps its height when the state changes. */
export const StatStateBody = ({
  state,
  empty,
  error,
  onRetry,
}: {
  state: 'empty' | 'error';
  empty?: React.ReactNode;
  error?: CardError | React.ReactNode;
  onRetry?: () => void;
}) => {
  if (state === 'empty')
    return (
      <div className="text-ui text-muted-foreground" data-slot="stat-card-empty">
        {empty ?? 'No data for this period.'}
      </div>
    );
  const detail = isCardError(error) ? error : { message: error ?? 'Could not load this data.' };
  // One row, so the error body is never taller than a value line.
  return (
    <div className="flex h-7 min-w-0 items-center gap-2 text-ui" data-slot="stat-card-error">
      <StatusGlyph shape="alert" tone="destructive" />
      <span className="min-w-0 truncate">{detail.message}</span>
      {detail.reference && (
        <code
          className="min-w-0 shrink truncate font-mono text-xs text-muted-foreground"
          title={detail.reference}
        >
          {detail.reference}
        </code>
      )}
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          className="relative z-10 ml-auto shrink-0"
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </div>
  );
};
