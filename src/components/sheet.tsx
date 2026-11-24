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

export const sheetVariants = cva(
  'fixed inset-y-0 z-[var(--z-overlay,50)] flex w-80 flex-col border-border bg-background shadow-[var(--shadow-popover)] outline-none',
  {
    variants: {
      side: {
        left: 'left-0 border-r',
        right: 'right-0 border-l',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

export interface SheetProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof sheetVariants> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  /** Extra content for the title bar, rendered between the title block and the close button. */
  header?: ReactNode;
  children: ReactNode;
}

export const Sheet = ({
  open,
  onOpenChange,
  side,
  title,
  description,
  header,
  children,
  className,
  ...props
}: SheetProps): React.JSX.Element | null => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const descId = `${instanceId}-desc`;
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
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
            className={cn(sheetVariants({ side }), className)}
            data-slot="sheet-content"
            {...props}
          >
            {title != null || header != null ? (
              <DialogTitleBar
                titleId={titleId}
                title={title}
                descriptionId={descId}
                description={description}
                extra={header != null && <div data-slot="sheet-header">{header}</div>}
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
};
