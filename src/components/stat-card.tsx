import * as React from 'react';
import { cn } from '../lib/utils';
import { CardAnnounce, CardMeta } from './card-state';
import { RAISE, splitControlProps, StatHeader } from './stat-card.header';
import { STAT_CARD, STAT_CARD_PRESSABLE, Trend } from './stat-card.parts';
import { StatStateBody } from './stat-card.state';
import type { StatCardProps } from './stat-card.types';

export type { StatCardProps, StatCardSentiment, StatCardTrend } from './stat-card.types';

const FOOTER = 'flex items-center justify-between gap-2 text-xs text-muted-foreground';
type MetaEl = React.ReactElement<{ stale?: boolean }>;
// A size container only with children, so a bare card sizes to its content as before.
const CONTAINER = '@container';

/** The footer with its CardMeta marked stale; null when the footer carries no CardMeta. */
const staleMeta = (footer: React.ReactNode): React.ReactNode | null => {
  if (!React.isValidElement(footer)) return null;
  if (footer.type === CardMeta) return React.cloneElement(footer as MetaEl, { stale: true });
  return null;
};

/**
 * A key number: title, value, an optional trend and one muted hint line. Anything else
 * (a Sparkline, facts, a breakdown, a history strip) goes in `children` under the value.
 */
export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      icon,
      title,
      value,
      trend,
      hint,
      state,
      fallback,
      footer,
      className,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const uid = React.useId();
    const pressable = onClick !== undefined;
    const { control, root } = splitControlProps(props, pressable);
    const covered = state === 'loading' || state === 'empty' || state === 'error';
    // Covered parts are hidden, so the state body is the description then.
    const describedBy =
      (control['aria-describedby'] as string | undefined) ??
      (covered
        ? `${uid}-state`
        : [`${uid}-value`, hint && `${uid}-hint`].filter(Boolean).join(' '));
    const stale = state === 'stale';
    const marked = stale ? staleMeta(footer) : null;

    const middle = (
      <>
        <div className="space-y-1">
          <div
            id={`${uid}-value`}
            className="text-xl leading-7 font-semibold tabular-nums text-foreground"
          >
            {value}
          </div>
          {hint && (
            <div
              id={`${uid}-hint`}
              className="text-xs text-muted-foreground"
              data-slot="stat-card-hint"
            >
              {hint}
            </div>
          )}
        </div>
        {children}
      </>
    );

    return (
      <div
        ref={ref}
        className={cn(STAT_CARD, pressable && STAT_CARD_PRESSABLE, className)}
        data-slot="stat-card"
        data-pressable={pressable ? '' : undefined}
        data-state={state}
        aria-busy={state === 'loading' || undefined}
        {...(pressable
          ? {}
          : { role: 'group', 'aria-labelledby': `${uid}-title`, 'aria-describedby': describedBy })}
        {...root}
      >
        <StatHeader
          icon={icon}
          title={title}
          titleId={`${uid}-title`}
          control={pressable ? { ...control, onClick, 'aria-describedby': describedBy } : null}
          stale={stale && !marked}
          trend={trend && !covered && <Trend trend={trend} />}
        />
        {covered ? (
          // The real parts stay in flow, hidden, so a covered card keeps its ready height.
          <div
            className={cn('grid flex-1 [&>*]:col-start-1 [&>*]:row-start-1', children && CONTAINER)}
          >
            <div className="invisible flex flex-col gap-2" aria-hidden="true">
              {middle}
            </div>
            <div id={`${uid}-state`} data-slot="stat-card-state">
              <StatStateBody state={state} fallback={fallback} hint={!!hint} />
            </div>
          </div>
        ) : (
          <div className={cn('flex flex-col gap-2', children && CONTAINER, RAISE)}>{middle}</div>
        )}
        {footer && (
          <div
            className={cn('mt-auto border-t border-border pt-2', RAISE)}
            data-slot="stat-card-footer"
          >
            {marked ??
              (React.isValidElement(footer) && footer.type === CardMeta ? (
                footer
              ) : (
                <div className={FOOTER}>{footer}</div>
              ))}
          </div>
        )}
        {state !== undefined && <CardAnnounce state={state} label={title} />}
      </div>
    );
  }
);
StatCard.displayName = 'StatCard';
