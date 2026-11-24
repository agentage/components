import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

// Dense is the look: 32 px header (12 px regular muted), 36 px rows at 13 px. The deprecated
// `comfortable` table keeps the pre-0.21 49 px rows and the uppercase header.
const TABLE_HEAD_BASE = [
  'h-8 bg-background px-3 text-left align-middle text-xs font-normal text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-0',
  'group-data-[look=comfortable]/table:h-10 group-data-[look=comfortable]/table:bg-card group-data-[look=comfortable]/table:px-4 group-data-[look=comfortable]/table:text-2xs group-data-[look=comfortable]/table:font-medium group-data-[look=comfortable]/table:uppercase group-data-[look=comfortable]/table:tracking-[0.04em] group-data-[look=comfortable]/table:whitespace-normal',
].join(' ');

const TABLE_CELL_BASE = [
  'h-9 px-3 py-0 align-middle [&:has([role=checkbox])]:pr-0',
  'group-data-[look=comfortable]/table:h-auto group-data-[look=comfortable]/table:px-4 group-data-[look=comfortable]/table:py-2.5',
].join(' ');

const TABLE_ROW_BASE = cn(
  'border-b border-border transition-colors duration-fast hover:bg-accent data-[state=selected]:bg-accent',
  'hover:[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]',
  'data-[state=selected]:[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]'
);

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /**
   * Deprecated: The 36 px row is the only look; `comfortable` is the pre-0.21 49 px row.
   * @deprecated The 36 px row is the only look; `comfortable` is the pre-0.21 49 px row.
   */
  density?: 'compact' | 'comfortable';
}

// Empty cva base keeps the pin classes ahead of TABLE_HEAD_BASE, so the merged string is unchanged.
export const tableHeadVariants = cva('', {
  variants: {
    sticky: {
      true: 'sticky top-0 z-10',
      false: '',
    },
  },
  defaultVariants: {
    sticky: true,
  },
});

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, density = 'compact', ...props }, ref) => (
    <div className="relative w-full overflow-auto" data-slot="table-container">
      <table
        ref={ref}
        className={cn(
          'group/table w-full caption-bottom text-ui data-[look=comfortable]:text-sm',
          className
        )}
        data-slot="table"
        data-density={density}
        data-look={density === 'comfortable' ? 'comfortable' : 'dense'}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('[&_tr]:border-b', className)}
    data-slot="table-header"
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    data-slot="table-body"
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
    data-slot="table-footer"
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn(TABLE_ROW_BASE, className)} data-slot="table-row" {...props} />
));
TableRow.displayName = 'TableRow';

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>, VariantProps<typeof tableHeadVariants> {
  /** Pin the header cell while the table body scrolls. */
  sticky?: boolean;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sticky = true, ...props }, ref) => (
    <th
      ref={ref}
      scope="col"
      className={cn(tableHeadVariants({ sticky }), TABLE_HEAD_BASE, className)}
      data-slot="table-head"
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn(TABLE_CELL_BASE, className)} data-slot="table-cell" {...props} />
));
TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-3 text-xs text-muted-foreground', className)}
    data-slot="table-caption"
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';
