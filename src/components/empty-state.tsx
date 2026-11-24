import * as React from 'react';
import { cn } from '../lib/utils';

export interface EmptyStateProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title' | 'children'
> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /** center (default) for a whole surface; start for a compact, left-aligned block in a list. */
  align?: 'center' | 'start';
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, align = 'center', className, ...props }, ref) => {
    const start = align === 'start';
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col',
          start
            ? 'items-start gap-2.5 px-6 py-8 text-left'
            : 'items-center justify-center px-6 py-10 text-center',
          className
        )}
        data-slot="empty-state"
        data-align={align}
        {...props}
      >
        {icon && (
          <div
            className={cn(
              'flex items-center justify-center text-muted-foreground',
              start
                ? 'size-7 rounded-md bg-muted [&_svg]:size-4'
                : 'mb-3 size-10 rounded-full bg-muted'
            )}
          >
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className={cn('mt-1 text-ui text-muted-foreground', !start && 'max-w-sm')}>
              {description}
            </p>
          )}
        </div>
        {action && <div className={start ? undefined : 'mt-4'}>{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';
