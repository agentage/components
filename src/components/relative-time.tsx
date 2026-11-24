'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { formatRelativeTime, toDate, type RelativeTimeValue } from '../lib/relative-time-format';

export { formatRelativeTime } from '../lib/relative-time-format';
export type { RelativeTimeValue } from '../lib/relative-time-format';

const TICK_MS = 15_000;

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
let now = Date.now();

// One interval for every mounted RelativeTime, so a long list re-renders in one pass.
const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
};

// Whole seconds keep the snapshot stable between calls before the shared timer starts.
const snapshot = (): number => (timer ? now : (now = Math.floor(Date.now() / 1000) * 1000));
const still = (): (() => void) => () => undefined;
const server = (): null => null;

/**
 * Null on the server and in the hydration render, so the text always comes from the client
 * clock, time zone and locale; only relative text subscribes to the shared timer.
 */
const useNow = (live: boolean): number | null =>
  React.useSyncExternalStore(live ? subscribe : still, snapshot, server);

export interface RelativeTimeProps extends Omit<React.TimeHTMLAttributes<HTMLElement>, 'children'> {
  value: RelativeTimeValue;
  /** `relative` (default) or `absolute` mono time such as `14:03:22`. */
  format?: 'relative' | 'absolute';
}

const exact = (date: Date): string =>
  date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' });

const clock = (date: Date): string => date.toLocaleTimeString(undefined, { hour12: false });

/** A `<time>` that keeps itself current on one shared timer; the exact time is in the title. */
export const RelativeTime = React.forwardRef<HTMLTimeElement, RelativeTimeProps>(
  ({ value, format = 'relative', className, ...props }, ref) => {
    const current = useNow(format === 'relative');
    const date = toDate(value);
    const valid = !Number.isNaN(date.getTime());
    const ready = current !== null && valid;
    return (
      <time
        ref={ref}
        dateTime={valid ? date.toISOString() : undefined}
        title={ready ? exact(date) : undefined}
        className={cn(
          'cursor-default whitespace-nowrap tabular-nums',
          format === 'absolute' && 'font-mono',
          className
        )}
        data-slot="relative-time"
        {...props}
      >
        {!ready
          ? // Holds about the final width until the client text arrives.
            valid && (
              <span className="invisible">{format === 'absolute' ? '00:00:00' : '00 min ago'}</span>
            )
          : format === 'absolute'
            ? clock(date)
            : formatRelativeTime(date, current)}
      </time>
    );
  }
);
RelativeTime.displayName = 'RelativeTime';
