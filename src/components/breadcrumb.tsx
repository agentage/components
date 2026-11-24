import * as React from 'react';
import { cn } from '../lib/utils';

const ChevronIcon = (): React.JSX.Element => (
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
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** path: monospace segments with slash separators that scroll sideways without a scrollbar. */
  variant?: 'default' | 'path';
}

// The variant rides on a CSS group, so the parts stay server components with no context.
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn('group/crumb min-w-0', className)}
      data-slot="breadcrumb"
      data-variant={variant}
      {...props}
    />
  )
);
Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      'flex items-center gap-1.5 text-ui text-muted-foreground',
      'group-data-[variant=path]/crumb:gap-0.5 group-data-[variant=path]/crumb:overflow-x-auto group-data-[variant=path]/crumb:whitespace-nowrap group-data-[variant=path]/crumb:font-mono group-data-[variant=path]/crumb:[scrollbar-width:none] group-data-[variant=path]/crumb:[&::-webkit-scrollbar]:hidden',
      className
    )}
    data-slot="breadcrumb-list"
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn('inline-flex shrink-0 items-center gap-1.5', className)}
      data-slot="breadcrumb-item"
      {...props}
    />
  )
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      'rounded-md transition-colors hover:text-foreground',
      'focus-ring',
      'group-data-[variant=path]/crumb:inline-flex group-data-[variant=path]/crumb:h-7 group-data-[variant=path]/crumb:items-center group-data-[variant=path]/crumb:px-1.5 group-data-[variant=path]/crumb:hover:bg-accent',
      className
    )}
    data-slot="breadcrumb-link"
    {...props}
  >
    {children}
  </a>
));
BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn(
      'font-medium text-foreground',
      'group-data-[variant=path]/crumb:px-1.5 group-data-[variant=path]/crumb:font-normal',
      className
    )}
    data-slot="breadcrumb-page"
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

export const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, children, ...props }, ref) => (
  <li
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn(
      'shrink-0 text-muted-foreground group-data-[variant=path]/crumb:opacity-60',
      className
    )}
    data-slot="breadcrumb-separator"
    {...props}
  >
    {children ?? (
      <>
        <span className="inline-flex group-data-[variant=path]/crumb:hidden">
          <ChevronIcon />
        </span>
        <span className="hidden group-data-[variant=path]/crumb:inline">/</span>
      </>
    )}
  </li>
));
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
