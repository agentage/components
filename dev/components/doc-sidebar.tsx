// Docs-only: the docs site sidebar, built on the package nav row.
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../src/lib/utils';
import { navRowVariants } from '../../src/components/nav-tree.variants';

/** Doc rows share the 28 px nav row; `indented` is kept for callers and adds no rule. */
export const docSidebarItemVariants = cva('', {
  variants: {
    indented: {
      true: '',
      false: '',
    },
    active: { true: '', false: '' },
  },
  defaultVariants: {
    indented: false,
    active: false,
  },
});

export interface DocSidebarProps extends React.HTMLAttributes<HTMLElement> {
  width?: string;
}

export const DocSidebar = React.forwardRef<HTMLElement, DocSidebarProps>(
  ({ className, width = 'w-60', children, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        width,
        'shrink-0 border-r border-border bg-sidebar text-sidebar-foreground',
        className
      )}
      data-slot="doc-sidebar"
      {...props}
    >
      <div className="sticky top-0 max-h-screen overflow-y-auto px-1.5 py-3">{children}</div>
    </aside>
  )
);
DocSidebar.displayName = 'DocSidebar';

export interface DocSidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export const DocSidebarGroup = React.forwardRef<HTMLDivElement, DocSidebarGroupProps>(
  ({ title, className, children, ...props }, ref) => (
    <div ref={ref} className={cn('mb-3', className)} data-slot="doc-sidebar-group" {...props}>
      <div className="px-2 pt-1 pb-1 text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
        {title}
      </div>
      <div className="flex flex-col gap-px">{children}</div>
    </div>
  )
);
DocSidebarGroup.displayName = 'DocSidebarGroup';

export interface DocSidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  depth?: number;
}

export const DocSidebarItem = React.forwardRef<HTMLAnchorElement, DocSidebarItemProps>(
  ({ active, depth = 0, className, style, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        navRowVariants({ selected: !!active }),
        docSidebarItemVariants({ indented: depth > 0, active: !!active }),
        className
      )}
      style={depth > 0 ? { ...style, paddingLeft: `${0.5 + depth * 0.875}rem` } : style}
      data-slot="doc-sidebar-item"
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  )
);
DocSidebarItem.displayName = 'DocSidebarItem';
