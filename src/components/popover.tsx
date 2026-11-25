'use client';

import { Slot } from '@radix-ui/react-slot';
import { isValidElement, useCallback, useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { OverlayLayerProvider, useOverlayLayer } from '../lib/overlay-layer';
import { useAnchorPosition } from '../lib/use-anchor-position';
import { FOCUSABLE_SELECTOR } from '../lib/use-focus-trap';
import { useMounted } from '../lib/use-mounted';
import { cn } from '../lib/utils';

export interface PopoverProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  trigger: ReactNode;
  content: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'center' | 'end';
  /** Preferred side; flips when there is no room. Default `top`. */
  side?: 'top' | 'bottom';
  /** Accessible name of the surface; `aria-label` or `aria-labelledby` also work. */
  label?: string;
}

const focusables = (root: HTMLElement | null): HTMLElement[] =>
  Array.from(root?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);

/**
 * Non-modal surface anchored to `trigger`. Focus moves in on open and back to the trigger on
 * close; Tab past either end leaves the surface next to the trigger and closes it.
 */
export const Popover = ({
  trigger,
  content,
  open: isOpen = false,
  onOpenChange,
  align = 'start',
  side = 'top',
  label,
  className,
  onKeyDown,
  ...props
}: PopoverProps): React.JSX.Element => {
  const onClose = useCallback((): void => onOpenChange?.(false), [onOpenChange]);
  const anchorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const contentId = `${useId()}-popover`;
  const showing = isOpen && mounted;
  const layer = useOverlayLayer(showing, {
    refs: [anchorRef, contentRef],
    onEscape: onClose,
    onOutside: onClose,
  });

  const { top, left } = useAnchorPosition(anchorRef, contentRef, showing, {
    side,
    align,
  });

  const triggerNode = (): HTMLElement | null =>
    anchorRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? null;

  useEffect(() => {
    if (!showing) return;
    const surface = contentRef.current;
    (focusables(surface)[0] ?? surface)?.focus();
    return () => {
      const active = document.activeElement;
      const lost = !active || active === document.body || (surface?.contains(active) ?? false);
      if (lost) triggerNode()?.focus();
    };
  }, [showing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.key !== 'Tab') return;
    const items = focusables(contentRef.current);
    const atEnd = e.shiftKey
      ? items.length === 0 ||
        document.activeElement === items[0] ||
        document.activeElement === contentRef.current
      : items.length === 0 || document.activeElement === items[items.length - 1];
    if (!atEnd) return;
    triggerNode()?.focus();
    // Shift+Tab lands on the trigger itself; Tab keeps its default and moves on from the trigger.
    if (e.shiftKey) e.preventDefault();
    onClose();
  };

  const named = label ?? props['aria-label'];
  const asSlot = isValidElement(trigger);

  return (
    <div ref={anchorRef} className="relative" data-slot="popover">
      {asSlot ? (
        <Slot aria-expanded={isOpen} aria-controls={showing ? contentId : undefined}>
          {trigger}
        </Slot>
      ) : (
        trigger
      )}

      {showing &&
        createPortal(
          <OverlayLayerProvider layer={layer}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Tab handling for the non-modal surface */}
            <div
              ref={contentRef}
              id={contentId}
              role="dialog"
              tabIndex={-1}
              style={{ position: 'fixed', top, left }}
              className={cn(
                'z-[var(--z-overlay,50)] min-w-60 rounded-lg border border-border bg-popover p-3 text-ui shadow-[var(--shadow-popover)] outline-none',
                className
              )}
              data-slot="popover-content"
              {...props}
              aria-label={named ?? (props['aria-labelledby'] ? undefined : 'Popover')}
              onKeyDown={handleKeyDown}
            >
              {content}
            </div>
          </OverlayLayerProvider>,
          document.body
        )}
    </div>
  );
};
