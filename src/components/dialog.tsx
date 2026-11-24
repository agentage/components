'use client';

import { useCallback, useId, useRef, type ReactNode } from 'react';
import { cn } from '../lib/utils';
import { OverlayLayerProvider } from '../lib/overlay-layer';
import {
  DialogBackdrop,
  DialogClose,
  DialogPortal,
  DialogTitleBar,
  useDialogShell,
} from './dialog-shell';
import { ConfirmDialog } from './dialog.confirm';

export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  /**
   * Makes it a confirm dialog with Cancel and Confirm. A returned promise keeps it open with a
   * pending confirm; it closes on resolve only.
   */
  onConfirm?: () => void | Promise<unknown>;
  /** Confirm button text. Default `Confirm`. */
  confirmLabel?: string;
  /** Colour of the confirm button. */
  tone?: 'default' | 'destructive';
  /** A phrase the user must retype before Confirm is enabled, usually the resource name. */
  confirmText?: string;
  /** Confirm in flight from the caller's own state. */
  pending?: boolean;
  children?: ReactNode;
}

/** A centred modal dialog; with `onConfirm` it is a confirm dialog with a safe default. */
export const Dialog = (props: DialogProps): React.JSX.Element | null =>
  props.onConfirm ? (
    <ConfirmDialog {...props} onConfirm={props.onConfirm} />
  ) : (
    <PlainDialog {...props} />
  );

const PlainDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm: _onConfirm,
  confirmLabel: _confirmLabel,
  tone: _tone,
  confirmText: _confirmText,
  pending: _pending,
  children,
  className,
  ...props
}: DialogProps): React.JSX.Element | null => {
  const onClose = useCallback((): void => onOpenChange(false), [onOpenChange]);
  const panelRef = useRef<HTMLDivElement>(null);
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const descId = `${instanceId}-desc`;
  const { mounted, layer } = useDialogShell(panelRef, open, onClose);

  if (!open || !mounted) return null;

  return (
    <DialogPortal>
      <OverlayLayerProvider layer={layer}>
        <div
          className="fixed inset-0 z-[var(--z-overlay,50)] flex items-center justify-center p-4"
          data-slot="dialog"
        >
          <DialogBackdrop layer={layer} onClick={onClose} />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title != null ? titleId : undefined}
            aria-describedby={description != null ? descId : undefined}
            tabIndex={-1}
            className={cn(
              'relative z-10 w-full rounded-lg border border-border bg-background shadow-[var(--shadow-popover)] outline-none max-w-md',
              className
            )}
            data-slot="dialog-content"
            {...props}
          >
            <DialogTitleBar
              titleId={titleId}
              title={title}
              descriptionId={descId}
              description={description}
              close={<DialogClose label="Close dialog" onClick={onClose} />}
            />
            <div className="p-4">{children}</div>
          </div>
        </div>
      </OverlayLayerProvider>
    </DialogPortal>
  );
};

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** Action row at the bottom of a plain dialog body, bleeding to the panel edges. */
export const DialogFooter = ({ className, ...props }: DialogFooterProps): React.JSX.Element => (
  <div
    data-slot="dialog-footer"
    className={cn(
      'flex items-center justify-end gap-2 border-t border-border -mx-4 -mb-4 mt-4 px-4 py-3 bg-muted/30 rounded-b-lg',
      className
    )}
    {...props}
  />
);
