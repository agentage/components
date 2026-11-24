'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { isTopLayer, useOverlayLayer, type OverlayLayer } from '../lib/overlay-layer';
import { useFocusTrap } from '../lib/use-focus-trap';
import { useMounted } from '../lib/use-mounted';
import { useScrollLock } from '../lib/use-scroll-lock';
import { cn } from '../lib/utils';

/**
 * Scroll lock, focus trap with restore and Escape for any modal surface. Escape goes through the
 * shared layer stack, so it closes only the top layer; wrap the surface in `OverlayLayerProvider`.
 */
export const useDialogShell = (
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
  onDismiss?: () => void
): { mounted: boolean; layer: OverlayLayer } => {
  const mounted = useMounted();
  useScrollLock(open);
  useFocusTrap(ref, open && mounted);
  const layer = useOverlayLayer(open && mounted, {
    refs: [ref],
    onEscape: onDismiss,
    modal: true,
  });
  return { mounted, layer };
};

/** Renders into document.body. */
export const DialogPortal = ({ children }: { children: React.ReactNode }) =>
  createPortal(children, document.body);

/** With `layer`, a press that first dismissed a child layer does not also close the dialog. */
export const DialogBackdrop = ({
  onClick,
  layer,
}: {
  onClick?: () => void;
  layer?: OverlayLayer;
}) => {
  const armed = React.useRef<boolean | null>(null);
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 bg-overlay backdrop-blur-sm"
      onMouseDown={() => {
        armed.current = !layer || isTopLayer(layer);
      }}
      onClick={() => {
        if (armed.current !== false) onClick?.();
        armed.current = null;
      }}
      data-slot="dialog-backdrop"
    />
  );
};

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4 fill-none stroke-current stroke-2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

/** 28 px ghost close button with a 16 px cross. */
export const DialogClose = ({ label = 'Close', className, ...props }: DialogCloseProps) => (
  <button
    type="button"
    aria-label={label}
    className={cn(
      'grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors duration-fast hover:bg-accent hover:text-foreground focus-ring',
      className
    )}
    data-slot="dialog-close"
    {...props}
  >
    <XIcon />
  </button>
);

export interface DialogTitleBarProps {
  titleId: string;
  title?: React.ReactNode;
  descriptionId: string;
  description?: React.ReactNode;
  /** Extra content between the title block and the close button. */
  extra?: React.ReactNode;
  close?: React.ReactNode;
}

/** Title, description, extra slot and close button over a 1 px rule. */
export const DialogTitleBar = ({
  titleId,
  title,
  descriptionId,
  description,
  extra,
  close,
}: DialogTitleBarProps) => (
  <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
    <div className="min-w-0 flex-1">
      {title != null && (
        <h2 id={titleId} className="m-0 text-sm font-semibold text-foreground">
          {title}
        </h2>
      )}
      {description != null && (
        <p id={descriptionId} className="mt-0.5 text-ui text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {extra != null && <div className="flex min-w-0 items-center gap-2">{extra}</div>}
    {close}
  </div>
);
