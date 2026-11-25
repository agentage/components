import * as React from 'react';
import { cn } from '../lib/utils';
import { listRowSize, listRowTitleClass, Meta } from './entity-list.parts';
import { rowVariants } from './row.variants';

export interface ListRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  href?: string;
  leading?: React.ReactNode;
  title?: React.ReactNode;
  /** Second line; the row grows from 36 px to 52 px. */
  description?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  selected?: boolean;
}

/** One list row; a `href` stretches over the whole row while `actions` stay clickable above it. */
export const ListRow = React.forwardRef<HTMLDivElement, ListRowProps>(
  (
    {
      href,
      leading,
      title,
      description,
      meta,
      actions,
      selected = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const interactive = href !== undefined || props.onClick !== undefined;
    const stretch = cn(listRowTitleClass, 'text-left after:absolute after:inset-0 focus-ring');
    // Pseudo-element overlay keeps the whole row clickable without nesting actions in the link.
    const titleNode =
      title !== undefined &&
      (href ? (
        <a href={href} className={stretch} data-slot="list-row-link">
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
    return (
      <div
        ref={ref}
        className={cn(
          rowVariants({ size: listRowSize('default', !!description), interactive, selected }),
          className
        )}
        data-slot="list-row"
        {...props}
      >
        {leading && <span className="flex shrink-0 items-center [&_svg]:size-4">{leading}</span>}
        <div className="min-w-0 flex-1">
          {titleNode}
          {description && (
            <span className="mt-px block truncate text-xs leading-4 text-muted-foreground">
              {description}
            </span>
          )}
          {children}
        </div>
        {(meta || actions) && (
          <div className="flex shrink-0 items-center gap-2.5">
            <Meta meta={meta} />
            {actions && <span className="relative z-10 flex items-center">{actions}</span>}
          </div>
        )}
      </div>
    );
  }
);
ListRow.displayName = 'ListRow';
