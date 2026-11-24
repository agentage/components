import * as React from 'react';
import { cn } from '../lib/utils';
import { CARD_INTERACTIVE, CARD_SELECTED, cardSurface } from './card-base';
import {
  CardAnnounce,
  CardMeta,
  CardStateBody,
  type CardError,
  type CardMetaProps,
  type CardState,
} from './card-state';
import type { CardProps } from './card.parts';

export type { CardError, CardState } from './card-state';

export type CardVariant = 'default' | 'flat';

export { CardAction, CardDescription, CardHeader, CardTitle } from './card.parts';
export type { CardProps } from './card.parts';

export interface CardRootProps extends CardProps {
  /** @deprecated Every card is the one flat surface now; `flat` renders the same. */
  variant?: CardVariant;
  /** `sm` 12/14 padding (default), `md` 16/20 for a card that leads a page. */
  padding?: 'sm' | 'md';
  /** Hover border and a focus ring that follows a `[data-card-activator]` inside. */
  interactive?: boolean;
  selected?: boolean;
  /** Widget state: `loading`, `empty` and `error` swap the body of a direct CardContent child; `stale` badges the footer. */
  state?: CardState;
  /** Loading placeholder in the shape of the content; three skeleton lines by default. */
  skeleton?: React.ReactNode;
  /** Empty body; a compact EmptyState by default. */
  empty?: React.ReactNode;
  /** Error body: a message and an optional copyable reference. */
  error?: CardError | React.ReactNode;
  /** Shows Retry in the error body. */
  onRetry?: () => void;
  /** Reserved height, so switching state never moves the layout. */
  minHeight?: number | string;
  /** Card name in the polite state announcement ("Revenue: Loading"); the bare state by default. */
  announceLabel?: string;
}

interface StateSwap {
  state: CardState;
  skeleton?: React.ReactNode;
  empty?: React.ReactNode;
  error?: CardError | React.ReactNode;
  onRetry?: () => void;
}

// Server-safe on purpose: only the bodies below are client elements, the swap itself runs anywhere.
const swapState = (children: React.ReactNode, swap: StateSwap): React.ReactNode => {
  const { state, ...rest } = swap;
  const body =
    state === 'loading' || state === 'empty' || state === 'error' ? (
      <CardStateBody state={state} {...rest} />
    ) : null;
  let content = false;
  let footer = false;
  const out = React.Children.map(children, (child) => {
    if (!React.isValidElement<{ stale?: boolean; children?: React.ReactNode }>(child)) return child;
    if (child.type === CardContent && body) {
      content = true;
      return React.cloneElement(child, { children: body });
    }
    if (child.type === CardFooter && state === 'stale') {
      footer = true;
      return React.cloneElement(child, { stale: true });
    }
    return child;
  });
  return (
    <>
      {out}
      {body && !content && body}
      {state === 'stale' && !footer && <CardMeta stale />}
    </>
  );
};

export const Card = React.forwardRef<HTMLDivElement, CardRootProps>(
  (
    {
      className,
      children,
      variant = 'default',
      padding = 'sm',
      interactive = false,
      selected = false,
      state,
      skeleton,
      empty,
      error,
      onRetry,
      minHeight,
      announceLabel,
      style,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      data-slot="card"
      data-variant={variant}
      data-selected={selected || undefined}
      data-state={state}
      aria-busy={state === 'loading' || undefined}
      style={minHeight === undefined ? style : { minHeight, ...style }}
      className={cn(
        cardSurface({ padding }),
        interactive && CARD_INTERACTIVE,
        selected && CARD_SELECTED,
        className
      )}
      {...props}
    >
      {state === undefined
        ? children
        : swapState(children, { state, skeleton, empty, error, onRetry })}
      {state !== undefined && <CardAnnounce state={state} label={announceLabel} />}
    </div>
  )
);
Card.displayName = 'Card';

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} data-slot="card-content" className={cn('flex-1 text-ui', className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps extends Omit<CardProps, 'children'>, CardMetaProps {
  children?: React.ReactNode;
}

/** Footer; `source`, `updatedAt`, `stale` or `onRefresh` add the meta line. */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, source, updatedAt, stale, onRefresh, refreshing, ...props }, ref) => {
    const meta =
      source !== undefined || updatedAt !== undefined || stale || onRefresh !== undefined;
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn('flex flex-col items-start gap-1.5', className)}
        {...props}
      >
        {children}
        {meta && (
          <CardMeta
            source={source}
            updatedAt={updatedAt}
            stale={stale}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        )}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';
