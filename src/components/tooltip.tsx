'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { withDescribedBy } from '../lib/aria';
import { useOverlayLayer } from '../lib/overlay-layer';
import { useAnchorPosition, type AnchorSide } from '../lib/use-anchor-position';
import { useMounted } from '../lib/use-mounted';
import { cn } from '../lib/utils';

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  content: ReactNode;
  children: React.ReactElement;
  side?: AnchorSide;
  delayMs?: number;
}

export const Tooltip = ({
  content,
  children,
  side = 'top',
  delayMs = 300,
  className,
  ...props
}: TooltipProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mounted = useMounted();
  const tooltipId = `${useId()}-tooltip`;
  const showing = open && mounted;

  const { top, left } = useAnchorPosition(anchorRef, surfaceRef, showing, {
    side,
    align: 'center',
  });

  const show = useCallback((delay: number) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), delay);
  }, []);

  const hide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  }, []);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  useOverlayLayer(showing, { refs: [anchorRef, surfaceRef], onEscape: () => hide() });

  return (
    <span
      ref={anchorRef}
      className="relative inline-flex"
      // Touch never opens a tooltip: the tap already activates the trigger underneath.
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') show(delayMs);
      }}
      onPointerLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
      data-slot="tooltip"
    >
      {withDescribedBy(children, showing ? tooltipId : undefined)}
      {showing &&
        createPortal(
          <div
            ref={surfaceRef}
            id={tooltipId}
            role="tooltip"
            style={{ position: 'fixed', top, left }}
            className={cn(
              'z-[var(--z-overlay,50)] max-w-xs rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-[var(--shadow-popover)]',
              'motion-safe:animate-menu-in',
              className
            )}
            data-slot="tooltip-content"
            {...props}
          >
            {content}
          </div>,
          document.body
        )}
    </span>
  );
};
