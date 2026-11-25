'use client';

import * as React from 'react';
import { parseRelativeRange, resolveDateRange, type DateRange } from '../lib/relative-range';
import { Button } from './button';
import { Input } from './input';

export const toDay = (d: Date): string =>
  `${String(d.getFullYear())}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Server-safe stand-in of about the final width: fixed locale and UTC, hidden until mount. */
export const placeholderRange = (range: DateRange): string => {
  const fmt = (d: Date): string =>
    d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: 'UTC',
    });
  return `${fmt(range.from)} to ${fmt(range.to)}`;
};

/** The Custom day pair: From, To and Apply, with a message when the pair is not a range. */
export const CustomRange = ({
  initial,
  onApply,
}: {
  initial?: DateRange;
  onApply: (range: DateRange) => void;
}) => {
  const [start] = React.useState(() => initial && resolveDateRange(initial));
  const [from, setFrom] = React.useState(start ? toDay(start.from) : '');
  const [to, setTo] = React.useState(start ? toDay(start.to) : '');
  const [error, setError] = React.useState(false);
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-2" data-slot="date-range-custom">
      <div className="grid grid-cols-2 gap-2">
        <Input
          size="sm"
          type="date"
          aria-label="From"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setError(false);
          }}
        />
        <Input
          size="sm"
          type="date"
          aria-label="To"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setError(false);
          }}
        />
      </div>
      <Button
        size="sm"
        disabled={!from || !to}
        onClick={() => {
          const r = parseRelativeRange(`${from} to ${to}`);
          if (r) onApply(r);
          else setError(true);
        }}
      >
        Apply
      </Button>
      {error && (
        <p role="alert" className="m-0 text-xs text-destructive">
          From must be before To.
        </p>
      )}
    </div>
  );
};

export const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 2v4M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);
