'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Button } from './button';
import { DialogBackdrop, DialogPortal, useDialogShell } from './dialog-shell';
import { OverlayLayerProvider } from '../lib/overlay-layer';

/** @deprecated AlertDialog renders `Button` now; kept for markup that styled its own confirm. */
export const alertDialogConfirmVariants = cva(
  [
    'inline-flex h-7 items-center justify-center rounded-lg px-2.5 text-ui font-medium transition-colors',
    'focus-ring',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive-solid text-on-solid hover:bg-destructive-solid/90',
      },
      disabled: { true: 'pointer-events-none opacity-50', false: '' },
    },
    defaultVariants: {
      variant: 'default',
      disabled: false,
    },
  }
);

export interface AlertDialogProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    Omit<VariantProps<typeof alertDialogConfirmVariants>, 'disabled'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  /** A returned promise keeps the dialog open with a pending confirm; it closes on resolve only. */
  onConfirm: () => void | Promise<unknown>;
  /** Confirm in flight from the caller's own state. Default false. */
  pending?: boolean;
  /** Blocks the confirm action, e.g. until a confirmation phrase matches. */
  confirmDisabled?: boolean;
  children?: ReactNode;
}

export const AlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  onConfirm,
  confirmDisabled = false,
  pending = false,
  variant,
  children,
  className,
  ...props
}: AlertDialogProps): React.JSX.Element | null => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const descId = `${instanceId}-desc`;
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const [busy, setBusy] = useState(false);
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
          data-slot="alert-dialog"
        >
          <DialogBackdrop layer={layer} onClick={close} />
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            className={cn(
              'relative z-10 w-full max-w-md rounded-lg border border-border bg-background p-4 shadow-[var(--shadow-popover)]',
              className
            )}
            data-slot="alert-dialog-content"
            {...props}
          >
            <h2 id={titleId} className="m-0 text-sm font-semibold text-foreground">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1.5 text-ui text-muted-foreground">
                {description}
              </p>
            )}
            {children && <div className="mt-4">{children}</div>}
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" data-cancel onClick={close}>
                {cancelLabel}
              </Button>
              <Button
                type="button"
                variant={variant === 'destructive' ? 'destructive' : 'default'}
                disabled={confirmDisabled}
                pending={pending || busy}
                data-slot="alert-dialog-confirm"
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
