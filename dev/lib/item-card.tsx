'use client';
import type { ReactNode } from 'react';
import { Card, Checkbox, cn, DropdownMenu, Switch } from '../../src';

/** Docs composition "Item card": Card + Checkbox + Switch + DropdownMenu, no extra component. */
export interface ItemCardProps {
  title: ReactNode;
  /** Plain-text name for the control labels when `title` is not a string. */
  name?: string;
  indicator?: ReactNode;
  description?: ReactNode;
  facts?: { label: ReactNode; value: ReactNode }[];
  footer?: ReactNode;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  menu?: ReactNode;
  onOpen?: () => void;
  className?: string;
}

// Controls and links sit above the stretched title button, so a click on them never opens the card.
const ABOVE = 'relative z-10';
const RAISE = '[&_:is(a,button,[tabindex])]:relative [&_:is(a,button,[tabindex])]:z-10';
const TITLE = 'min-w-0 truncate text-ui font-semibold text-foreground';
const MENU =
  'relative z-10 grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-ring aria-expanded:bg-accent aria-expanded:text-foreground';

const More = () => (
  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
);

export const ItemCard = (p: ItemCardProps) => {
  const label = p.name ?? (typeof p.title === 'string' ? p.title : 'item');
  return (
    <Card
      interactive={Boolean(p.onOpen)}
      selected={p.selected}
      className={cn('relative', p.className)}
    >
      <div className="flex h-6 min-w-0 items-center gap-2">
        {p.indicator && <span className="flex shrink-0 items-center">{p.indicator}</span>}
        {p.onOpen ? (
          <button
            type="button"
            onClick={p.onOpen}
            className={cn(TITLE, 'text-left outline-none after:absolute after:inset-0')}
            data-card-activator=""
          >
            {p.title}
          </button>
        ) : (
          <span className={TITLE}>{p.title}</span>
        )}
        <span className="flex-1" />
        {p.onSelectedChange && (
          <Checkbox
            className={ABOVE}
            checked={p.selected ?? false}
            onCheckedChange={p.onSelectedChange}
            aria-label={`Select ${label}`}
          />
        )}
        {p.enabled !== undefined && (
          <Switch
            className={ABOVE}
            checked={p.enabled}
            onCheckedChange={p.onEnabledChange}
            aria-label={`${p.enabled ? 'Pause' : 'Enable'} ${label}`}
          />
        )}
        {p.menu && (
          <DropdownMenu
            trigger={
              <button
                type="button"
                aria-label={`Actions for ${label}`}
                title={`Actions for ${label}`}
                className={MENU}
              >
                <More />
              </button>
            }
          >
            {p.menu}
          </DropdownMenu>
        )}
      </div>
      {p.description && (
        <p className={cn('m-0 line-clamp-2 h-9 text-xs leading-4.5 text-muted-foreground', RAISE)}>
          {p.description}
        </p>
      )}
      {p.facts && p.facts.length > 0 && (
        <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-2.5 gap-y-[5px] text-xs">
          {p.facts.map((f, i) => (
            <div key={i} className="contents">
              <dt className="text-muted-foreground">{f.label}</dt>
              <dd className="m-0 flex min-w-0 items-center gap-[5px] truncate whitespace-nowrap">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {p.footer && (
        <div
          className={cn(
            'flex min-w-0 items-center justify-between gap-2 border-t border-border pt-2 text-xs text-muted-foreground',
            RAISE
          )}
        >
          {p.footer}
        </div>
      )}
    </Card>
  );
};
