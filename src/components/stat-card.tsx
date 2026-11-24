import * as React from 'react';
import { cn } from '../lib/utils';
import { CardAnnounce, CardMeta } from './card-state';
import { Progress } from './progress';
import { CONTAINER, Comparison, Facts, StatSkeleton, ValueRow } from './stat-card.body';
import { statCardVariants, Trend } from './stat-card.parts';
import type { StatCardProps } from './stat-card.types';
import { StatStateBody } from './stat-card.state';
import { RAISE, splitControlProps, StatHeader } from './stat-card.header';

export {
  statCardTrendVariants,
  statCardVariants,
  TREND_TONE,
  type StatCardSentiment,
  type StatCardTrend,
  type TrendTone,
} from './stat-card.parts';
export type { StatCardComparison, StatCardFact } from './stat-card.body';
export type { StatCardProps } from './stat-card.types';

const FOOTER = 'flex items-center justify-between gap-2 text-xs text-muted-foreground';

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      icon,
      iconColor,
      title,
      value,
      trend,
      indicator,
      period,
      description,
      comparison,
      chart,
      chartLabel,
      facts,
      breakdown,
      history,
      footer,
      progress,
      progressLabel,
      state,
      skeleton,
      empty,
      error,
      onRetry,
      source,
      updatedAt,
      stale,
      onRefresh,
      refreshing,
      pressable = false,
      density = 'compact',
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const compact = density === 'compact';
    const uid = React.useId();
    const { control, root } = splitControlProps(props, pressable);
    const covered = state === 'loading' || state === 'empty' || state === 'error';
    // Covered parts are hidden, so the state body is the description then.
    const describedBy =
      (control['aria-describedby'] as string | undefined) ??
      (covered
        ? `${uid}-state`
        : [`${uid}-value`, comparison && `${uid}-cmp`, description && `${uid}-desc`]
            .filter(Boolean)
            .join(' '));
    const isStale = state === 'stale' || !!stale;
    const metaOwn = source !== undefined || updatedAt !== undefined || !!onRefresh;
    // Without a footer the stale badge sits in the header, so the card keeps its height.
    const staleInHeader = isStale && !footer && !metaOwn;
    const meta = metaOwn || (isStale && !staleInHeader);
    const reflows = !!chart || !!facts?.length;

    const middle = (
      <>
        <div className={compact ? 'space-y-1' : 'space-y-2'}>
          <ValueRow
            value={
              <div
                id={`${uid}-value`}
                className={cn(
                  'font-semibold tabular-nums text-foreground',
                  compact ? 'text-xl leading-7' : 'text-2xl'
                )}
              >
                {value}
              </div>
            }
            comparison={
              comparison && <Comparison id={`${uid}-cmp`} comparison={comparison} trend={trend} />
            }
            chart={chart}
            chartLabel={chartLabel}
          />
          {description && (
            <div id={`${uid}-desc`} className="text-xs text-muted-foreground">
              {description}
            </div>
          )}
        </div>
        {facts && facts.length > 0 && <Facts facts={facts} />}
        {breakdown && <Progress segments={breakdown} legend />}
        {progress != null && (
          <div className={compact ? undefined : 'mt-4'} data-slot="stat-card-progress">
            <Progress value={progress} label={progressLabel ?? title} />
          </div>
        )}
        {history && (
          <div className={RAISE} data-slot="stat-card-history">
            {history}
          </div>
        )}
      </>
    );

    const shape = {
      chart: !!chart,
      comparison: !!comparison,
      description: !!description,
      facts: facts?.length ?? 0,
      breakdown: !!breakdown,
      progress: progress != null,
      history: !!history,
    };

    return (
      <div
        ref={ref}
        className={cn(statCardVariants({ pressable, density }), className)}
        data-slot="stat-card"
        data-pressable={pressable ? '' : undefined}
        data-state={state}
        aria-busy={state === 'loading' || undefined}
        {...(pressable
          ? {}
          : { role: 'group', 'aria-labelledby': `${uid}-title`, 'aria-describedby': describedBy })}
        {...root}
        {...(pressable ? {} : { onClick })}
      >
        <StatHeader
          {...{ icon, iconColor, title, period, indicator, pressable, compact, control, onClick }}
          describedBy={describedBy}
          titleId={`${uid}-title`}
          stale={staleInHeader}
          trend={trend && !covered && <Trend trend={trend} compact={compact} />}
        />
        {covered ? (
          // The real parts stay in flow, hidden, so a covered card keeps its ready height.
          <div className={cn('grid flex-1 [&>*]:col-start-1 [&>*]:row-start-1', CONTAINER)}>
            <div className="invisible flex flex-col gap-2" aria-hidden="true">
              {middle}
            </div>
            <div id={`${uid}-state`} data-slot="stat-card-state">
              {state === 'loading' ? (
                (skeleton ?? <StatSkeleton shape={shape} />)
              ) : (
                <StatStateBody state={state} empty={empty} error={error} onRetry={onRetry} />
              )}
            </div>
          </div>
        ) : reflows ? (
          <div className={cn('flex flex-col gap-2', CONTAINER)}>{middle}</div>
        ) : (
          middle
        )}
        {(footer || meta) && (
          <div
            className={cn(
              'mt-auto border-t border-border pt-2',
              meta ? 'flex flex-col gap-1' : FOOTER,
              RAISE,
              !compact && 'mt-4'
            )}
            data-slot="stat-card-footer"
          >
            {footer && meta ? <div className={FOOTER}>{footer}</div> : footer}
            {meta && (
              <CardMeta
                source={source}
                updatedAt={updatedAt}
                stale={isStale}
                onRefresh={onRefresh}
                refreshing={refreshing}
              />
            )}
          </div>
        )}
        {state !== undefined && <CardAnnounce state={state} label={title} />}
      </div>
    );
  }
);
StatCard.displayName = 'StatCard';
