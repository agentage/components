'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Card } from './card';
import { Checkbox } from './checkbox';
import { RowMenu } from './data-table.menu';
import { Switch } from './switch';

export interface EntityCardFact {
  label: React.ReactNode;
  value: React.ReactNode;
}

export interface EntityCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  /** Plain-text name for accessible labels when `title` is not a string. */
  name?: string;
  /** Leading status mark, for example a StatusGlyph. */
  indicator?: React.ReactNode;
  /** Clamped to two lines. */
  description?: React.ReactNode;
  /** Label and value pairs in a two-column grid. */
  facts?: EntityCardFact[];
  /** Bottom row above a top border, for example a StatusBar and a count. */
  footer?: React.ReactNode;
  selectable?: boolean;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Shows a switch when defined. */
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  /** DropdownMenu items of the card menu. */
  menu?: React.ReactNode;
  /** Makes the whole card open the entity; the title becomes the button. */
  onOpen?: () => void;
  selectLabel?: string;
  enabledLabel?: string;
  menuLabel?: string;
}

// Controls sit above the stretched title button so a click on them never opens the card.
const ABOVE = 'relative z-10';
// Links, buttons and focusable marks (ticks) in free content sit above the stretched title.
const RAISE = '[&_:is(a,button,[tabindex])]:relative [&_:is(a,button,[tabindex])]:z-10';

const Facts = ({ facts }: { facts: EntityCardFact[] }) => (
  <dl
    className="m-0 grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-2.5 gap-y-[5px] text-xs"
    data-slot="entity-card-facts"
  >
    {facts.map((fact, i) => (
      <React.Fragment key={i}>
        <dt className="text-muted-foreground">{fact.label}</dt>
        <dd className="m-0 flex min-w-0 items-center gap-[5px] truncate whitespace-nowrap">
          {fact.value}
        </dd>
      </React.Fragment>
    ))}
  </dl>
);

const Title = ({ title, onOpen }: Pick<EntityCardProps, 'title' | 'onOpen'>) => {
  const className = 'min-w-0 truncate text-ui font-semibold text-foreground';
  if (!onOpen) return <span className={className}>{title}</span>;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(className, 'text-left outline-none after:absolute after:inset-0')}
      data-card-activator=""
      data-slot="entity-card-open"
    >
      {title}
    </button>
  );
};

/** Dense rich card: indicator, title, two-line description, facts, footer and top-right controls. */
export const EntityCard = React.forwardRef<HTMLDivElement, EntityCardProps>((props, ref) => {
  const {
    title,
    name,
    indicator,
    description,
    facts,
    footer,
    selectable,
    selected = false,
    onSelectedChange,
    enabled,
    onEnabledChange,
    menu,
    onOpen,
    selectLabel,
    enabledLabel,
    menuLabel,
    className,
    ...div
  } = props;
  const label = name ?? (typeof title === 'string' ? title : 'item');

  return (
    <Card
      ref={ref}
      padding="sm"
      interactive={Boolean(onOpen)}
      selected={selected}
      className={cn('relative', className)}
      data-slot="entity-card"
      {...div}
    >
      <div className="flex h-6 min-w-0 items-center gap-2">
        {indicator && <span className="flex shrink-0 items-center">{indicator}</span>}
        <Title title={title} onOpen={onOpen} />
        <span className="flex-1" />
        {selectable && (
          <Checkbox
            className={ABOVE}
            checked={selected}
            onCheckedChange={onSelectedChange}
            aria-label={selectLabel ?? `Select ${label}`}
          />
        )}
        {enabled !== undefined && (
          <Switch
            className={ABOVE}
            checked={enabled}
            onCheckedChange={onEnabledChange}
            aria-label={enabledLabel ?? `${enabled ? 'Pause' : 'Enable'} ${label}`}
          />
        )}
        {menu && <RowMenu label={menuLabel ?? `Actions for ${label}`}>{menu}</RowMenu>}
      </div>
      {description && (
        <p className={cn('m-0 line-clamp-2 h-9 text-xs leading-4.5 text-muted-foreground', RAISE)}>
          {description}
        </p>
      )}
      {facts && facts.length > 0 && <Facts facts={facts} />}
      {footer && (
        <div
          className={cn(
            'flex min-w-0 items-center justify-between gap-2 border-t border-border pt-2 text-xs text-muted-foreground',
            RAISE
          )}
        >
          {footer}
        </div>
      )}
    </Card>
  );
});
EntityCard.displayName = 'EntityCard';
