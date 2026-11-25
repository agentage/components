'use client';

import * as React from 'react';
import { Button } from './button';
import type { CardError, CardFallback } from './card-state';
import { Skeleton } from './skeleton';
import { StatusGlyph } from './status-glyph';

const isCardError = (e: unknown): e is CardError =>
  typeof e === 'object' && e !== null && 'message' in e && !React.isValidElement(e);

// bg-muted is the page tone and vanishes on a card surface, so bones use a foreground tint.
const StatSkeleton = ({ hint }: { hint: boolean }) => (
  <div className="flex flex-col gap-1.5" data-slot="stat-card-skeleton">
    <Skeleton className="h-6 w-20 bg-foreground/10" />
    {hint && <Skeleton variant="text" className="h-3 w-28 bg-foreground/10" />}
  </div>
);

/** One-line bodies, so a stat card keeps its height when the state changes. */
export const StatStateBody = ({
  state,
  fallback = {},
  hint,
}: {
  state: 'loading' | 'empty' | 'error';
  fallback?: CardFallback;
  hint: boolean;
}) => {
  const { loading, empty, error, onRetry } = fallback;
  if (state === 'loading') return <>{loading ?? <StatSkeleton hint={hint} />}</>;
  if (state === 'empty')
    return (
      <div className="text-ui text-muted-foreground" data-slot="stat-card-empty">
        {empty ?? 'No data for this period.'}
      </div>
    );
  const detail = isCardError(error) ? error : { message: error ?? 'Could not load this data.' };
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
