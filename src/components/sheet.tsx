'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { OverlayLayerProvider } from '../lib/overlay-layer';
import {
  DialogBackdrop,
  DialogClose,
  DialogPortal,
  DialogTitleBar,
  useDialogShell,
} from './dialog-shell';
import { DockedSheet } from './sheet.docked';

export interface SheetProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  /** Overlay only: the line under the title. */
  description?: React.ReactNode;
  /** Extra header buttons, before Close. */
  actions?: React.ReactNode;
  /** Overlay only: the edge it docks to. Default `right`. */
  side?: 'left' | 'right';
  /**
   * `overlay` (default) is a modal panel over a backdrop. `docked` is an in-page right panel,
   * resizable between 360 and 420 px, and a full-screen dialog below 760 px.
   */
  mode?: 'overlay' | 'docked';
  /** Docked only: the start width in px. Default 380. */
  defaultWidth?: number;
  /**
   * Docked only: persist the width in localStorage under this key. Under SSR, also list the key
   * in `ResizableSplitPrepaint` so the server HTML already has the stored width.
   */
  storageKey?: string;
}

/** A side panel: a modal overlay, or with `mode="docked"` an in-page inspector panel. */
export const Sheet = React.forwardRef<HTMLElement, SheetProps>(({ mode, ...props }, ref) =>
  mode === 'docked' ? <DockedSheet ref={ref} {...props} /> : <OverlaySheet ref={ref} {...props} />
);
Sheet.displayName = 'Sheet';

const SIDES = { left: 'left-0 border-r', right: 'right-0 border-l' } as const;

const OverlaySheet = React.forwardRef<HTMLElement, SheetProps>(
  (
    {
      open,
      onOpenChange,
      side = 'right',
      title,
      description,
      actions,
      defaultWidth: _defaultWidth,
      storageKey: _storageKey,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const sheetRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => sheetRef.current as HTMLElement);
    const instanceId = React.useId();
    const titleId = `${instanceId}-title`;
    const descId = `${instanceId}-desc`;
    const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);
    const { mounted, layer } = useDialogShell(sheetRef, open, close);

    if (!open || !mounted) return null;

    return (
      <DialogPortal>
        <OverlayLayerProvider layer={layer}>
          <div className="fixed inset-0 z-[var(--z-overlay,50)]" data-slot="sheet">
            <DialogBackdrop layer={layer} onClick={close} />
            <div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title != null ? titleId : undefined}
              aria-describedby={description != null ? descId : undefined}
              tabIndex={-1}
              className={cn(
                'fixed inset-y-0 z-[var(--z-overlay,50)] flex w-80 flex-col border-border bg-background shadow-[var(--shadow-popover)] outline-none',
                SIDES[side],
                className
              )}
              data-slot="sheet-content"
              {...props}
            >
              {title != null || actions != null ? (
                <DialogTitleBar
                  titleId={titleId}
                  title={title}
                  descriptionId={descId}
                  description={description}
                  extra={actions != null && <div data-slot="sheet-actions">{actions}</div>}
                  close={<DialogClose onClick={close} />}
                />
              ) : (
                <div className="flex justify-end px-3 pt-3">
                  <DialogClose onClick={close} />
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-4">{children}</div>
            </div>
          </div>
        </OverlayLayerProvider>
      </DialogPortal>
    );
  }
);
OverlaySheet.displayName = 'OverlaySheet';
