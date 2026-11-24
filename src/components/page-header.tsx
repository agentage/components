import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const pageHeaderActionVariants = cva(
  [
    'inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-ui font-medium transition-colors',
    'focus-ring',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:bg-accent hover:text-foreground',
        success: 'text-success hover:bg-accent',
        warning: 'text-warning hover:bg-accent',
        destructive: 'text-destructive hover:bg-accent',
        info: 'text-info hover:bg-accent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const pageHeaderVariants = cva('', {
  variants: {
    variant: {
      /** One 48 px bar: small icon box, 14/600 title, actions on the right. */
      bar: 'flex h-12 items-center justify-between gap-3',
      /** Detail header: 20/700 title, a muted description, a meta line and a tabs slot. */
      detail: 'flex flex-col pt-4',
    },
  },
  defaultVariants: { variant: 'bar' },
});

export interface PageHeaderAction {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  variant?: NonNullable<VariantProps<typeof pageHeaderActionVariants>['variant']>;
}

export interface PageHeaderProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'title'>,
    VariantProps<typeof pageHeaderVariants> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** One muted line under the title (two lines in the detail variant). */
  description?: React.ReactNode;
  /** Detail variant: a 12 px fact line under the description, usually `MetaItem`s; wraps between items. */
  meta?: React.ReactNode;
  /** Detail variant: a tab list docked at the bottom of the header. */
  tabs?: React.ReactNode;
  actions?: PageHeaderAction[];
}

const Actions = ({ actions, children }: Pick<PageHeaderProps, 'actions' | 'children'>) => (
  <div className="flex shrink-0 items-center gap-1.5">
    {actions?.map((action) => (
      <button
        key={action.title}
        type="button"
        onClick={action.onClick}
        disabled={action.disabled}
        title={action.title}
        className={cn(pageHeaderActionVariants({ variant: action.variant }))}
      >
        <span aria-hidden="true" className="[&_svg]:size-3.5">
          {action.icon}
        </span>
        {action.title}
      </button>
    ))}
    {children}
  </div>
);

const IconBox = ({ icon, large = false }: { icon: React.ReactNode; large?: boolean }) => (
  <div
    aria-hidden="true"
    className={cn(
      'flex shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary-emphasis',
      large ? 'size-7 [&_svg]:size-3.5' : 'size-6 [&_svg]:size-3.5'
    )}
  >
    {icon}
  </div>
);

export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  (
    { icon, title, description, meta, tabs, actions, variant, children, className, ...props },
    ref
  ) => {
    const detail = variant === 'detail';
    return (
      <header
        ref={ref}
        className={cn(pageHeaderVariants({ variant }), className)}
        data-slot="page-header"
        data-variant={detail ? 'detail' : 'bar'}
        {...props}
      >
        {detail ? (
          <>
            <div className="flex h-[30px] min-w-0 items-center gap-2.5">
              {icon && <IconBox icon={icon} large />}
              <h1 className="min-w-0 truncate text-xl font-bold leading-[26px] text-foreground">
                {title}
              </h1>
              <div className="ml-auto flex shrink-0 items-center">
                <Actions actions={actions}>{children}</Actions>
              </div>
            </div>
            {description && (
              <p className="mt-1 line-clamp-2 max-w-[760px] text-ui leading-5 text-muted-foreground">
                {description}
              </p>
            )}
            {meta && (
              <div
                className="mt-1.5 flex min-h-6 min-w-0 flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-muted-foreground"
                data-slot="page-header-meta"
              >
                {meta}
              </div>
            )}
            {tabs && <div className="mt-2">{tabs}</div>}
          </>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-2.5">
              {icon && <IconBox icon={icon} />}
              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold text-foreground">{title}</h1>
                {description && (
                  <p className="truncate text-xs text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
            <Actions actions={actions}>{children}</Actions>
          </>
        )}
      </header>
    );
  }
);
PageHeader.displayName = 'PageHeader';

export interface MetaItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Quiet lead word, for example "Lead" or "Target". */
  label?: React.ReactNode;
}

/** One fact of the PageHeader `meta` line: an optional muted label, then the value, 6 px apart. */
export const MetaItem = React.forwardRef<HTMLSpanElement, MetaItemProps>(
  ({ label, className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap', className)}
      data-slot="meta-item"
      {...props}
    >
      {label !== undefined && <span>{label}</span>}
      {children !== undefined && (
        <span className="inline-flex items-center gap-1.5 text-foreground">{children}</span>
      )}
    </span>
  )
);
MetaItem.displayName = 'MetaItem';
