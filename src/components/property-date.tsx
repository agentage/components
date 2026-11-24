'use client';

import * as React from 'react';
import { useMounted } from '../lib/use-mounted';
import { useRovingFocus } from '../lib/use-roving-focus';
import { cn } from '../lib/utils';
import { fieldVariants } from './control.variants';
import { menuItemVariants, menuLabelVariants } from './menu.variants';
import { Popover } from './popover';
import { formatPropertyDate } from './property-date.format';
import { PropertyValue, usePropertyLabel } from './description-list.property';

const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const iso = (d: Date) =>
  `${String(d.getFullYear())}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export interface PropertyDateProps {
  value: Date | null;
  onValueChange: (value: Date | null) => void;
  /** "Today" for presets and the overdue check; the current date by default. */
  today?: Date;
  className?: string;
}

const PRESETS = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'Next week', days: 7 },
  { label: 'In two weeks', days: 14 },
];

const ITEM = cn(menuItemVariants(), 'justify-between text-left focus-visible:bg-accent');

interface DateOptionsProps {
  label: string;
  today: Date;
  value: Date | null;
  onPick: (d: Date | null) => void;
  /** Saves a typed day without closing; used when the popover closes on an outside press. */
  onCommit: (d: Date) => void;
}

const OPTION = '[data-slot="property-date-option"]';

const parseDraft = (draft: string, value: Date | null): Date | null => {
  const [y, m, d] = draft.split('-').map(Number);
  return y > 999 && m && d && draft !== (value ? iso(value) : '') ? new Date(y, m - 1, d) : null;
};

/** Popover body: mounts with the popover, so it binds arrow keys and takes focus on open. */
const DateOptions = ({ label, today, value, onPick, onCommit }: DateOptionsProps) => {
  const picked = React.useRef(false);
  const pick = (d: Date | null): void => {
    picked.current = true;
    onPick(d);
  };
  const list = React.useRef<HTMLDivElement>(null);
  const [draft, setDraft] = React.useState(value ? iso(value) : '');
  const commitDraft = (): void => {
    const d = parseDraft(draft, value);
    if (d) pick(d);
  };
  // An outside press unmounts the field before its blur, so a pending day is saved here.
  const pending = React.useRef<() => void>(() => {});
  React.useLayoutEffect(() => {
    pending.current = () => {
      const d = parseDraft(draft, value);
      if (d) onCommit(d);
    };
  });
  React.useEffect(
    () => () => {
      if (!picked.current) pending.current();
    },
    []
  );
  useRovingFocus(list, { selector: OPTION, loop: true });
  React.useEffect(() => {
    list.current?.querySelector<HTMLElement>(OPTION)?.focus();
  }, []);
  return (
    <div ref={list} className="flex flex-col">
      {label && <div className={menuLabelVariants()}>{label}</div>}
      {PRESETS.map((p) => {
        const d = addDays(today, p.days);
        return (
          <button
            key={p.label}
            type="button"
            className={ITEM}
            onClick={() => pick(d)}
            data-slot="property-date-option"
          >
            <span>{p.label}</span>
            <span className="text-xs text-muted-foreground">{formatPropertyDate(d, today)}</span>
          </button>
        );
      })}
      <button
        type="button"
        className={ITEM}
        onClick={() => pick(null)}
        data-slot="property-date-option"
      >
        No date
      </button>
      <div className="my-1 h-px bg-border" role="separator" />
      {/* A draft: typing "15" passes through day 1, so the day commits on Enter or blur only. */}
      <input
        type="date"
        aria-label={`${label || 'Date'}, pick a day`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => {
          // Moving to a preset picks that preset instead of the typed day.
          if (!list.current?.contains(e.relatedTarget as Node | null)) commitDraft();
        }}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          // Focus returns to the value before Enter's default action, which would reopen it.
          e.preventDefault();
          commitDraft();
        }}
        className={cn(fieldVariants({ size: 'sm' }), 'bg-background text-foreground')}
      />
    </div>
  );
};

/** A due date: presets, a date field and No date; overdue values show in the destructive tone. */
export const PropertyDate = React.forwardRef<HTMLButtonElement, PropertyDateProps>(
  ({ value, onValueChange, today: todayProp, className }, ref) => {
    const label = usePropertyLabel();
    const [open, setOpen] = React.useState(false);
    const trigger = React.useRef<HTMLButtonElement>(null);
    React.useImperativeHandle(ref, () => trigger.current as HTMLButtonElement);
    // Server and client clocks and zones differ, so the date text and overdue wait for mount.
    const mounted = useMounted();
    const today = startOf(todayProp ?? new Date());
    const known = mounted || todayProp !== undefined;
    const overdue = known && value !== null && startOf(value) < today;
    const text = !value
      ? 'Set date'
      : known
        ? formatPropertyDate(value, today)
        : value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    const close = (): void => {
      setOpen(false);
      trigger.current?.focus();
    };
    const pick = (d: Date | null): void => {
      onValueChange(d);
      close();
    };
    return (
      <Popover
        open={open}
        onOpenChange={() => setOpen(false)}
        side="bottom"
        aria-label={label || 'Date'}
        className="w-55 min-w-0 p-1"
        onKeyDown={(e) => {
          if (e.key !== 'Escape') return;
          // Handled here so focus goes back to the value; the popover's own listener never sees it.
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          close();
        }}
        trigger={
          <PropertyValue
            ref={trigger}
            valueText={`${text}${overdue ? ', overdue' : ''}`}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className={cn(
              !value && 'text-muted-foreground',
              overdue && 'text-destructive',
              className
            )}
          >
            <span className={cn(!known && value && 'invisible')}>{text}</span>
          </PropertyValue>
        }
        content={
          <DateOptions
            label={label}
            today={today}
            value={value}
            onPick={pick}
            onCommit={onValueChange}
          />
        }
      />
    );
  }
);
PropertyDate.displayName = 'PropertyDate';
