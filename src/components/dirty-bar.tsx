'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';

export interface DirtyBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Shows the bar. It overlays the bottom of the nearest positioned ancestor. */
  dirty: boolean;
  /** Save is in flight: actions are blocked but keep focus, and Save is announced as `pendingLabel`. */
  pending?: boolean;
  onSave: () => void;
  onDiscard: () => void;
  /** Second mode: the user tried to leave with unsaved changes. Focus moves to Stay. */
  leaving?: boolean;
  onStay?: () => void;
  /** Leave and drop the changes. */
  onLeave?: () => void;
  message?: React.ReactNode;
  leaveMessage?: React.ReactNode;
  saveLabel?: string;
  discardLabel?: string;
  pendingLabel?: string;
  stayLabel?: string;
  leaveLabel?: string;
  /** Save label in leave mode; Save then calls `onSave` and the caller continues the navigation. */
  saveAndLeaveLabel?: string;
}

const SHOWN = 'translate-y-0 opacity-100 [transition:opacity_160ms,translate_160ms]';
// Visibility flips after the fade so the bar animates out instead of vanishing.
const HIDDEN =
  'invisible translate-y-3 opacity-0 [transition:opacity_160ms,translate_160ms,visibility_0s_160ms]';

// Quiet: transparent fill and a border that melts into the bar, so Save is the one loud action.
const QUIET =
  'bg-transparent shadow-none hover:bg-foreground/5 dark:bg-transparent dark:hover:bg-foreground/5';

const useFocusOnLeave = (leaving: boolean) => {
  const stayRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (leaving) stayRef.current?.focus({ preventScroll: true });
  }, [leaving]);
  return stayRef;
};

/** Keeps focus off body: a swapped mode lands on Save, a hidden bar returns focus to the opener. */
const useKeepFocus = (shown: boolean, leaving: boolean) => {
  const bar = React.useRef<HTMLDivElement>(null);
  const save = React.useRef<HTMLButtonElement>(null);
  const opener = React.useRef<HTMLElement | null>(null);
  const inside = React.useRef(false);
  React.useLayoutEffect(() => {
    if (!inside.current) return;
    const active = document.activeElement;
    const lost = !active || active === document.body || !bar.current?.contains(active);
    if (shown && lost) save.current?.focus({ preventScroll: true });
    if (!shown) {
      inside.current = false;
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    }
  }, [shown, leaving]);
  const handlers = {
    onFocus: (e: React.FocusEvent) => {
      const from = e.relatedTarget as HTMLElement | null;
      if (from && !bar.current?.contains(from)) opener.current = from;
      inside.current = true;
    },
    onBlur: (e: React.FocusEvent) => {
      const to = e.relatedTarget as Node | null;
      if (to && !bar.current?.contains(to)) inside.current = false;
    },
  };
  return { bar, save, handlers };
};

/** Floating "Unsaved changes" bar with Save and Discard, plus a leave-confirm mode. */
export const DirtyBar = React.forwardRef<HTMLDivElement, DirtyBarProps>(
  (
    {
      dirty,
      pending = false,
      onSave,
      onDiscard,
      leaving = false,
      onStay,
      onLeave,
      message = 'Unsaved changes',
      leaveMessage = 'Leave without saving?',
      saveLabel = 'Save',
      discardLabel = 'Discard',
      pendingLabel = 'Saving',
      stayLabel = 'Stay',
      leaveLabel = 'Discard and leave',
      saveAndLeaveLabel = 'Save and leave',
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const shown = dirty || leaving;
    const stayRef = useFocusOnLeave(leaving);
    const { bar, save, handlers } = useKeepFocus(shown, leaving);
    React.useImperativeHandle(ref, () => bar.current as HTMLDivElement);

    return (
      <div
        ref={bar}
        role="region"
        aria-label={ariaLabel ?? 'Unsaved changes'}
        aria-hidden={shown ? undefined : true}
        aria-busy={pending || undefined}
        inert={!shown}
        className={cn(
          'absolute bottom-3.5 left-1/2 z-[var(--z-sticky,40)] flex min-h-11 w-[min(560px,calc(100%-24px))] -translate-x-1/2 flex-wrap items-center gap-2.5',
          'rounded-lg border border-l-3 border-border border-l-primary bg-accent py-1.5 pl-3.5 pr-2 text-ui text-foreground shadow-[var(--shadow-popover)]',
          'motion-reduce:transition-none',
          shown ? SHOWN : HIDDEN,
          className
        )}
        data-slot="dirty-bar"
        data-state={leaving ? 'leaving' : shown ? 'dirty' : 'clean'}
        {...props}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
      >
        <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
        <span className={cn('min-w-0 flex-1', leaving && 'font-semibold')}>
          {leaving ? leaveMessage : message}
        </span>
        {leaving ? (
          <>
            <Button key="stay" ref={stayRef} variant="outline" size="md" onClick={onStay}>
              {stayLabel}
            </Button>
            <Button
              key="leave"
              variant="outline"
              size="md"
              onClick={pending ? undefined : onLeave}
              aria-disabled={pending || undefined}
            >
              {leaveLabel}
            </Button>
            <Button
              key="save-leave"
              size="md"
              onClick={onSave}
              pending={pending}
              aria-label={pending ? pendingLabel : undefined}
            >
              {saveAndLeaveLabel}
            </Button>
          </>
        ) : (
          <>
            <Button
              key="discard"
              variant="outline"
              size="md"
              className={QUIET}
              onClick={pending ? undefined : onDiscard}
              aria-disabled={pending || undefined}
            >
              {discardLabel}
            </Button>
            <Button
              key="save"
              ref={save}
              size="md"
              onClick={onSave}
              pending={pending}
              aria-label={pending ? pendingLabel : undefined}
            >
              {saveLabel}
            </Button>
          </>
        )}
      </div>
    );
  }
);
DirtyBar.displayName = 'DirtyBar';
