import * as React from 'react';
import { cn } from '../lib/utils';

export interface TruncateProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  /** `end` cuts the tail with an ellipsis; `middle` keeps the last path segment whole. */
  position?: 'end' | 'middle';
}

/** One-line text that never wraps; the full text is in the native tooltip. */
export const Truncate = React.forwardRef<HTMLSpanElement, TruncateProps>(
  ({ text, position = 'end', className, ...props }, ref) => {
    if (position === 'end')
      return (
        <span
          ref={ref}
          className={cn('block min-w-0 truncate', className)}
          title={text}
          data-slot="truncate"
          {...props}
        >
          {text}
        </span>
      );
    const cut = text.replace(/\/$/, '').lastIndexOf('/');
    const head = cut > 0 ? text.slice(0, cut + 1) : '';
    const tail = cut > 0 ? text.slice(cut + 1) : text;
    return (
      <span
        ref={ref}
        className={cn('flex min-w-0 cursor-default', className)}
        title={text}
        data-slot="truncate"
        {...props}
      >
        {head && <span className="min-w-0 truncate">{head}</span>}
        <span className="max-w-full shrink-0 truncate">{tail}</span>
      </span>
    );
  }
);
Truncate.displayName = 'Truncate';
