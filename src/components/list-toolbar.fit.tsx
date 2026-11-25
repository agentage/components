'use client';

import * as React from 'react';
import { refreshRovingStop } from '../lib/use-roving-focus';
import { cn } from '../lib/utils';
import { DropdownMenu, DropdownMenuCheckboxItem } from './dropdown-menu';
import { ListToolbarIcons } from './list-toolbar.icons';
import { toolbarIconButtonVariants } from './list-toolbar.variants';

/** Fit steps in order: labels drop to icons, the search folds to a button, toggles go to More. */
const STEPS = ['labels', 'search', 'menu'] as const;

export interface ToolbarFitItem {
  id: string;
  label: React.ReactNode;
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
}

interface FitContextValue {
  register: (item: ToolbarFitItem) => void;
  unregister: (id: string) => void;
}

export const ToolbarFitContext = React.createContext<FitContextValue | null>(null);

const applyInert = (el: HTMLElement): void => {
  for (const node of el.querySelectorAll<HTMLElement>('[data-fit-show],[data-fit-hide]')) {
    const show = node.dataset.fitShow;
    const step = show ?? node.dataset.fitHide ?? '';
    const reached = el.hasAttribute(`data-fit-${step}`);
    node.toggleAttribute('inert', show === undefined ? reached : !reached);
  }
};

/** One synchronous pass: reset, then add steps until the row fits; nothing paints in between. */
export const fitToolbar = (el: HTMLElement, selector: string): void => {
  for (const s of STEPS) el.removeAttribute(`data-fit-${s}`);
  for (const s of STEPS) {
    if (el.scrollWidth <= el.clientWidth) break;
    el.setAttribute(`data-fit-${s}`, '');
  }
  applyInert(el);
  refreshRovingStop(el, selector);
};

/** Refits on every render, on a size change of the row or its children, and on new children. */
export const useToolbarFit = (ref: React.RefObject<HTMLElement | null>, selector: string) => {
  React.useLayoutEffect(() => {
    if (ref.current) fitToolbar(ref.current, selector);
  });
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => fitToolbar(el, selector));
    const observe = () => {
      ro.disconnect();
      for (const node of [el, ...el.children]) ro.observe(node);
    };
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(el, { childList: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [ref, selector]);
};

/** Holds the registered toggles for the More menu; the value is stable across renders. */
export const useFitItems = () => {
  const [items, setItems] = React.useState<ToolbarFitItem[]>([]);
  const value = React.useMemo<FitContextValue>(
    () => ({
      register: (item) =>
        setItems((list) =>
          list.some((x) => x.id === item.id)
            ? list.map((x) => (x.id === item.id ? item : x))
            : [...list, item]
        ),
      unregister: (id) => setItems((list) => list.filter((x) => x.id !== id)),
    }),
    []
  );
  return [items, value] as const;
};

/** The overflow menu: shown only at the `menu` step, with every toolbar toggle as a checkbox. */
export const ToolbarMore = ({ items }: { items: ToolbarFitItem[] }) =>
  items.length === 0 ? null : (
    <div className="hidden group-data-[fit-menu]/list-toolbar:contents" data-fit-show="menu">
      <DropdownMenu
        aria-label="More controls"
        trigger={
          <button
            type="button"
            aria-label="More controls"
            title="More controls"
            className={cn(toolbarIconButtonVariants(), 'flex-none')}
            data-slot="list-toolbar-more"
          >
            {ListToolbarIcons.more}
          </button>
        }
      >
        {items.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.id}
            checked={item.pressed}
            onCheckedChange={item.onPressedChange}
          >
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenu>
    </div>
  );
