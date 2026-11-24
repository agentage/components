'use client';

import * as React from 'react';
import { copyText } from '../lib/copy-text';
import { useControlled } from '../lib/use-controlled';
import { isCopyKey } from './data-tree.row';
import { countAfter, indexAt, isAtBottom, lineText, type LogLine } from './log-view.model';

export interface FollowOptions {
  follow?: boolean;
  defaultFollow?: boolean;
  onFollowChange?: (follow: boolean) => void;
  /** Every line, before the filter: the new count survives a filter change and a capped buffer. */
  lines: LogLine[];
  passes: (line: LogLine) => boolean;
  shown: LogLine[];
  offsets: number[];
  /** Keeps the top line in place while paused; off in wrap mode, where offsets are guesses. */
  anchor: boolean;
}

/** Live tail: follows the bottom, pauses on scroll up and counts lines after the last one seen. */
export const useFollow = (o: FollowOptions) => {
  const [following, setFollowing] = useControlled(
    o.follow,
    o.defaultFollow ?? false,
    o.onFollowChange
  );
  const { lines, passes, shown, offsets } = o;
  const last = lines.length > 0 ? lines[lines.length - 1].id : null;
  const [seen, setSeen] = React.useState(last);
  const [was, setWas] = React.useState(following);
  // Counts new lines from the moment following stops, however it stopped.
  if (was !== following) {
    setWas(following);
    if (!following) setSeen(last);
  }
  const scroller = React.useRef<HTMLDivElement>(null);
  const lastTop = React.useRef(0);
  const anchor = React.useRef<{ id: string; y: number } | null>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const tailKey = `${shown[shown.length - 1]?.id ?? ''}:${String(offsets[shown.length])}`;

  React.useLayoutEffect(() => {
    const el = scroller.current;
    if (!following || !el) return;
    el.scrollTop = el.scrollHeight;
    lastTop.current = el.scrollTop;
  }, [following, tailKey]);

  React.useLayoutEffect(() => {
    const el = scroller.current;
    const a = anchor.current;
    anchor.current = null;
    if (!el || following || !o.anchor) return;
    const j = a ? shown.findIndex((l) => l.id === a.id) : -1;
    if (a && j >= 0 && offsets[j] !== a.y) el.scrollTop += offsets[j] - a.y;
    const i = indexAt(offsets, el.scrollTop);
    if (shown[i]) anchor.current = { id: shown[i].id, y: offsets[i] };
  });

  const newCount = React.useMemo(
    () => (following ? 0 : countAfter(lines, seen, passes)),
    [following, lines, seen, passes]
  );

  const onScroll = (): void => {
    const el = scroller.current;
    if (!el) return;
    const top = el.scrollTop;
    const bottom = isAtBottom(top, el.clientHeight, el.scrollHeight);
    // Only an upward scroll pauses: growth below the view never moves scrollTop up.
    if (following && !bottom && top < lastTop.current - 1) setFollowing(false);
    else if (!following && bottom && top > lastTop.current) setFollowing(true);
    lastTop.current = top;
    setScrollTop(top);
  };

  const jumpToEnd = (): void => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
    setFollowing(true);
  };

  /** Scrolls the least distance that shows the band from `y` to `y + h`. */
  const reveal = (y: number, h: number): void => {
    const el = scroller.current;
    if (!el) return;
    if (y < el.scrollTop) el.scrollTop = y;
    else if (y + h > el.scrollTop + el.clientHeight) el.scrollTop = y + h - el.clientHeight;
  };

  return { scroller, following, newCount, scrollTop, onScroll, jumpToEnd, reveal };
};

/** Ids of the open lines, with a setter that keeps the same set when nothing changes. */
export const useOpenSet = () => {
  const [open, set] = React.useState<Set<string>>(() => new Set());
  const setOpen = React.useCallback((id: string, want: boolean): void => {
    set((s) => {
      if (s.has(id) === want) return s;
      const next = new Set(s);
      if (want) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);
  return [open, setOpen] as const;
};

/** Client height of the scroller, kept current with a ResizeObserver. */
export const useViewHeight = (
  scroller: React.RefObject<HTMLDivElement | null>,
  fallback: number
): number => {
  const [height, setHeight] = React.useState(fallback);
  React.useLayoutEffect(() => {
    const el = scroller.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => el.clientHeight && setHeight(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [scroller]);
  return height;
};

export interface LogKeysOptions {
  shown: LogLine[];
  activeIndex: number;
  isOpen: (line: LogLine) => boolean;
  canOpen: (line: LogLine) => boolean;
  setOpen: (id: string, open: boolean) => void;
  pick: (line: LogLine) => void;
  move: (index: number) => void;
  jumpToEnd: () => void;
}

/** Grid keys: Up, Down, Home, End move; Enter picks; Right and Left open and close; Ctrl+C copies. */
export const useLogKeys = (o: LogKeysOptions) => (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.target !== e.currentTarget) return;
  const { shown, activeIndex: i, move } = o;
  const current = shown[i] as LogLine | undefined;
  if (current && isCopyKey(e)) {
    void copyText(lineText(current));
    return;
  }
  const can = current !== undefined && o.canOpen(current);
  const keys: Record<string, (() => void) | undefined> = {
    ArrowDown: () => move(i + 1),
    ArrowUp: () => move(i < 0 ? shown.length - 1 : i - 1),
    Home: () => move(0),
    End: () => {
      move(shown.length - 1);
      o.jumpToEnd();
    },
    Enter: current && (() => o.pick(current)),
    ArrowRight: can && !o.isOpen(current) ? () => o.setOpen(current.id, true) : undefined,
    ArrowLeft: can && o.isOpen(current) ? () => o.setOpen(current.id, false) : undefined,
  };
  const run = keys[e.key];
  if (!run) return;
  e.preventDefault();
  run();
};
