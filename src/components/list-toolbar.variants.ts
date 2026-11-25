import { cva } from 'class-variance-authority';

import { controlVariants, fieldVariants } from './control.variants';

/** One 45 px row that never wraps: the search shrinks, the chips scroll, then fit steps apply. */
export const listToolbarVariants = cva(
  'group/list-toolbar relative flex h-[45px] min-w-0 flex-none flex-nowrap items-center gap-2 border-b border-border px-4 py-2'
);

export const toolbarSearchVariants = cva([
  fieldVariants(),
  'h-7 w-auto min-w-[72px] max-w-[340px] flex-[1_1_160px] bg-card text-foreground',
  '[&::-webkit-search-cancel-button]:hidden',
]);

/** 28 px bordered text button, for example Filter. */
export const toolbarButtonVariants = cva([
  controlVariants(),
  'border border-border font-medium text-foreground transition-colors duration-fast hover:bg-accent aria-expanded:bg-accent focus-ring',
]);

/** 28 px square icon button, for example Display options. */
export const toolbarIconButtonVariants = cva([
  controlVariants(),
  'w-7 px-0 text-muted-foreground transition-colors duration-fast hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground focus-ring',
]);

/** Chips row: scrolls without a scrollbar, fades its right edge while it overflows; folds with the search (the Filter badge keeps the count). */
export const activeFiltersVariants = cva([
  'flex min-w-0 flex-[0_1_auto] flex-nowrap items-center gap-1.5 overflow-x-auto py-1 empty:hidden group-data-[fit-search]/list-toolbar:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  'data-[overflow=true]:pr-6 data-[overflow=true]:[mask-image:linear-gradient(90deg,black_calc(100%-28px),transparent)]',
]);

export const activeFilterChipVariants = cva(
  'flex-none border-muted-foreground text-foreground hover:border-primary'
);
