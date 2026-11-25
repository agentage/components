'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Kbd } from './kbd';

export interface ActionBarAction {
  id: string;
  label: string;
  onSelect?: () => void;
  /** Key hint drawn in the button, for example "A"; also set as `aria-keyshortcuts`. */
  kbd?: string;
  icon?: React.ReactNode;
  /** `primary` filled, `default` bordered, `destructive` bordered red text, `ghost` quiet. */
  variant?: 'primary' | 'default' | 'destructive' | 'ghost';
  disabled?: boolean;
}

const VARIANT = {
  primary: { variant: 'default', className: '' },
  default: { variant: 'outline', className: '' },
  destructive: { variant: 'outline', className: 'text-destructive hover:text-destructive' },
  ghost: { variant: 'ghost', className: 'text-muted-foreground hover:text-foreground' },
} as const;

/** Key hint inside a button: the one Kbd size; only colour and border follow the button. */
export const ActionKbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <Kbd
      ref={ref}
      aria-hidden="true"
      className={cn('border-current/35 bg-transparent text-current opacity-80', className)}
      {...props}
    />
  )
);
ActionKbd.displayName = 'ActionKbd';

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  { action: ActionBarAction; hotkeys?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ action, hotkeys = false, className, ...props }, ref) => {
  const kbd = hotkeys ? action.kbd : undefined;
  const v = VARIANT[action.variant ?? 'default'];
  return (
    <Button
      ref={ref}
      variant={v.variant}
      disabled={action.disabled}
      aria-keyshortcuts={kbd}
      onClick={action.onSelect}
      className={cn('flex-none', v.className, className)}
      data-slot="action-bar-button"
      data-action={action.id}
      {...props}
    >
      {action.icon}
      {action.label}
      {kbd && <ActionKbd>{kbd}</ActionKbd>}
    </Button>
  );
});
ActionButton.displayName = 'ActionButton';

/** Width the row needs with every child at its natural size (the tail's auto margin ignored). */
const natural = (el: HTMLElement): number => {
  const cs = getComputedStyle(el);
  const kids = Array.from(el.children) as HTMLElement[];
  const gap = parseFloat(cs.columnGap) || 0;
  const pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
  return pad + kids.reduce((sum, k) => sum + k.offsetWidth, 0) + gap * Math.max(0, kids.length - 1);
};

/** Collapse level that fits: 0 all shown, 1 tail in More, 2 also secondary actions, 3 also the menu. */
export const useFitLevel = (ref: React.RefObject<HTMLDivElement | null>, key: string) => {
  const [fit, setFit] = React.useState({ key, level: 0 });
  // New actions start a fresh pass from level 0 (state adjusted during render, no effect).
  if (fit.key !== key) setFit({ key, level: 0 });
  const level = fit.key === key ? fit.level : 0;
  const needed = React.useRef<Record<string, number>>({});
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const need = natural(el);
    needed.current[`${key}:${String(level)}`] = need;
    if (need > el.clientWidth + 1 && level < 3) setFit({ key, level: level + 1 });
  }, [ref, level, key]);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      const width = el.clientWidth;
      const known = [0, 1, 2, 3].filter((l) => needed.current[`${key}:${String(l)}`] !== undefined);
      const fits = known.find((l) => needed.current[`${key}:${String(l)}`] <= width + 1);
      // Nothing measured fits yet: try the next level, the layout pass measures it.
      setFit({ key, level: fits ?? Math.min(3, (known.at(-1) ?? -1) + 1) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, key]);
  return level;
};

const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/** A key meant for an open menu, listbox or a dialog the bar is not part of. */
const elsewhere = (t: EventTarget | null, owner: HTMLElement | null): boolean => {
  if (!(t instanceof Element)) return false;
  if (t.closest('[role="menu"], [role="listbox"], [role="combobox"]')) return true;
  const dialog = t.closest('[role="dialog"], [role="alertdialog"]');
  return dialog !== null && !(owner && dialog.contains(owner));
};

/** Single-key shortcuts for the bar's actions; ignored while typing, in menus and on key repeat. */
export const useHotkeys = (
  enabled: boolean,
  actions: ActionBarAction[],
  scope?: React.RefObject<HTMLElement | null>,
  owner?: React.RefObject<HTMLElement | null>
) => {
  const ref = React.useRef(actions);
  React.useLayoutEffect(() => {
    ref.current = actions;
  });
  React.useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || typing(e.target)) return;
      if (elsewhere(e.target, owner?.current ?? null)) return;
      const hit = ref.current.find((a) => a.kbd?.toLowerCase() === e.key.toLowerCase());
      if (!hit || hit.disabled) return;
      e.preventDefault();
      hit.onSelect?.();
    };
    const target: HTMLElement | Document = scope?.current ?? document;
    target.addEventListener('keydown', onKey as EventListener);
    return () => target.removeEventListener('keydown', onKey as EventListener);
  }, [enabled, scope, owner]);
};
