'use client';

import { useCallback, useId, useRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import {
  DialogBackdrop,
  DialogClose,
  DialogPortal,
  DialogTitleBar,
  useDialogShell,
} from './dialog-shell';
import { OverlayLayerProvider } from '../lib/overlay-layer';

export const modalVariants = cva(
  'relative z-10 w-full rounded-lg border border-border bg-background shadow-[var(--shadow-popover)] outline-none',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ModalProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onClose' | 'title'>,
    VariantProps<typeof modalVariants> {
  /** @deprecated Use `open`. */
  isOpen?: boolean;
  /** @deprecated Use `onOpenChange`. */
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal = ({
  isOpen: isOpenProp,
  onClose: onCloseProp,
  open: openProp,
  onOpenChange,
  title,
  description,
  children,
  size,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  ...props
}: ModalProps): React.JSX.Element | null => {
  const isOpen = openProp ?? isOpenProp ?? false;
  const onClose = useCallback((): void => {
    onCloseProp?.();
    onOpenChange?.(false);
  }, [onCloseProp, onOpenChange]);
  const modalRef = useRef<HTMLDivElement>(null);
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const descId = `${instanceId}-desc`;
  const { mounted, layer } = useDialogShell(modalRef, isOpen, closeOnEscape ? onClose : undefined);

  if (!isOpen || !mounted) return null;

  return (
    <DialogPortal>
      <OverlayLayerProvider layer={layer}>
        <div
          className="fixed inset-0 z-[var(--z-overlay,50)] flex items-center justify-center p-4"
          data-slot="modal"
        >
          <DialogBackdrop layer={layer} onClick={closeOnOverlayClick ? onClose : undefined} />
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            className={cn(modalVariants({ size }), className)}
            data-slot="modal-content"
            {...props}
          >
            {(title != null || showCloseButton) && (
              <DialogTitleBar
                titleId={titleId}
                title={title}
                descriptionId={descId}
                description={description}
                close={showCloseButton && <DialogClose label="Close modal" onClick={onClose} />}
              />
            )}
            <div className="p-4">{children}</div>
          </div>
        </div>
      </OverlayLayerProvider>
    </DialogPortal>
  );
};

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ModalFooter = ({
  children,
  className,
  ...props
}: ModalFooterProps): React.JSX.Element => (
  <div
    data-slot="modal-footer"
    className={cn(
      'flex items-center justify-end gap-2 border-t border-border -mx-4 -mb-4 mt-4 px-4 py-3 bg-muted/30 rounded-b-lg',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
