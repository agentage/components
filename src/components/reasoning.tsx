'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { useControlled } from '../lib/use-controlled';
import { BulbIcon } from './chat.icons';
import { Disclosure } from './disclosure';
import { ToolRow } from './tool-call.parts';

export interface ReasoningProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Seconds spent so far, or in total once done. */
  seconds: number;
  /** `running` reads "Thinking N s", `done` (default) "Thought for N s". */
  status?: 'running' | 'done';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** One 28 px line for the model's thinking time; `children` is the optional thought text. */
export const Reasoning = React.forwardRef<HTMLDivElement, ReasoningProps>(
  (
    {
      seconds,
      status = 'done',
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useControlled(openProp, defaultOpen, onOpenChange);
    const bodyId = React.useId();
    const hasBody = children != null && children !== '';
    const s = String(Math.round(seconds));
    return (
      <div ref={ref} className={cn('min-w-0', className)} data-slot="reasoning" {...props}>
        <ToolRow
          glyph={
            <span className="text-muted-foreground">
              <BulbIcon />
            </span>
          }
          nested
          open={hasBody ? open : undefined}
          aria-controls={hasBody ? bodyId : undefined}
          onClick={() => setOpen(!open)}
          className="pl-0.5"
        >
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-ui',
              status === 'done' ? 'text-muted-foreground' : 'text-foreground'
            )}
          >
            {status === 'running' ? `Thinking ${s} s` : `Thought for ${s} s`}
          </span>
        </ToolRow>
        {hasBody && (
          <Disclosure open={open} id={bodyId} shrink>
            <div className="mb-0.5 ml-2 mt-0.5 border-l-2 border-border py-0.5 pl-3 text-ui leading-[1.55] text-muted-foreground">
              {children}
            </div>
          </Disclosure>
        )}
      </div>
    );
  }
);
Reasoning.displayName = 'Reasoning';
