import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const alertVariants = cva(
  'flex rounded-lg border [&>svg]:shrink-0 [&>svg]:size-4 [&>svg]:mt-0.5',
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-card-foreground',
        /** "Waiting for you": amber rule and tint, foreground text, accent title. */
        primary: 'border-primary/55 bg-primary/8 text-foreground',
        destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
        success: 'border-success/30 bg-success/10 text-success',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        info: 'border-info/30 bg-info/10 text-info',
      },
      density: {
        compact: 'gap-2.5 p-3 text-ui',
        comfortable: 'gap-3 p-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      density: 'compact',
    },
  }
);

const CloseIcon = (): React.JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export interface AlertProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    Omit<VariantProps<typeof alertVariants>, 'density'> {
  /**
   * Deprecated: The 12 px compact alert is the only look; `comfortable` is the pre-0.21 p-4.
   * @deprecated The 12 px compact alert is the only look; `comfortable` is the pre-0.21 p-4.
   */
  density?: 'compact' | 'comfortable' | null;
  icon?: React.ReactNode;
  /** Bold first line; accent-coloured in the primary variant. */
  title?: React.ReactNode;
  /** A row of buttons under the message, 8 px apart. */
  actions?: React.ReactNode;
  onClose?: () => void;
  closeLabel?: string;
}

/** Announces at once (`role="alert"`); pass `role="status"` or `role="note"` for a callout that is there on load. */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant,
      density,
      icon,
      title,
      actions,
      onClose,
      closeLabel = 'Dismiss',
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant, density, className }))}
      {...props}
    >
      {icon}
      <div className="min-w-0 flex-1">
        {title && (
          <div
            className={cn('mb-1 font-semibold', variant === 'primary' && 'text-primary-emphasis')}
            data-slot="alert-title"
          >
            {title}
          </div>
        )}
        {children}
        {actions && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2" data-slot="alert-actions">
            {actions}
          </div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'shrink-0 rounded-sm p-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer',
            'focus-ring'
          )}
          aria-label={closeLabel}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
);
Alert.displayName = 'Alert';
