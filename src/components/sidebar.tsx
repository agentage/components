import * as React from 'react';
import { cn } from '../lib/utils';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  width?: string;
  /** Accessible name for the complementary landmark; unset by default. */
  'aria-label'?: string;
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, width = 'w-60', children, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        'flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        width,
        className
      )}
      data-slot="sidebar"
      {...props}
    >
      {children}
    </aside>
  )
);
Sidebar.displayName = 'Sidebar';

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex min-h-12 shrink-0 items-center gap-2 border-b border-sidebar-border px-4 py-2',
        className
      )}
      data-slot="sidebar-header"
      {...props}
    />
  )
);
SidebarHeader.displayName = 'SidebarHeader';

export type SidebarContentProps = React.HTMLAttributes<HTMLElement>;

export const SidebarContent = React.forwardRef<HTMLElement, SidebarContentProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn('flex-1 overflow-y-auto py-1', className)}
      data-slot="sidebar-content"
      {...props}
    />
  )
);
SidebarContent.displayName = 'SidebarContent';

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('border-t border-sidebar-border px-3 py-2.5', className)}
      data-slot="sidebar-footer"
      {...props}
    />
  )
);
SidebarFooter.displayName = 'SidebarFooter';

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-px px-1.5 py-1', className)}
      data-slot="sidebar-group"
      {...props}
    />
  )
);
SidebarGroup.displayName = 'SidebarGroup';

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-2 pt-2 pb-1 text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground',
      className
    )}
    data-slot="sidebar-group-label"
    {...props}
  />
));
SidebarGroupLabel.displayName = 'SidebarGroupLabel';
