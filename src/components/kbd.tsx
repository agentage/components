import * as React from 'react';
import { cn } from '../lib/utils';

export type KbdProps = React.HTMLAttributes<HTMLElement>;

/** The one key cap: 20 px high, 11 px mono. It fits a 28 px and a 24 px button unchanged. */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => (
  <kbd
    ref={ref}
    className={cn(
      'inline-flex h-5 min-w-5 shrink-0 select-none items-center justify-center gap-1 rounded-md border border-border bg-muted px-1.5 font-mono text-2xs font-medium text-muted-foreground',
      className
    )}
    data-slot="kbd"
    {...props}
  />
));
Kbd.displayName = 'Kbd';
