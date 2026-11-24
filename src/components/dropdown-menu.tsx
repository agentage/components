'use client';

import { Slot } from '@radix-ui/react-slot';
import { isValidElement, useCallback, useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { isTopLayer, OverlayLayerProvider, useOverlayLayer } from '../lib/overlay-layer';
import { useAnchorPosition } from '../lib/use-anchor-position';
import { useControlled } from '../lib/use-controlled';
import { useMounted } from '../lib/use-mounted';
import { cn } from '../lib/utils';
import { dropdownMenuContentVariants } from './dropdown-menu.variants';
import { focusMenuItem, handleMenuKeyDown, MenuCloseContext } from './menu.parts';

export { dropdownMenuContentVariants, dropdownMenuItemVariants } from './dropdown-menu.variants';

/** Components are assumed to render their own control; intrinsic tags must be a button or link. */
const isInteractive = (element: React.ReactElement): boolean =>
  typeof element.type !== 'string' || element.type === 'button' || element.type === 'a';

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'bottom' | 'top';
  /** Plain items close the menu on click; checkbox and radio items never do by default. */
  closeOnSelect?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DropdownMenu = ({
  trigger,
  children,
  align = 'end',
  side = 'bottom',
  closeOnSelect = true,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  ...props
}: DropdownMenuProps): React.JSX.Element => {
  const [open, setOpen] = useControlled(openProp, defaultOpen, onOpenChange);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const mounted = useMounted();
  const menuId = `${useId()}-menu`;
  const showing = open && mounted;

  const { top, left } = useAnchorPosition(wrapperRef, menuRef, showing, {
    side,
    align,
    offset: 6,
    margin: 4,
  });

  const closeMenu = useCallback(
    (restoreFocus = true) => {
      setOpen(false);
      if (!restoreFocus) return;
      (
        openerRef.current ??
        wrapperRef.current?.querySelector<HTMLElement>('[data-slot="dropdown-menu-trigger"]')
      )?.focus();
    },
    [setOpen]
  );
  const layer = useOverlayLayer(showing, {
    refs: [wrapperRef, menuRef],
    onEscape: closeMenu,
    onOutside: () => closeMenu(false),
  });

  const openMenu = (): void => {
    // Focus returns to the trigger, even when a click did not focus it (Safari, tests).
    openerRef.current =
      wrapperRef.current?.querySelector<HTMLElement>('[data-slot="dropdown-menu-trigger"]') ??
      (document.activeElement as HTMLElement | null);
    setOpen(true);
  };

  useEffect(() => {
    if (!showing) return;
    // The prototype focuses the checked item, else the first one, however the menu opened.
    const checked = menuRef.current?.querySelector<HTMLElement>('[aria-checked="true"]');
    if (checked) checked.focus();
    else focusMenuItem(menuRef.current, 0);
  }, [showing]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'ArrowDown' || (!open && (e.key === 'Enter' || e.key === ' '))) {
      e.preventDefault();
      if (open) focusMenuItem(menuRef.current, 0);
      else openMenu();
    } else if (e.key === 'Escape' && open && isTopLayer(layer)) {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    }
  };

  // Slot merges the semantics into an already-interactive trigger; anything else gets a real button.
  const asSlot = isValidElement(trigger) && isInteractive(trigger);
  const TriggerComp = asSlot ? Slot : 'button';

  return (
    <MenuCloseContext.Provider value={{ close: closeMenu, closeOnSelect }}>
      <div ref={wrapperRef} className="relative inline-flex" data-slot="dropdown-menu">
        <TriggerComp
          {...(asSlot ? {} : { type: 'button' as const })}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          data-slot="dropdown-menu-trigger"
          onClick={() => {
            if (open) closeMenu(false);
            else openMenu();
          }}
          onKeyDown={handleTriggerKeyDown}
        >
          {trigger}
        </TriggerComp>
        {showing &&
          createPortal(
            <OverlayLayerProvider layer={layer}>
              <div
                ref={menuRef}
                id={menuId}
                role="menu"
                tabIndex={-1}
                onKeyDown={(e) => handleMenuKeyDown(e, closeMenu, layer)}
                style={{ position: 'fixed', top, left }}
                className={cn(dropdownMenuContentVariants(), className)}
                data-slot="dropdown-menu-content"
                {...props}
              >
                {children}
              </div>
            </OverlayLayerProvider>,
            document.body
          )}
      </div>
    </MenuCloseContext.Provider>
  );
};

export {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from './dropdown-menu.items';
export type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
} from './dropdown-menu.items';
