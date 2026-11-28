'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { useControlled } from '../lib/use-controlled';
import { Disclosure } from './disclosure';
import {
  Payload,
  StatusMark,
  ToolGroupContext,
  ToolName,
  ToolRow,
  type ToolCallStatus,
} from './tool-call.parts';

export type { ToolCallStatus } from './tool-call.parts';

export interface ToolCallProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The tool, as `server.tool`; the server prefix is dimmed. */
  name: string;
  /** One line after the name, for example the main argument or the error. */
  summary?: React.ReactNode;
  status: ToolCallStatus;
  /** For example "1.7 s". */
  duration?: React.ReactNode;
  /** Arguments: an object is shown as highlighted JSON, a string as is. */
  input?: unknown;
  /** Result, or the error text when `status` is `failed`. */
  output?: unknown;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * One tool call: a 32 px row (status, name, summary, duration) that opens its input and output.
 * `children` go between input and output, for example an ApprovalBar while `status` is `waiting`.
 */
export const ToolCall = React.forwardRef<HTMLDivElement, ToolCallProps>(
  (
    {
      name,
      summary,
      status,
      duration,
      input,
      output,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const nested = React.useContext(ToolGroupContext);
    const [open, setOpen] = useControlled(openProp, defaultOpen, onOpenChange);
    const bodyId = React.useId();
    const hasBody = input !== undefined || output !== undefined || children != null;
    const failed = status === 'failed';
    return (
      <div
        ref={ref}
        className={cn(
          'min-w-0',
          !nested && 'rounded-lg border border-border bg-background',
          !nested && status === 'waiting' && 'border-primary/60',
          className
        )}
        data-slot="tool-call"
        data-status={status}
        {...props}
      >
        <ToolRow
          glyph={<StatusMark status={status} />}
          duration={duration}
          nested={nested}
          open={hasBody ? open : undefined}
          aria-controls={hasBody ? bodyId : undefined}
          onClick={() => setOpen(!open)}
        >
          <ToolName name={name} />
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-xs',
              failed ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {summary}
          </span>
        </ToolRow>
        {hasBody && (
          <Disclosure open={open} id={bodyId} shrink>
            <div
              className={cn(
                'flex flex-col gap-1.5 px-2.5 pb-2.5 pt-2',
                !nested && 'border-t border-border'
              )}
              data-slot="tool-call-body"
            >
              {input !== undefined && <Payload label="Input" value={input} />}
              {children}
              {output !== undefined && (
                <Payload label={failed ? 'Error' : 'Output'} value={output} error={failed} />
              )}
            </div>
          </Disclosure>
        )}
      </div>
    );
  }
);
ToolCall.displayName = 'ToolCall';
