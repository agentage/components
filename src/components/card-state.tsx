'use client';

import * as React from 'react';
import { useAnnounce } from '../lib/use-announce';
import { cn } from '../lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { CopyButton } from './copy-button';
import { EmptyState } from './empty-state';
import { IconButton } from './icon-button';
import { RelativeTime, type RelativeTimeValue } from './relative-time';
import { Skeleton } from './skeleton';
import { StatusGlyph } from './status-glyph';

export type CardState = 'ready' | 'loading' | 'empty' | 'error' | 'stale';

export interface CardError {
  message: React.ReactNode;
  /** Support reference such as a request id; shown mono with a copy button. */
  reference?: string;
}

export interface CardStateBodyProps {
  state: 'loading' | 'empty' | 'error';
  skeleton?: React.ReactNode;
  empty?: React.ReactNode;
  error?: CardError | React.ReactNode;
  onRetry?: () => void;
}

const isCardError = (e: unknown): e is CardError =>
  typeof e === 'object' && e !== null && 'message' in e && !React.isValidElement(e);

const DefaultSkeleton = () => (
  <div className="flex flex-col gap-2 py-1">
    <Skeleton className="h-6 w-24 bg-foreground/10" />
    <Skeleton variant="text" className="w-11/12 bg-foreground/10" />
    <Skeleton variant="text" className="w-2/3 bg-foreground/10" />
  </div>
);

/** The body a card shows while loading, empty or failed; the frame around it stays put. */
export const CardStateBody = ({ state, skeleton, empty, error, onRetry }: CardStateBodyProps) => {
  if (state === 'loading') return <>{skeleton ?? <DefaultSkeleton />}</>;
  if (state === 'empty')
    return <>{empty ?? <EmptyState title="No data for this period" className="py-4" />}</>;
  const detail = isCardError(error) ? error : { message: error ?? 'Could not load this data.' };
  return (
    <div className="flex flex-col items-start gap-2 py-1 text-ui" data-slot="card-error">
      <span className="flex items-center gap-2 font-medium">
        <StatusGlyph shape="alert" tone="destructive" />
        {detail.message}
      </span>
      {detail.reference && (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          Reference <code className="font-mono text-foreground">{detail.reference}</code>
          <CopyButton text={detail.reference} label="Copy reference" iconOnly variant="ghost" />
        </span>
      )}
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};

const SAY: Record<CardState, string> = {
  ready: 'Loaded',
  loading: 'Loading',
  empty: 'No data',
  error: 'Failed to load',
  stale: 'Showing stale data',
};

// Changes within this window merge into one message, so a dashboard refresh is heard once.
const BATCH_MS = 150;
const queue = new Map<string, { label?: string; state: CardState }>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

const flush = (say: (message: string) => void): void => {
  const byState = new Map<CardState, string[]>();
  queue.forEach(({ label, state }) =>
    byState.set(state, [...(byState.get(state) ?? []), label ?? ''])
  );
  queue.clear();
  flushTimer = null;
  const parts = [...byState].map(([state, labels]) => {
    const named = labels.filter(Boolean);
    return named.length ? `${named.join(', ')}: ${SAY[state]}` : SAY[state];
  });
  if (parts.length) say(parts.join('. '));
};

/** Announces state changes politely, merged across cards; the first render stays quiet. */
export const CardAnnounce = ({ state, label }: { state: CardState; label?: string }) => {
  const announce = useAnnounce();
  const id = React.useId();
  const shown = React.useRef(state);
  React.useEffect(() => () => void queue.delete(id), [id]);
  React.useEffect(() => {
    // Compare, not a first-run flag: StrictMode runs effects twice on mount.
    if (shown.current === state) return;
    shown.current = state;
    queue.set(id, { label, state });
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(() => flush(announce), BATCH_MS);
  }, [state, label, announce, id]);
  return null;
};

const RefreshIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

export interface CardMetaProps {
  /** Where the figures come from, for example a region or a feed. */
  source?: React.ReactNode;
  /** Time of the last update, shown as "Updated 2 min ago". */
  updatedAt?: RelativeTimeValue;
  /** Adds a Stale badge to the meta line. */
  stale?: boolean;
  /** Shows a refresh button at the end of the meta line. */
  onRefresh?: () => void;
  /** Spins the refresh button and ignores presses while true. */
  refreshing?: boolean;
}

/** The footer meta line: source, "updated n min ago", a stale badge and a refresh button. */
export const CardMeta = ({ source, updatedAt, stale, onRefresh, refreshing }: CardMetaProps) => (
  <div
    className="flex h-6 w-full min-w-0 items-center gap-2 text-xs text-muted-foreground"
    data-slot="card-meta"
  >
    {source && <span className="min-w-0 truncate">{source}</span>}
    {updatedAt !== undefined && (
      <span className="shrink-0">
        Updated <RelativeTime value={updatedAt} />
      </span>
    )}
    {stale && (
      <Badge variant="outline-muted" data-slot="card-stale">
        Stale
      </Badge>
    )}
    {onRefresh && (
      <IconButton
        size="sm"
        icon={<RefreshIcon />}
        aria-label="Refresh"
        // aria-disabled, not disabled: a disabled button drops keyboard focus to the page.
        aria-disabled={refreshing || undefined}
        aria-busy={refreshing || undefined}
        onClick={() => {
          if (!refreshing) onRefresh();
        }}
        className={cn('ml-auto', refreshing && '[&_svg]:motion-safe:animate-spin')}
      />
    )}
  </div>
);
