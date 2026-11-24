import * as React from 'react';
import { cn } from '../lib/utils';
import { Badge } from './badge';

// Interactive content in a slot stays clickable above the stretched title button.
export const RAISE = '[&_a]:relative [&_a]:z-10 [&_button]:relative [&_button]:z-10';

/** With `pressable`, ARIA props and tabIndex belong to the one control, not the frame. */
export const splitControlProps = (props: Record<string, unknown>, pressable: boolean) => {
  if (!pressable) return { control: {} as Record<string, unknown>, root: props };
  const control: Record<string, unknown> = {};
  const root: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props))
    (k.startsWith('aria-') || k === 'tabIndex' ? control : root)[k] = v;
  return { control, root };
};

export interface StatHeaderProps {
  icon?: React.ReactNode;
  iconColor?: string;
  title: string;
  period?: React.ReactNode;
  indicator?: React.ReactNode;
  trend?: React.ReactNode;
  pressable: boolean;
  compact: boolean;
  control: Record<string, unknown>;
  describedBy: string;
  titleId: string;
  /** Stale badge for a card with no footer. */
  stale?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/** Icon, title (the stretched control when pressable), period, indicator and trend. */
export const StatHeader = ({
  icon,
  iconColor,
  title,
  period,
  indicator,
  trend,
  pressable,
  compact,
  control,
  describedBy,
  titleId,
  stale,
  onClick,
}: StatHeaderProps) => (
  <div className={cn('flex items-center justify-between gap-2', compact ? 'h-6' : 'mb-4')}>
    <div className={cn('flex min-w-0 items-center', compact ? 'gap-2' : 'gap-3')}>
      {icon && (
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-md',
            compact ? 'size-6 [&_svg]:size-3.5' : 'size-8 [&_svg]:size-4',
            iconColor ?? 'bg-primary-soft text-primary-emphasis'
          )}
        >
          {icon}
        </div>
      )}
      {React.createElement(
        pressable ? 'button' : 'div',
        {
          id: titleId,
          className: cn(
            'text-muted-foreground',
            compact ? 'truncate text-xs' : 'text-2xs font-medium uppercase tracking-[0.04em]',
            // The stretched title is the one control, so a footer link is not nested in it.
            pressable && 'min-w-0 text-left outline-none after:absolute after:inset-0'
          ),
          ...(pressable
            ? {
                ...control,
                type: 'button',
                onClick,
                'aria-describedby': describedBy,
                'data-card-activator': '',
              }
            : {}),
        },
        title
      )}
    </div>
    {(period || indicator || trend || stale) && (
      <div className={cn('flex shrink-0 items-center gap-1.5', RAISE)}>
        {period && (
          <span className="text-xs text-muted-foreground" data-slot="stat-card-period">
            {period}
          </span>
        )}
        {stale && (
          <Badge variant="outline-muted" data-slot="card-stale">
            Stale
          </Badge>
        )}
        {indicator}
        {trend}
      </div>
    )}
  </div>
);
