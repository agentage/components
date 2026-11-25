'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { useAnchorPosition } from '../lib/use-anchor-position';
import { useRovingFocus } from '../lib/use-roving-focus';
import { cn } from '../lib/utils';
import { statusBarTickVariants, statusBarTrackVariants } from './status-bar.variants';

export type StatusBarTone =
  'success' | 'destructive' | 'warning' | 'info' | 'primary' | 'muted' | 'pending' | 'empty';

export interface StatusBarCell {
  /** Stable key, for example the date; keeps focus and the tooltip on the same cell as new ones arrive. */
  id?: string;
  tone: StatusBarTone;
  /** Accessible name of the tick, for example `Nov 3, 99.2 percent, degraded`. */
  label: string;
  /** Richer tooltip content; `label` by default. */
  title?: React.ReactNode;
  pulse?: boolean;
  onClick?: () => void;
}

export interface StatusBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Oldest first: the newest cell sits on the right. */
  cells: StatusBarCell[];
  /** Accessible name of the bar, for example `Last 30 days of API`. */
  label: string;
  /** `md` 7 by 28 px ticks (default); `sm` 6 by 14 px, the compact strip for rows and cards. */
  size?: 'sm' | 'md';
  /** Total ticks; missing ones pad the left as no-data ticks. */
  slots?: number;
  /** Ticks stretch to fill the width. */
  fill?: boolean;
  /** Leading name, for example the service. */
  name?: React.ReactNode;
  /** Trailing summary, for example `99.98 percent`. */
  summary?: React.ReactNode;
}

const TIP =
  'pointer-events-none z-[var(--z-overlay,50)] max-w-xs rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-[var(--shadow-popover)]';

const TickTip = ({
  anchor,
  id,
  children,
}: {
  anchor: HTMLElement;
  id: string;
  children: React.ReactNode;
}) => {
  const anchorRef = React.useRef<HTMLElement>(anchor);
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const { top, left } = useAnchorPosition(anchorRef, surfaceRef, true, { side: 'top' });
  return createPortal(
    <div
      ref={surfaceRef}
      id={id}
      role="tooltip"
      style={{ position: 'fixed', top, left }}
      className={TIP}
    >
      {children}
    </div>,
    document.body
  );
};

/** A row of status ticks, newest on the right; hover or focus a tick for its tooltip. */
export const StatusBar = React.forwardRef<HTMLDivElement, StatusBarProps>(
  ({ cells, label, size = 'md', slots, fill = false, name, summary, className, ...props }, ref) => {
    const track = React.useRef<HTMLDivElement>(null);
    const [active, setActive] = React.useState<{ key: string; el: HTMLElement } | null>(null);
    const tipId = `${React.useId()}-tip`;
    useRovingFocus(track, { selector: '[data-tick]', orientation: 'horizontal', loop: false });
    const shown = slots === undefined ? cells : cells.slice(Math.max(0, cells.length - slots));
    const pads = Math.max(0, (slots ?? 0) - shown.length);
    const keyOf = (c: StatusBarCell, i: number) => c.id ?? `i${String(i)}`;
    const cell = active ? shown.find((c, i) => keyOf(c, i) === active.key) : undefined;
    const hide = () => setActive(null);
    const bind = (key: string) => ({
      onPointerEnter: (e: React.PointerEvent<HTMLElement>) =>
        setActive({ key, el: e.currentTarget }),
      onFocus: (e: React.FocusEvent<HTMLElement>) => setActive({ key, el: e.currentTarget }),
      onPointerLeave: hide,
      onBlur: hide,
      onKeyDown: (e: React.KeyboardEvent) => e.key === 'Escape' && hide(),
    });
    const bar = (
      <div
        ref={track}
        role="group"
        aria-label={label}
        className={statusBarTrackVariants({ size, fill })}
        data-slot="status-bar-track"
      >
        {Array.from({ length: pads }, (_, i) => (
          <span
            key={`pad-${String(i)}`}
            aria-hidden="true"
            className={statusBarTickVariants({ tone: 'empty', size, fill })}
          />
        ))}
        {shown.map((c, i) => {
          const key = keyOf(c, i);
          const common = {
            'data-tick': '',
            'data-tone': c.tone,
            'aria-label': c.label,
            'aria-describedby': active?.key === key ? tipId : undefined,
            ...bind(key),
          };
          const cls = statusBarTickVariants({
            tone: c.tone,
            size,
            fill,
            pulse: c.pulse,
            interactive: !!c.onClick,
          });
          return c.onClick ? (
            <button key={key} type="button" className={cls} onClick={c.onClick} {...common} />
          ) : (
            <span key={key} role="img" tabIndex={-1} className={cls} {...common} />
          );
        })}
        {active && cell && (
          <TickTip key={active.key} anchor={active.el} id={tipId}>
            {cell.title ?? cell.label}
          </TickTip>
        )}
      </div>
    );
    return (
      <div
        ref={ref}
        className={cn('flex min-w-0 items-center gap-3', fill && 'w-full', className)}
        data-slot="status-bar"
        data-size={size}
        {...props}
      >
        {name !== undefined && <span className="min-w-0 shrink-0 truncate text-ui">{name}</span>}
        {bar}
        {summary !== undefined && (
          <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">
            {summary}
          </span>
        )}
      </div>
    );
  }
);
StatusBar.displayName = 'StatusBar';
