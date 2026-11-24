'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { OverlayLayerProvider, useOverlayLayer } from '../lib/overlay-layer';
import { useAnchorPosition } from '../lib/use-anchor-position';
import { useFocusRestore } from '../lib/use-focus-restore';
import { useMounted } from '../lib/use-mounted';
import { cn } from '../lib/utils';
import {
  focusMenuItem,
  handleMenuKeyDown,
  MenuCloseContext,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  type MenuItemProps,
  type MenuLabelProps,
  type MenuSeparatorProps,
  type MenuSize,
} from './menu.parts';
import { menuContentVariants } from './menu.variants';

export { menuContentVariants as contextMenuContentVariants } from './menu.variants';
export { menuItemVariants as contextMenuItemVariants } from './menu.variants';

interface Point {
  top: number;
  left: number;
}

export interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The right-clickable target. */
  trigger: ReactNode;
  /** Menu items - `ContextMenuItem`, `ContextMenuSeparator`, `ContextMenuLabel`. */
  children: ReactNode;
  disabled?: boolean;
  /** Controlled open state; `false` closes the menu, `true` keeps an open menu open. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Class for the element wrapping the target (the surface takes `className`). */
  triggerClassName?: string;
  /** `sm` (default): 28 px items, 13 px text, like DropdownMenu. `md` is deprecated. */
  size?: MenuSize;
}

export const ContextMenu = ({
  trigger,
  children,
  disabled = false,
  open: openProp,
  onOpenChange,
  className,
  triggerClassName,
  size = 'sm',
  ...props
}: ContextMenuProps): React.JSX.Element => {
  const [point, setPoint] = useState<Point | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const menuId = `${useId()}-context-menu`;
  // Opening needs a pointer position, so `open` can only close or hold a menu the user opened.
  const showing = point !== null && mounted && openProp !== false;
  const changeRef = useRef(onOpenChange);
  useLayoutEffect(() => {
    changeRef.current = onOpenChange;
  });

  // A zero-size fixed anchor at the cursor lets the shared positioner do the viewport clamping.
  const { top, left } = useAnchorPosition(anchorRef, menuRef, showing, {
    side: 'bottom',
    align: 'start',
    offset: 0,
  });

  useFocusRestore(showing, menuRef);

  const close = useCallback(() => {
    setPoint(null);
    changeRef.current?.(false);
  }, []);
  const layer = useOverlayLayer(showing, { refs: [menuRef], onEscape: close, onOutside: close });

  if (openProp === false && point !== null) setPoint(null);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node || disabled) return;

    const openAt = (next: Point): void => {
      setPoint(next);
      changeRef.current?.(true);
    };
    const handleContextMenu = (e: MouseEvent): void => {
      e.preventDefault();
      openAt({ top: e.clientY, left: e.clientX });
    };
    // Shift+F10 and the ContextMenu key anchor the surface to the focused target instead.
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key !== 'ContextMenu' && !(e.shiftKey && e.key === 'F10')) return;
      e.preventDefault();
      const target = e.target as HTMLElement | null;
      const rect = (target && node.contains(target) ? target : node).getBoundingClientRect();
      openAt({ top: rect.bottom, left: rect.left });
    };

    node.addEventListener('contextmenu', handleContextMenu);
    node.addEventListener('keydown', handleKeyDown);
    return () => {
      node.removeEventListener('contextmenu', handleContextMenu);
      node.removeEventListener('keydown', handleKeyDown);
    };
  }, [disabled]);

  useEffect(() => {
    if (showing) focusMenuItem(menuRef.current, 0);
  }, [showing]);

  return (
    <MenuCloseContext.Provider value={{ close, size }}>
      <div
        ref={wrapperRef}
        className={triggerClassName}
        data-slot="context-menu"
        data-state={showing ? 'open' : 'closed'}
      >
        {trigger}
      </div>
      {showing &&
        createPortal(
          <OverlayLayerProvider layer={layer}>
            <div
              ref={anchorRef}
              aria-hidden="true"
              data-slot="context-menu-anchor"
              style={{ position: 'fixed', top: point.top, left: point.left, width: 0, height: 0 }}
            />
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              tabIndex={-1}
              onKeyDown={(e) => handleMenuKeyDown(e, close, layer)}
              style={{ position: 'fixed', top, left }}
              className={cn(menuContentVariants({ size }), className)}
              data-slot="context-menu-content"
              {...props}
            >
              {children}
            </div>
          </OverlayLayerProvider>,
          document.body
        )}
    </MenuCloseContext.Provider>
  );
};

export type ContextMenuItemProps = MenuItemProps;

export const ContextMenuItem = (props: ContextMenuItemProps): React.JSX.Element => (
  <MenuItem data-slot="context-menu-item" {...props} />
);

export type ContextMenuSeparatorProps = MenuSeparatorProps;

export const ContextMenuSeparator = (props: ContextMenuSeparatorProps): React.JSX.Element => (
  <MenuSeparator data-slot="context-menu-separator" {...props} />
);

export type ContextMenuLabelProps = MenuLabelProps;

export const ContextMenuLabel = (props: ContextMenuLabelProps): React.JSX.Element => (
  <MenuLabel data-slot="context-menu-label" {...props} />
);
