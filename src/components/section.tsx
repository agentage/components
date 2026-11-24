import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const sectionVariants = cva('', {
  variants: {
    variant: {
      /** Open form section: no box, a 1 px rule and 26 px of air between siblings. */
      open: 'border-b border-border pb-[26px] mb-[26px] last:mb-0 last:border-b-0 last:pb-0',
      /** The pre-0.21 look: a bordered, filled box. */
      boxed: 'rounded-lg border border-border bg-sidebar p-4',
    },
  },
  defaultVariants: { variant: 'open' },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sectionVariants> {
  icon?: React.ReactNode;
  iconColor?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /** Element for the title; defaults to h2 when open, a div when boxed. */
  headingAs?: 'h2' | 'h3' | 'h4' | 'div';
  children: React.ReactNode;
}

export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  (
    {
      icon,
      iconColor,
      title,
      description,
      action,
      variant,
      headingAs,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const open = variant !== 'boxed';
    const Title = headingAs ?? (open ? 'h2' : 'div');
    return (
      <div
        ref={ref}
        className={cn(sectionVariants({ variant }), className)}
        data-slot="section"
        data-variant={open ? 'open' : 'boxed'}
        {...props}
      >
        <div
          className={cn(
            'flex justify-between gap-3',
            open ? 'mb-3.5 items-start' : 'mb-4 items-center'
          )}
        >
          <div className={cn('flex min-w-0 gap-3', open ? 'items-start' : 'items-center')}>
            {icon && (
              <div
                aria-hidden="true"
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-md [&_svg]:size-4',
                  open ? 'size-7' : 'size-8',
                  iconColor ?? 'bg-primary/10 text-primary-emphasis'
                )}
              >
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <Title
                className={cn(
                  'text-foreground',
                  open ? 'text-base font-semibold leading-7' : 'text-ui font-medium'
                )}
              >
                {title}
              </Title>
              {description && (
                <p
                  className={cn(
                    'text-muted-foreground',
                    open ? 'text-xs leading-[18px]' : 'text-xs'
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </div>
        {children}
      </div>
    );
  }
);
Section.displayName = 'Section';

export type SectionLabelProps = React.HTMLAttributes<HTMLHeadingElement> & {
  /** Heading element; h3 under a Section's h2 by default. */
  as?: 'h3' | 'h4' | 'div';
};

/** Small uppercase sub-heading inside a Section: 12/600, letter-spaced, 18 px above, 8 px below. */
export const SectionLabel = React.forwardRef<HTMLHeadingElement, SectionLabelProps>(
  ({ as: Comp = 'h3', className, ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(
        'mt-[18px] mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground first:mt-0',
        className
      )}
      data-slot="section-label"
      {...props}
    />
  )
);
SectionLabel.displayName = 'SectionLabel';
