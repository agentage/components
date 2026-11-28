'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { useControlled } from '../lib/use-controlled';
import { Disclosure } from './disclosure';
import { StatusMark, ToolGroupContext, ToolRow } from './tool-call.parts';

export interface ToolGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** `running` reads "Step N of M", `succeeded` "Completed N steps", `failed` "Stopped at step N". */
  status: 'running' | 'succeeded' | 'failed';
  /** M in "Step N of M": the planned number of steps. Default: the number of calls so far. */
  total?: number;
  /** For example "3.1 s". */
  duration?: React.ReactNode;
  /** Replaces the counted title. */
  label?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const lastName = (children: React.ReactNode): string | undefined => {
  const calls = React.Children.toArray(children).filter(React.isValidElement);
  const props = calls.at(-1)?.props as { name?: unknown } | undefined;
  return typeof props?.name === 'string' ? props.name : undefined;
};

/** A run of ToolCall steps folded under one 32 px row; open it to see each call. */
export const ToolGroup = React.forwardRef<HTMLDivElement, ToolGroupProps>(
  (
    {
      status,
      total,
      duration,
      label,
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
    const count = React.Children.toArray(children).filter(React.isValidElement).length;
    const title =
      label ??
      (status === 'running'
        ? `Step ${String(count)} of ${String(Math.max(total ?? count, count))}`
        : status === 'failed'
          ? `Stopped at step ${String(count)}`
          : `Completed ${String(count)} ${count === 1 ? 'step' : 'steps'}`);
    const current = status === 'running' ? lastName(children) : undefined;
    return (
      <div
        ref={ref}
        className={cn('min-w-0 rounded-lg border border-border bg-background', className)}
        data-slot="tool-group"
        data-status={status}
        {...props}
      >
        <ToolRow
          glyph={<StatusMark status={status} />}
          duration={duration}
          open={open}
          aria-controls={bodyId}
          onClick={() => setOpen(!open)}
        >
          <span className="flex-none whitespace-nowrap text-xs text-foreground">{title}</span>
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
            {current}
          </span>
        </ToolRow>
        <Disclosure open={open} id={bodyId} shrink>
          <div className="border-t border-border py-1" data-slot="tool-group-body">
            <ToolGroupContext.Provider value={true}>{children}</ToolGroupContext.Provider>
          </div>
        </Disclosure>
      </div>
    );
  }
);
ToolGroup.displayName = 'ToolGroup';
