import * as React from 'react';
import { cn } from '../lib/utils';

/** Open form section: no box, a 1 px rule and 26 px of air between siblings. */
const SECTION = 'border-b border-border pb-[26px] mb-[26px] last:mb-0 last:border-b-0 last:pb-0';

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ icon, title, description, action, children, className, ...props }, ref) => (
    <div ref={ref} className={cn(SECTION, className)} data-slot="section" {...props}>
      <div className="mb-3.5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {icon && (
            <div
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary-emphasis [&_svg]:size-4"
            >
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-base font-semibold leading-7 text-foreground">{title}</h2>
            {description && (
              <p className="text-xs leading-[18px] text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </div>
      {children}
    </div>
  )
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
