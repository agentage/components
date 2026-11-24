import * as React from 'react';
import { cn } from '../lib/utils';
import {
  listRowSize,
  listRowTitleClass,
  Meta,
  StackedRowBody,
  type ListItem,
  type ListRowVariant,
} from './entity-list.parts';
import { rowVariants } from './row.variants';

export interface ListRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  href?: string;
  target?: string;
  rel?: string;
  leading?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  /** `default`: 36 px one-line or 52 px two-line. `stacked`: 54 px with dot, glyph and meta. */
  variant?: ListRowVariant;
  selected?: boolean;
  icon?: ListItem['icon'];
  iconTone?: ListItem['iconTone'];
  kind?: string;
  emphasized?: boolean;
  alert?: React.ReactNode;
  /**
   * Deprecated: The dense row is the only look; `comfortable` keeps the pre-0.21 padding.
   * @deprecated The dense row is the only look; `comfortable` keeps the pre-0.21 padding.
   */
  density?: 'compact' | 'comfortable';
}

/** One list row; a `href` stretches over the whole row while `actions` stay clickable above it. */
export const ListRow = React.forwardRef<HTMLDivElement, ListRowProps>(
  (
    {
      href,
      target,
      rel,
      leading,
      title,
      description,
      meta,
      actions,
      variant = 'default',
      selected = false,
      icon,
      iconTone,
      kind,
      emphasized,
      alert,
      density = 'compact',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const compact = density === 'compact';
    const interactive = href !== undefined || props.onClick !== undefined;
    const stretch = cn(listRowTitleClass, 'text-left after:absolute after:inset-0 focus-ring');
    // Pseudo-element overlay keeps the whole row clickable without nesting actions in the link.
    const titleNode =
      title !== undefined &&
      (href ? (
        <a href={href} target={target} rel={rel} className={stretch} data-slot="list-row-link">
          {title}
        </a>
      ) : props.onClick ? (
        // The row's onClick receives the bubbled click, so Enter and Space work through this button.
        <button type="button" className={stretch} data-slot="list-row-button">
          {title}
        </button>
      ) : (
        <span className={listRowTitleClass}>{title}</span>
      ));
    const end = (meta || alert || actions) && (
      <div className="flex shrink-0 items-center gap-2.5">
        <Meta meta={meta} alert={alert} />
        {actions && <span className="relative z-10 flex items-center">{actions}</span>}
      </div>
    );
    return (
      <div
        ref={ref}
        className={cn(
          compact
            ? rowVariants({ size: listRowSize(variant, !!description), interactive, selected })
            : 'relative flex items-center gap-3 px-4 py-3 text-ui transition-colors duration-fast hover:bg-accent',
          className
        )}
        data-slot="list-row"
        data-density={density}
        {...props}
      >
        {variant === 'stacked' ? (
          <>
            <StackedRowBody
              item={{
                title: titleNode,
                description,
                icon: icon ?? leading,
                iconTone,
                kind,
                emphasized,
                alert,
              }}
              end={end || undefined}
            />
            {children}
          </>
        ) : (
          <>
            {leading && (
              <span className="flex shrink-0 items-center [&_svg]:size-4">{leading}</span>
            )}
            <div className="min-w-0 flex-1">
              {titleNode}
              {description && (
                <span className="mt-px block truncate text-xs leading-4 text-muted-foreground">
                  {description}
                </span>
              )}
              {children}
            </div>
            {end}
          </>
        )}
      </div>
    );
  }
);
ListRow.displayName = 'ListRow';
