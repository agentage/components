import * as React from 'react';
import { cn } from '../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn('grid auto-rows-min grid-cols-[1fr_auto] items-start gap-1', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-title"
      className={cn('text-ui leading-5 font-semibold', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-description"
      className={cn('text-xs text-muted-foreground', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardDescription.displayName = 'CardDescription';

export const CardAction = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardAction.displayName = 'CardAction';
