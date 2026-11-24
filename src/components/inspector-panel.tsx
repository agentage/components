'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { OverlayLayerProvider, useOverlayLayer } from '../lib/overlay-layer';
import { useFocusOrigin } from '../lib/use-focus-origin';
import { useFocusTrap } from '../lib/use-focus-trap';
import { isPrepaintKey, resizableSplitVar } from '../lib/split-px';
import { useMounted } from '../lib/use-mounted';
import { usePersistedState } from '../lib/use-persisted-state';
import { DialogClose } from './dialog-shell';
import { useNarrowScreen } from './inspector-panel.narrow';
import { ResizableHandle } from './resizable.parts';

export interface InspectorPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  /** Extra header buttons, before Close. */
  actions?: React.ReactNode;
  /** Start width in px; the user resizes between `minWidth` and `maxWidth`. */
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  /**
   * Persist the width in localStorage under this key. Under SSR, also list the key in
   * `ResizableSplitPrepaint` so the server HTML already has the stored width.
   */
  storageKey?: string;
  closeLabel?: string;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const useWidth = (key: string | undefined, init: number, min: number, max: number) => {
  const [stored, setStored, restoring] = usePersistedState(key, init);
  const width = clamp(Number.isFinite(stored) && stored > 0 ? stored : init, min, max);
  const set = (n: number): void => setStored(clamp(Math.round(n), min, max));
  return [width, set, restoring] as const;
};

/**
 * In-page docked right panel for a selected item: 48 px header with Close, resizable from its
 * left edge, closes to 0 width with a transition. Below 760 px it is a full-screen modal dialog:
 * focus moves in and stays inside, Escape closes, focus returns to the opener.
 * Inside an app shell that already provides the aside region, render the content there instead.
 */
export const InspectorPanel = React.forwardRef<HTMLElement, InspectorPanelProps>(
  (
    {
      open,
      onOpenChange,
      title,
      actions,
      defaultWidth = 380,
      minWidth = 360,
      maxWidth = 420,
      storageKey,
      closeLabel = 'Close',
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const inner = React.useRef<HTMLElement>(null);
    React.useImperativeHandle(ref, () => inner.current as HTMLElement);
    const narrow = useNarrowScreen();
    const modal = open && narrow;
    useFocusTrap(inner, modal);
    const origin = useFocusOrigin(open, inner);
    // As a dialog it joins the shared stack, so Escape closes an open child layer first.
    const layer = useOverlayLayer(modal, {
      refs: [inner],
      onEscape: () => onOpenChange(false),
      modal: true,
    });
    const [width, setWidth, restoring] = useWidth(storageKey, defaultWidth, minWidth, maxWidth);
    const mounted = useMounted();
    // Before mount the prepaint variable carries the stored width, so hydration does not jump.
    const shownWidth =
      !mounted && isPrepaintKey(storageKey)
        ? `clamp(${String(minWidth)}px, var(${resizableSplitVar(storageKey)}, ${String(width)}px), ${String(maxWidth)}px)`
        : width;
    const grab = React.useRef<number | null>(null);
    const titleId = React.useId();
    const onKey = (e: React.KeyboardEvent): void => {
      const step = e.shiftKey ? 64 : 16;
      if (e.key === 'ArrowLeft') setWidth(width + step);
      else if (e.key === 'ArrowRight') setWidth(width - step);
      else if (e.key === 'Home') setWidth(minWidth);
      else if (e.key === 'End') setWidth(maxWidth);
      else return;
      e.preventDefault();
    };
    return (
      <aside
        ref={inner}
        role={modal ? 'dialog' : undefined}
        aria-modal={modal || undefined}
        tabIndex={modal ? -1 : undefined}
        aria-labelledby={titleId}
        inert={!open}
        data-slot="inspector-panel"
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'relative h-full min-h-0 flex-none overflow-hidden bg-card text-card-foreground transition-[width] duration-normal ease-out motion-reduce:transition-none',
          open && 'border-l border-border',
          restoring && 'transition-none',
          'max-[760px]:fixed max-[760px]:inset-0 max-[760px]:z-[var(--z-overlay,50)] max-[760px]:!w-full max-[760px]:border-l-0',
          !open && 'max-[760px]:hidden',
          className
        )}
        style={{ ...style, width: open ? shownWidth : 0 }}
        {...props}
        onFocus={(e) => {
          origin.onFocus(e);
          props.onFocus?.(e);
        }}
      >
        {!narrow && (
          <ResizableHandle
            direction="horizontal"
            aria-label="Resize panel"
            aria-valuenow={width}
            aria-valuemin={minWidth}
            aria-valuemax={maxWidth}
            className="absolute inset-y-0 left-0 z-10 touch-none max-[760px]:hidden"
            onKeyDown={onKey}
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.focus();
              grab.current = e.clientX + width;
              e.currentTarget.setPointerCapture?.(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (grab.current !== null) setWidth(grab.current - e.clientX);
            }}
            onPointerUp={() => {
              grab.current = null;
            }}
          />
        )}
        <OverlayLayerProvider layer={layer}>
          <div className="flex h-full flex-col max-[760px]:!w-full" style={{ width: shownWidth }}>
            <div
              className="flex h-12 flex-none items-center gap-1.5 border-b border-border pl-4 pr-2.5"
              data-slot="inspector-panel-header"
            >
              <h2 id={titleId} className="m-0 min-w-0 flex-1 truncate text-sm font-semibold">
                {title}
              </h2>
              {actions}
              <DialogClose
                label={closeLabel}
                title={closeLabel}
                onClick={() => onOpenChange(false)}
                data-slot="inspector-panel-close"
              />
            </div>
            <div
              className="min-h-0 flex-1 overflow-auto px-[18px] py-4 text-ui"
              data-slot="inspector-panel-body"
            >
              {children}
            </div>
          </div>
        </OverlayLayerProvider>
      </aside>
    );
  }
);
InspectorPanel.displayName = 'InspectorPanel';
