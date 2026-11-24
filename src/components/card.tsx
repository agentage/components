import * as React from 'react';
import { cn } from '../lib/utils';
import { CARD_INTERACTIVE, CARD_SELECTED, cardSurface } from './card-base';
import {
  CardAnnounce,
  CardMeta,
  CardStateBody,
  type CardFallback,
  type CardState,
} from './card-state';
import { CardTitle, type CardProps } from './card.parts';

export type { CardError, CardFallback, CardMetaProps, CardState } from './card-state';
export { CardMeta } from './card-state';
export { CardAction, CardDescription, CardHeader, CardTitle } from './card.parts';
export type { CardProps } from './card.parts';

export interface CardRootProps extends CardProps {
  /** `sm` 12/14 padding (default), `md` 16/20 for a card that leads a page. */
  padding?: 'sm' | 'md';
  /** Hover border and a focus ring that follows a `[data-card-activator]` inside. */
  interactive?: boolean;
  selected?: boolean;
  /** `loading`, `empty` and `error` swap the body of a direct CardContent child; `stale` badges the footer. */
  state?: CardState;
  /** Bodies for those states: loading placeholder, empty body, error with Retry. */
  fallback?: CardFallback;
  /** Reserved height, so switching state never moves the layout. */
  minHeight?: number | string;
}

type Child = React.ReactElement<{ children?: React.ReactNode }>;
const isEl = (c: React.ReactNode): c is Child => React.isValidElement(c);

/** Plain-text CardTitle inside a CardHeader child: the name in the state announcement. */
const titleOf = (children: React.ReactNode): string | undefined => {
  for (const child of React.Children.toArray(children)) {
    if (!isEl(child)) continue;
    if (child.type === CardTitle && typeof child.props.children === 'string')
      return child.props.children;
    const inner = titleOf(child.props.children);
    if (inner) return inner;
  }
  return undefined;
};

const staleFooter = (footer: Child): Child => {
  let meta = false;
  const inner = React.Children.map(footer.props.children, (c) => {
    if (!isEl(c) || c.type !== CardMeta) return c;
    meta = true;
    return React.cloneElement(c as React.ReactElement<{ stale?: boolean }>, { stale: true });
  });
  return React.cloneElement(footer, {}, inner, meta ? null : <CardMeta stale />);
};

// Server-safe on purpose: only the bodies below are client elements, the swap itself runs anywhere.
const swapState = (children: React.ReactNode, state: CardState, fallback?: CardFallback) => {
  const body =
    state === 'loading' || state === 'empty' || state === 'error' ? (
      <CardStateBody state={state} fallback={fallback} />
    ) : null;
  let content = false;
  let footer = false;
  const out = React.Children.map(children, (child) => {
    if (!isEl(child)) return child;
    if (child.type === CardContent && body) {
      content = true;
      return React.cloneElement(child, { children: body });
    }
    if (child.type === CardFooter && state === 'stale') {
      footer = true;
      return staleFooter(child);
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
      padding = 'sm',
      interactive = false,
      selected = false,
      state,
      fallback,
      minHeight,
      style,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      data-slot="card"
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
      {state === undefined ? children : swapState(children, state, fallback)}
      {state !== undefined && <CardAnnounce state={state} label={titleOf(children)} />}
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

/** Bottom row; put a `CardMeta` inside for source, last update, stale and refresh. */
export const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn('flex flex-col items-start gap-1.5', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';
