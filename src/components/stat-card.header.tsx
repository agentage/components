import * as React from 'react';
import { cn } from '../lib/utils';
import { Badge } from './badge';

// Interactive content in a slot stays clickable above the stretched title button.
export const RAISE = '[&_a]:relative [&_a]:z-10 [&_button]:relative [&_button]:z-10';

/** When pressable, ARIA props and tabIndex belong to the one control, not the frame. */
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
  title: string;
  trend?: React.ReactNode;
  control: Record<string, unknown> | null;
  titleId: string;
  /** Stale badge for a card with no meta line. */
  stale?: boolean;
}

/** Icon, title (the stretched control when pressable), stale badge and trend. */
export const StatHeader = ({ icon, title, trend, control, titleId, stale }: StatHeaderProps) => (
  <div className="flex h-6 items-center justify-between gap-2">
    <div className="flex min-w-0 items-center gap-2">
      {icon && (
        <span className="flex shrink-0 items-center [&_svg]:size-3.5" data-slot="stat-card-icon">
          {icon}
        </span>
      )}
      {React.createElement(
        control ? 'button' : 'div',
        {
          id: titleId,
          className: cn(
            'truncate text-xs text-muted-foreground',
            // The stretched title is the one control, so a footer link is not nested in it.
            control && 'min-w-0 text-left outline-none after:absolute after:inset-0'
          ),
          ...(control ? { ...control, type: 'button', 'data-card-activator': '' } : {}),
        },
        title
      )}
    </div>
    {(trend || stale) && (
      <div className={cn('flex shrink-0 items-center gap-1.5', RAISE)}>
        {stale && (
          <Badge variant="outline-muted" data-slot="card-stale">
            Stale
          </Badge>
        )}
        {trend}
      </div>
    )}
  </div>
);
