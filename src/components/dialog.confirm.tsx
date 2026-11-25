'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { OverlayLayerProvider } from '../lib/overlay-layer';
import { Button } from './button';
import { DialogBackdrop, DialogPortal, useDialogShell } from './dialog-shell';
import { DialogPhrase } from './dialog.phrase';
import type { DialogProps } from './dialog';

type ConfirmDialogProps = DialogProps & { onConfirm: NonNullable<DialogProps['onConfirm']> };

/** Role alertdialog with Cancel and Confirm; focus lands on Cancel. */
export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = 'Confirm',
  tone = 'default',
  confirmText,
  pending = false,
  children,
  className,
  ...props
}: ConfirmDialogProps): React.JSX.Element | null => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const descId = `${instanceId}-desc`;
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const [busy, setBusy] = useState(false);
  const [typed, setTyped] = useState('');
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setTyped('');
  }
  const confirm = async (): Promise<void> => {
    const result = onConfirm();
    if (!result || typeof (result as Promise<unknown>).then !== 'function') {
      onOpenChange(false);
      return;
    }
    setBusy(true);
    try {
      await result;
      onOpenChange(false);
    } catch {
      // A rejected confirm keeps the dialog open; the caller shows its own error.
    } finally {
      setBusy(false);
    }
  };
  const { mounted, layer } = useDialogShell(dialogRef, open, close);

  // Fires after the trap's initial focus so the safe action stays the landing point.
  useEffect(() => {
    if (open && mounted)
      dialogRef.current?.querySelector<HTMLButtonElement>('[data-cancel]')?.focus();
  }, [open, mounted]);

  if (!open || !mounted) return null;

  return (
    <DialogPortal>
      <OverlayLayerProvider layer={layer}>
        <div
          className="fixed inset-0 z-[var(--z-overlay,50)] flex items-center justify-center p-4"
          data-slot="dialog"
        >
          <DialogBackdrop layer={layer} onClick={close} />
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={title != null ? titleId : undefined}
            aria-describedby={description != null ? descId : undefined}
            className={cn(
              'relative z-10 w-full max-w-md rounded-lg border border-border bg-background p-4 shadow-[var(--shadow-popover)]',
              className
            )}
            data-slot="dialog-content"
            {...props}
          >
            <h2 id={titleId} className="m-0 text-sm font-semibold text-foreground">
              {title}
            </h2>
            {description != null && (
              <p id={descId} className="mt-1.5 text-ui text-muted-foreground">
                {description}
              </p>
            )}
            {children != null && <div className="mt-4">{children}</div>}
            {confirmText != null && (
              <div className="mt-4">
                <DialogPhrase
                  phrase={confirmText}
                  value={typed}
                  onChange={setTyped}
                  confirmLabel={confirmLabel}
                />
              </div>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" data-cancel onClick={close}>
                Cancel
              </Button>
              <Button
                type="button"
                variant={tone === 'destructive' ? 'destructive' : 'default'}
                disabled={confirmText != null && typed !== confirmText}
                pending={pending || busy}
                data-slot="dialog-confirm"
                onClick={() => void confirm()}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </OverlayLayerProvider>
    </DialogPortal>
  );
};
