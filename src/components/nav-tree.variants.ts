import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { rowVariants } from './row.variants';

/**
 * Navigation row: NavRow, SectionIndex, Sidebar and DocSidebar items. `rowVariants` size `nav`
 * plus the group marker its children style from; every size is 13 px now.
 */
export const navRowVariants = ({
  selected = false,
}: { size?: 'sm' | 'md' | null; selected?: boolean | null } = {}): string =>
  cn('group', rowVariants({ size: 'nav', selected: !!selected }));

/** Container of nav rows: 1 px between rows and a small inset from the pane edge. */
export const navListVariants = cva('flex flex-col gap-px px-1.5 py-1');

export const navRowPillVariants = cva(
  'grid h-4.5 min-w-4.5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-2xs font-bold leading-none text-primary-foreground'
);

export const navRowCountVariants = cva(
  'shrink-0 text-xs text-muted-foreground group-hover:text-foreground group-aria-selected:text-foreground group-aria-[current]:text-foreground'
);
