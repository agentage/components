'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { useControlled } from '../lib/use-controlled';
import { ArrowUpIcon, StopIcon } from './chat.icons';

export interface PromptInputProps extends Omit<
  React.HTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'defaultValue' | 'children'
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Send: the Send button, or Enter (Shift+Enter adds a line). Uncontrolled text then clears. */
  onSubmit?: (value: string) => void;
  /** `running`: Send turns into Stop, and Enter does not send. Default `ready`. */
  status?: 'ready' | 'running';
  /** Called by the Stop button while `status` is `running`. */
  onStop?: () => void;
  placeholder?: string;
  /** Accessible name of the text field. Default "Message". */
  label?: string;
  /** Left of the footer, for example an attach button. */
  attach?: React.ReactNode;
  /** The footer line after `attach`, for example "Not sent yet". */
  footer?: React.ReactNode;
}

const SEND =
  'grid size-7 flex-none place-items-center rounded-lg transition-colors duration-fast focus-ring';

/** The chat composer: a text field that grows to 8 rows, an attach slot, a footer and Send. */
export const PromptInput = React.forwardRef<HTMLFormElement, PromptInputProps>(
  (
    {
      value: valueProp,
      defaultValue = '',
      onValueChange,
      onSubmit,
      status = 'ready',
      onStop,
      placeholder,
      label = 'Message',
      attach,
      footer,
      className,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControlled(valueProp, defaultValue, onValueChange);
    const running = status === 'running';
    const canSend = !running && value.trim() !== '';

    const send = (): void => {
      if (!canSend) return;
      onSubmit?.(value);
      if (valueProp === undefined) setValue('');
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
      e.preventDefault();
      send();
    };

    return (
      <form
        ref={ref}
        className={cn(
          'flex flex-col rounded-lg border border-border bg-background focus-within:border-muted-foreground',
          className
        )}
        data-slot="prompt-input"
        data-status={status}
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        {...props}
      >
        <textarea
          aria-label={label}
          placeholder={placeholder}
          value={value}
          rows={1}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="block max-h-[calc(8lh+8px)] min-h-[calc(1lh+8px)] w-full resize-none overflow-auto border-0 bg-transparent px-2.5 pt-2 text-ui leading-normal text-foreground outline-none [field-sizing:content] placeholder:text-muted-foreground"
          data-slot="prompt-input-textarea"
        />
        <div className="flex h-9 items-center gap-1.5 px-1" data-slot="prompt-input-footer">
          {attach}
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{footer}</span>
          {running ? (
            <button
              type="button"
              aria-label="Stop"
              onClick={onStop}
              className={cn(SEND, 'bg-accent text-foreground hover:bg-border')}
            >
              <StopIcon />
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Send"
              disabled={!canSend}
              className={cn(
                SEND,
                'bg-primary text-primary-foreground hover:bg-primary-hover disabled:cursor-default disabled:bg-accent disabled:text-muted-foreground'
              )}
            >
              <ArrowUpIcon />
            </button>
          )}
        </div>
      </form>
    );
  }
);
PromptInput.displayName = 'PromptInput';
