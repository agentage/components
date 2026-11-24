'use client';

import * as React from 'react';
import { announce } from './use-announce';
import {
  dropAt,
  keyMove,
  makeGhost,
  sameTarget,
  type DragGroup,
  type DragMove,
  type DropTarget,
} from './drag-reorder';

export type { DragGroup, DragMove, DropTarget } from './drag-reorder';

export interface DragReorderOptions {
  /** Holds the items and the drop groups; positioned, so the insertion line can sit in it. */
  rootRef: React.RefObject<HTMLElement | null>;
  /** Scrolls while a drag nears its edge; the root by default. */
  scrollRef?: React.RefObject<HTMLElement | null>;
  /** Current groups in order, each with its item ids in order. */
  layout: () => DragGroup[];
  onMove?: (move: DragMove) => void;
  /** Announcement after a keyboard move; "Moved to <group>, position n of m" by default. */
  describe?: (move: DragMove, total: number) => string;
  /** Pixels the pointer travels before a press becomes a drag, so a click still opens. */
  threshold?: number;
}

const INTERACTIVE = 'button, a, input, select, textarea, [role="checkbox"], [data-no-drag]';
const EDGE = 48;
const LONG_PRESS = 300;
const ARROWS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
const FOCUSABLE = '[data-card-activator], button, a[href], [tabindex]:not([tabindex="-1"])';

const itemEl = (root: HTMLElement, id: string) =>
  root.querySelector<HTMLElement>(
    `[data-drag-id="${typeof CSS === 'undefined' ? id : CSS.escape(id)}"]`
  );

/** Pointer and keyboard reordering between and inside groups; the caller owns the data. */
export const useDragReorder = (options: DragReorderOptions) => {
  const opts = React.useRef(options);
  React.useLayoutEffect(() => {
    opts.current = options;
  });
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [target, setTarget] = React.useState<DropTarget | null>(null);
  const active = React.useRef<((commit: boolean) => void) | null>(null);
  React.useEffect(() => () => active.current?.(false), []);

  const start = (id: string, e: React.PointerEvent<HTMLElement>): void => {
    const { rootRef, scrollRef, threshold = 5 } = opts.current;
    const root = rootRef.current;
    const source = e.currentTarget;
    if (!root || e.button !== 0 || !opts.current.onMove || active.current) return;
    const hit = (e.target as HTMLElement).closest(INTERACTIVE);
    // A stretched [data-card-activator] (button or link) still starts a drag; other controls do not.
    if (hit && hit !== source && !hit.hasAttribute('data-card-activator')) return;
    const x0 = e.clientX;
    const y0 = e.clientY;
    const box = source.getBoundingClientRect();
    let ghost: HTMLElement | null = null;
    let drop: DropTarget | null = null;
    let point = { x: x0, y: y0 };
    let frame = 0;
    let pending = 0;
    // Touch drags after a long press, so a swipe on a card still scrolls the board.
    let armed = e.pointerType !== 'touch';
    const hold = armed ? 0 : window.setTimeout(() => (armed = true), LONG_PRESS);
    const place = (): void => {
      pending = 0;
      if (!ghost) return;
      ghost.style.transform = `translate(${String(point.x - x0)}px, ${String(point.y - y0)}px)`;
      const next = dropAt(root, opts.current.layout(), id, point.x, point.y);
      if (!sameTarget(next, drop)) setTarget(next);
      drop = next;
    };
    const schedule = (): void => {
      if (!pending) pending = requestAnimationFrame(place);
    };
    const scroll = (): void => {
      const sc = scrollRef?.current ?? root;
      const r = sc.getBoundingClientRect();
      const dx = point.x < r.left + EDGE ? -12 : point.x > r.right - EDGE ? 12 : 0;
      const dy = point.y < r.top + EDGE ? -12 : point.y > r.bottom - EDGE ? 12 : 0;
      if ((dx || dy) && r.width > 0) {
        sc.scrollBy(dx, dy);
        schedule();
      }
      frame = requestAnimationFrame(scroll);
    };
    const move = (ev: PointerEvent): void => {
      if (ev.pointerId !== e.pointerId) return;
      point = { x: ev.clientX, y: ev.clientY };
      if (!ghost && Math.hypot(point.x - x0, point.y - y0) < threshold) return;
      if (!armed) return end(false);
      if (!ghost) {
        ghost = makeGhost(source, box);
        document.body.appendChild(ghost);
        document.body.style.userSelect = 'none';
        setDragging(id);
        frame = requestAnimationFrame(scroll);
      }
      schedule();
    };
    const end = (commit: boolean): void => {
      active.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('pointerdown', other);
      window.removeEventListener('blur', cancel);
      window.removeEventListener('keydown', esc);
      window.removeEventListener('touchmove', still);
      clearTimeout(hold);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      if (!ghost) return;
      ghost.remove();
      document.body.style.userSelect = '';
      // The click that ends a drag must not open the card.
      const swallow = (c: MouseEvent): void => c.stopPropagation();
      window.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => window.removeEventListener('click', swallow, true), 0);
      setDragging(null);
      setTarget(null);
      // The last pointer position wins, even when its frame has not run yet.
      const final = commit ? dropAt(root, opts.current.layout(), id, point.x, point.y) : null;
      if (final) {
        const { line: _line, ...to } = final;
        opts.current.onMove?.({ id, ...to });
      }
    };
    const up = (ev: PointerEvent): void => {
      if (ev.pointerId !== e.pointerId) return;
      point = { x: ev.clientX, y: ev.clientY };
      end(true);
    };
    const cancel = (): void => end(false);
    // A second finger (a pinch or a palm) ends the drag instead of leaving it half-owned.
    const other = (ev: PointerEvent): void => {
      if (ev.pointerId !== e.pointerId) end(false);
    };
    const still = (ev: TouchEvent): void => {
      if (armed) ev.preventDefault();
    };
    const esc = (ev: KeyboardEvent): void => {
      if (ev.key === 'Escape') end(false);
    };
    active.current = end;
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('pointerdown', other);
    window.addEventListener('blur', cancel);
    window.addEventListener('keydown', esc);
    window.addEventListener('touchmove', still, { passive: false });
  };

  const onKeyDown = (id: string, e: React.KeyboardEvent<HTMLElement>): void => {
    if (!e.altKey || !ARROWS.has(e.key) || !opts.current.onMove) return;
    // Alt + Left and Right also mean Back and Forward in browsers: never let them through.
    e.preventDefault();
    const result = keyMove(opts.current.layout(), id, e.key);
    if (!result) {
      announce('Already at the edge');
      return;
    }
    const { move, total } = result;
    opts.current.onMove(move);
    const say = opts.current.describe?.(move, total);
    announce(
      say ?? `Moved to ${move.toGroup}, position ${String(move.toIndex + 1)} of ${String(total)}`
    );
    requestAnimationFrame(() => {
      const root = opts.current.rootRef.current;
      const el = root && itemEl(root, id);
      (el?.querySelector<HTMLElement>(FOCUSABLE) ?? el)?.focus();
    });
  };

  return {
    dragging,
    target,
    itemProps: (id: string) => ({
      'data-drag-id': id,
      'data-dragging': dragging === id || undefined,
      onPointerDown: (e: React.PointerEvent<HTMLElement>) => start(id, e),
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => onKeyDown(id, e),
    }),
  };
};
