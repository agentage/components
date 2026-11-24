'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { useFollow, useLogKeys, useOpenSet, useViewHeight } from './log-view.hooks';
import {
  LOG_LEVELS,
  offsetsOf,
  windowOf,
  type LogLevelStyle,
  type LogLine,
} from './log-view.model';
import { LogRow } from './log-view.row';

export type { LogLevel, LogLine } from './log-view.model';

export interface LogViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onScroll'> {
  /** Oldest first. Keep ids stable so lines update in place; a capped buffer is fine. */
  lines: LogLine[];
  /** Levels to show; all by default. */
  filter?: string[];
  /** Marks this text in every line. */
  highlight?: string;
  /** Long lines wrap instead of cutting. Turns windowing off, so keep wrapped logs to a few thousand lines. */
  wrap?: boolean;
  showTime?: 'absolute' | 'relative' | false;
  /** Live tail: stays at the bottom while lines arrive. Pair with `onFollowChange`. */
  follow?: boolean;
  onFollowChange?: (follow: boolean) => void;
  /** Called when a line is picked by click or Enter. */
  onLineOpen?: (line: LogLine) => void;
  /** Lines with `fields` open a DataTree below them. Default true. */
  expandable?: boolean;
  'aria-label'?: string;
}

const DETAIL_GUESS = 160;
const rowHeight = 24;

/** A windowed, keyboard-driven log with levels, live tail and expandable structured lines. */
export const LogView = React.forwardRef<HTMLDivElement, LogViewProps>((props, ref) => {
  const {
    lines,
    filter,
    highlight,
    wrap = false,
    showTime = 'absolute',
    follow,
    onFollowChange,
    onLineOpen,
    expandable = true,
    className,
    'aria-label': label = 'Log',
    ...rest
  } = props;
  const base = React.useId();
  const passes = React.useCallback(
    (l: LogLine) => !filter || filter.includes(l.level ?? 'info'),
    [filter]
  );
  const shown = React.useMemo(
    () => (filter ? lines.filter(passes) : lines),
    [lines, filter, passes]
  );
  const showSource = React.useMemo(() => shown.some((l) => l.source), [shown]);
  const [open, setOpen] = useOpenSet();
  const [detailH, setDetailH] = React.useState<Record<string, number>>({});
  const [active, setActive] = React.useState<string | null>(null);
  const canOpen = (l: LogLine) => expandable && l.fields !== undefined;
  const isOpen = (l: LogLine) => open.has(l.id) && canOpen(l);
  const extra = shown.map((l) => (isOpen(l) ? (detailH[l.id] ?? DETAIL_GUESS) : 0));
  const offsets = offsetsOf(shown.length, rowHeight, extra);
  const tail = useFollow({
    ...{ follow, onFollowChange, lines, passes, shown, offsets },
    anchor: !wrap,
  });
  const { scroller } = tail;
  const viewH = useViewHeight(scroller, 480);
  const [start, end] = wrap ? [0, shown.length] : windowOf(offsets, tail.scrollTop, viewH);
  const activeIndex = active === null ? -1 : shown.findIndex((l) => l.id === active);
  const rowId = (l: LogLine) => `${base}-${l.id}`;
  // The active row stays in the page so aria-activedescendant always resolves.
  const indices = Array.from({ length: end - start }, (_, k) => start + k);
  if (activeIndex >= 0 && activeIndex < start) indices.unshift(activeIndex);
  if (activeIndex >= end) indices.push(activeIndex);

  const pick = (l: LogLine): void => {
    setActive(l.id);
    if (canOpen(l)) setOpen(l.id, !open.has(l.id));
    onLineOpen?.(l);
  };
  const latest = React.useRef({ pick, shown });
  React.useLayoutEffect(() => {
    latest.current = { pick, shown };
  });
  const onPick = React.useCallback(
    (id: string) => {
      const l = latest.current.shown.find((x) => x.id === id);
      if (l) latest.current.pick(l);
      // Focus stays on the grid, so keys keep working when the row scrolls out of the window.
      scroller.current?.focus({ preventScroll: true });
    },
    [scroller]
  );
  const onHeight = React.useCallback(
    (id: string, h: number) => setDetailH((m) => (m[id] === h ? m : { ...m, [id]: h })),
    []
  );
  const move = (i: number): void => {
    const k = Math.max(0, Math.min(shown.length - 1, i));
    if (!shown[k]) return;
    setActive(shown[k].id);
    if (!wrap) tail.reveal(offsets[k], rowHeight);
  };
  const onKeyDown = useLogKeys({
    shown,
    activeIndex,
    isOpen,
    canOpen,
    setOpen,
    pick,
    move,
    jumpToEnd: tail.jumpToEnd,
  });
  return (
    <div
      ref={ref}
      className={cn('relative flex h-80 min-h-0 flex-col', className)}
      data-slot="log-view"
      {...rest}
    >
      <div
        ref={scroller}
        role="grid"
        aria-label={label}
        aria-rowcount={shown.length}
        aria-activedescendant={activeIndex >= 0 ? rowId(shown[activeIndex]) : undefined}
        tabIndex={0}
        onScroll={tail.onScroll}
        onKeyDown={onKeyDown}
        className="min-h-0 flex-1 overflow-auto overscroll-contain focus-ring"
        data-slot="log-view-scroller"
        data-following={tail.following || undefined}
      >
        <div className="relative" style={wrap ? undefined : { height: offsets[shown.length] }}>
          {indices.map((i) => {
            const l = shown[i];
            return (
              <LogRow
                key={l.id}
                id={rowId(l)}
                line={l}
                index={i}
                style={
                  (LOG_LEVELS as Record<string, LogLevelStyle>)[l.level ?? 'info'] ??
                  LOG_LEVELS.info
                }
                top={wrap ? undefined : offsets[i]}
                height={rowHeight}
                wrap={wrap}
                showTime={showTime}
                showSource={showSource}
                highlight={highlight}
                active={l.id === active}
                expanded={canOpen(l) ? isOpen(l) : undefined}
                onPick={onPick}
                onHeight={onHeight}
              />
            );
          })}
        </div>
      </div>
      {tail.newCount > 0 && (
        <Button
          size="sm"
          onClick={tail.jumpToEnd}
          className="absolute bottom-2 left-1/2 -translate-x-1/2"
          data-slot="log-view-jump"
        >
          {tail.newCount} new {tail.newCount === 1 ? 'line' : 'lines'}
        </Button>
      )}
    </div>
  );
});
LogView.displayName = 'LogView';
