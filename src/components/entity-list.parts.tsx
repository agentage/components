import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

/** Data of one row `List` renders from `items`. */
export interface ListItem {
  id: string;
  title: React.ReactNode;
  /** Second line, 12 px muted. */
  description?: React.ReactNode;
  /** Leading slot, for example an Avatar or a StatusGlyph. */
  leading?: React.ReactNode;
  /** `stacked` rows: 14 px kind glyph in a 20 px box. */
  icon?: React.ReactNode;
  iconTone?: 'primary' | 'success' | 'destructive' | 'info' | 'muted';
  /** Accessible kind read before the title, for example "Review". */
  kind?: string;
  /** `stacked` rows: bold title and a leading dot, read as "New". */
  emphasized?: boolean;
  /** Quiet right-hand meta, for example "18 min". */
  meta?: React.ReactNode;
  /** Amber right-hand meta that wins over `meta`, for example "waiting 4 min". */
  alert?: React.ReactNode;
}

export type ListRowVariant = 'default' | 'stacked';

const iconVariants = cva('grid size-5 shrink-0 place-items-center rounded-md [&_svg]:size-3.5', {
  variants: {
    tone: {
      primary: 'text-primary',
      success: 'text-success',
      destructive: 'text-destructive',
      info: 'text-info',
      muted: 'text-muted-foreground',
    },
  },
  defaultVariants: { tone: 'muted' },
});

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" className="size-3 fill-none stroke-current stroke-2" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" strokeLinecap="round" />
  </svg>
);

export const Meta = ({ meta, alert }: Pick<ListItem, 'meta' | 'alert'>) =>
  alert ? (
    <span className="flex shrink-0 items-center gap-1 text-xs text-primary-emphasis">
      <ClockIcon />
      {alert}
    </span>
  ) : meta !== undefined ? (
    <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">{meta}</span>
  ) : null;

/** 54 px stacked body: dot, kind glyph, title and meta over the description. */
export const StackedRowBody = ({ item }: { item: Omit<ListItem, 'id'> }) => (
  <>
    <span className="flex min-w-0 items-center gap-2">
      <span
        className={cn('size-2 shrink-0 rounded-full', item.emphasized && 'bg-primary')}
        aria-hidden="true"
      />
      {item.emphasized && <span className="sr-only">New, </span>}
      <span className={iconVariants({ tone: item.iconTone })} aria-hidden="true">
        {item.icon}
      </span>
      {item.kind && <span className="sr-only">{item.kind}: </span>}
      <span
        className={cn('min-w-0 flex-1 truncate', item.emphasized && 'font-bold')}
        data-slot="list-row-title"
      >
        {item.title}
      </span>
      <Meta meta={item.meta} alert={item.alert} />
    </span>
    {item.description !== undefined && (
      <span className="block truncate pl-11 text-xs text-muted-foreground">{item.description}</span>
    )}
  </>
);

/** Row size from the layout and whether there is a second line. */
export const listRowSize = (variant: ListRowVariant, twoLine: boolean) =>
  variant === 'stacked' ? 'stacked' : twoLine ? 'twoLine' : 'list';

export const listRowTitleClass = 'block truncate font-semibold leading-5 text-foreground';

/** Default body of a data-mode row: leading slot, title over description, meta. */
export const DefaultRowBody = ({ item }: { item: Omit<ListItem, 'id'> }) => (
  <>
    {item.leading && (
      <span className="flex shrink-0 items-center [&_svg]:size-4">{item.leading}</span>
    )}
    <span className="min-w-0 flex-1">
      <span className={listRowTitleClass}>{item.title}</span>
      {item.description !== undefined && (
        <span className="mt-px block truncate text-xs leading-4 text-muted-foreground">
          {item.description}
        </span>
      )}
    </span>
    <Meta meta={item.meta} alert={item.alert} />
  </>
);
