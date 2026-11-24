'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import {
  ActionButton,
  ActionKbd,
  useFitLevel,
  useHotkeys,
  type ActionBarAction,
} from './action-bar.parts';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './dropdown-menu';

export type { ActionBarAction } from './action-bar.parts';

export interface ActionBarMenu {
  label: string;
  icon?: React.ReactNode;
  kbd?: string;
  /** DropdownMenu items. */
  children: React.ReactNode;
}

export interface ActionBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Main actions in order; the first one never collapses. */
  actions: ActionBarAction[];
  /** One action that opens a menu, for example Assign. */
  menu?: ActionBarMenu;
  /** Quiet actions pushed to the right edge; the first to collapse into More. */
  tail?: ActionBarAction[];
  /** Listen for the `kbd` keys (ignored while typing): in `hotkeyScope` when given, else the document. */
  hotkeys?: boolean;
  /** Element whose key presses trigger the actions, for example the pane; keeps keys local. */
  hotkeyScope?: React.RefObject<HTMLElement | null>;
}

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" className="fill-current" aria-hidden="true">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
);

const item = (a: ActionBarAction, hotkeys: boolean) => (
  <DropdownMenuItem
    key={a.id}
    icon={a.icon}
    disabled={a.disabled}
    onClick={a.onSelect}
    variant={a.variant === 'destructive' ? 'destructive' : 'default'}
  >
    <span className="flex-1 text-left">{a.label}</span>
    {hotkeys && a.kbd && <ActionKbd>{a.kbd}</ActionKbd>}
  </DropdownMenuItem>
);

/**
 * The 51 px action row at the bottom of a pane: actions with key hints, a menu action and a
 * right-aligned tail. When the pane is narrow, the tail, then the secondary actions, then the menu
 * action move into a More menu; the row never wraps.
 */
export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  ({ actions, menu, tail = [], hotkeys = false, hotkeyScope, className, ...props }, ref) => {
    const inner = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => inner.current as HTMLDivElement);
    // Labels are in the key too: "Approve" growing to "Approving..." must measure again.
    const ids = [...actions, ...tail].map((a) => `${a.id}:${a.label}`).join(',');
    const level = useFitLevel(inner, `${ids}|${menu?.label ?? ''}`);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuKey: ActionBarAction[] =
      menu?.kbd && level < 3
        ? [
            {
              id: 'action-bar-menu',
              label: menu.label,
              kbd: menu.kbd,
              onSelect: () => setMenuOpen(true),
            },
          ]
        : [];
    useHotkeys(hotkeys, [...actions, ...tail, ...menuKey], hotkeyScope, inner);
    const menuKbd = hotkeys ? menu?.kbd : undefined;
    const [first, ...rest] = actions;
    const shownRest = level >= 2 ? [] : rest;
    const shownTail = level >= 1 ? [] : tail;
    const folded = [...(level >= 2 ? rest : []), ...(level >= 1 ? tail : [])];

    return (
      <div
        ref={inner}
        role="toolbar"
        aria-label={props['aria-label'] ?? 'Actions'}
        className={cn(
          'sticky bottom-0 flex h-[51px] flex-none flex-nowrap items-center gap-2 overflow-hidden border-t border-border bg-background px-4 py-2.5',
          className
        )}
        data-slot="action-bar"
        data-level={level}
        {...props}
      >
        {first && <ActionButton action={first} hotkeys={hotkeys} />}
        {shownRest.map((a) => (
          <ActionButton key={a.id} action={a} hotkeys={hotkeys} />
        ))}
        {menu && level < 3 && (
          <DropdownMenu
            align="start"
            side="top"
            open={menuOpen}
            onOpenChange={setMenuOpen}
            trigger={
              <Button variant="outline" aria-keyshortcuts={menuKbd} className="flex-none">
                {menu.icon}
                {menu.label}
                {menuKbd && <ActionKbd>{menuKbd}</ActionKbd>}
              </Button>
            }
          >
            {menu.children}
          </DropdownMenu>
        )}
        <div className="ml-auto flex flex-none items-center gap-1" data-slot="action-bar-tail">
          {shownTail.map((a) => (
            <ActionButton key={a.id} action={{ variant: 'ghost', ...a }} hotkeys={hotkeys} />
          ))}
          {(folded.length > 0 || (menu && level >= 3)) && (
            <DropdownMenu
              side="top"
              aria-label="More"
              trigger={
                <Button variant="ghost" size="icon" aria-label="More" title="More">
                  <MoreIcon />
                </Button>
              }
            >
              {menu && level >= 3 && (
                <>
                  <DropdownMenuLabel>{menu.label}</DropdownMenuLabel>
                  {menu.children}
                  <DropdownMenuSeparator />
                </>
              )}
              {folded.map((a, i) => (
                <React.Fragment key={a.id}>
                  {i > 0 && level >= 2 && i === rest.length && <DropdownMenuSeparator />}
                  {item(a, hotkeys)}
                </React.Fragment>
              ))}
            </DropdownMenu>
          )}
        </div>
      </div>
    );
  }
);
ActionBar.displayName = 'ActionBar';
