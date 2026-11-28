import * as React from 'react';
import { cn } from '../lib/utils';

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `user`: a bubble on the right. `assistant` (default): flat text across the column. */
  from?: 'user' | 'assistant';
  /** A row of small icon buttons under the message, for example Copy and Retry. */
  actions?: React.ReactNode;
}

/** One turn in a conversation. The body is any content: text, Markdown, tool calls. */
export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ from = 'assistant', actions, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 flex-col gap-1 text-ui leading-normal [overflow-wrap:anywhere]',
        from === 'user' && 'items-end',
        className
      )}
      data-slot="message"
      data-from={from}
      {...props}
    >
      <div
        className={cn(
          'flex min-w-0 flex-col gap-3',
          from === 'user'
            ? 'max-w-[85%] rounded-lg bg-accent px-2.5 py-2 text-accent-foreground'
            : 'w-full text-foreground'
        )}
        data-slot="message-body"
      >
        {children}
      </div>
      {actions && (
        <div className="-ml-1 flex items-center gap-0.5" data-slot="message-actions">
          {actions}
        </div>
      )}
    </div>
  )
);
Message.displayName = 'Message';
