'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { ChevronDownIcon } from './chat.icons';

/** Distance from the end, in px, that still counts as "at the bottom". */
const STICK = 24;

export interface ConversationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Name of the message log for assistive tech. Default "Conversation". */
  label?: string;
  /** Name of the button that jumps to the newest message. Default "Scroll to the latest message". */
  scrollLabel?: string;
}

const atEnd = (el: HTMLElement): boolean =>
  el.scrollHeight - el.scrollTop - el.clientHeight <= STICK;

/**
 * The message column. It stays pinned to the newest content while the reader is at the bottom;
 * once they scroll up it holds still and shows a scroll-to-latest button.
 */
export const Conversation = React.forwardRef<HTMLDivElement, ConversationProps>(
  (
    {
      label = 'Conversation',
      scrollLabel = 'Scroll to the latest message',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const scroller = React.useRef<HTMLDivElement>(null);
    const column = React.useRef<HTMLDivElement>(null);
    const follow = React.useRef(true);
    const [away, setAway] = React.useState(false);

    const toEnd = React.useCallback((smooth: boolean) => {
      const el = scroller.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    }, []);

    React.useLayoutEffect(() => {
      const col = column.current;
      if (!col || typeof ResizeObserver === 'undefined') return;
      // New or growing content: keep the end in view only while the reader is following.
      const ro = new ResizeObserver(() => {
        if (follow.current) toEnd(false);
        else if (scroller.current) setAway(!atEnd(scroller.current));
      });
      ro.observe(col);
      return () => ro.disconnect();
    }, [toEnd]);

    const onScroll = (): void => {
      const el = scroller.current;
      if (!el) return;
      follow.current = atEnd(el);
      setAway(!follow.current);
    };

    return (
      <div
        ref={ref}
        className={cn('relative min-h-0 flex-1', className)}
        data-slot="conversation"
        {...props}
      >
        <div
          ref={scroller}
          role="log"
          aria-label={label}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          onScroll={onScroll}
          className="absolute inset-0 overflow-auto overscroll-contain [scrollbar-gutter:stable] focus-ring"
          data-slot="conversation-scroller"
        >
          <div
            ref={column}
            className="mx-auto flex max-w-[760px] flex-col gap-3 px-3.5 pb-6 pt-4"
            data-slot="conversation-column"
          >
            {children}
          </div>
        </div>
        <button
          type="button"
          aria-label={scrollLabel}
          aria-hidden={!away || undefined}
          tabIndex={away ? 0 : -1}
          onClick={() => {
            follow.current = true;
            setAway(false);
            toEnd(true);
          }}
          className={cn(
            'absolute bottom-2.5 right-[18px] grid size-7 place-items-center rounded-full border border-border bg-accent text-foreground shadow-popover transition-opacity duration-fast focus-ring',
            away ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
          data-slot="conversation-scroll-button"
        >
          <ChevronDownIcon />
        </button>
      </div>
    );
  }
);
Conversation.displayName = 'Conversation';
