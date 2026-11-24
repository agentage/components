import * as React from 'react';
import { cn } from '../lib/utils';

export type CountProps = React.HTMLAttributes<HTMLSpanElement>;

/** The quiet number beside a label: tabs, group headers, navigation rows. */
export const Count = React.forwardRef<HTMLSpanElement, CountProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('shrink-0 text-xs font-normal tabular-nums text-muted-foreground', className)}
      data-slot="count"
      {...props}
    />
  )
);
Count.displayName = 'Count';
