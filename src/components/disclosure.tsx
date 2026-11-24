import * as React from 'react';
import { cn } from '../lib/utils';

/** Height animates through grid rows 0fr to 1fr; instant under reduced motion. */
export const DISCLOSURE_BODY =
  'grid transition-[grid-template-rows,opacity,visibility] duration-normal ease-out motion-reduce:transition-none data-[state=closed]:invisible data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]';

export interface DisclosureProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  /** Also fades the content out while it shuts. */
  fade?: boolean;
  /** Lets the body shrink below its content, for example inside a table cell. */
  shrink?: boolean;
  /** Classes of the outer animated box; `className` styles the content box. */
  bodyClassName?: string;
}

/**
 * Animated collapse body: always mounted, so nodes and focus targets keep their identity;
 * `inert` keeps a shut body out of the tab order and the accessibility tree; `visibility` flips
 * hidden once the height transition ends, so the clipped content is not painted or hit-tested.
 */
export const Disclosure = React.forwardRef<HTMLDivElement, DisclosureProps>(
  ({ open, fade = false, shrink = false, bodyClassName, className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-state={open ? 'open' : 'closed'}
      inert={!open}
      className={cn(
        DISCLOSURE_BODY,
        fade && 'data-[state=closed]:opacity-0',
        shrink && 'grid-cols-[minmax(0,1fr)]',
        bodyClassName
      )}
      data-slot="disclosure"
      {...props}
    >
      {/* clip, not hidden: a clip box keeps its min-content width inside table cells. */}
      <div className="min-h-0 overflow-clip">
        <div className={className}>{children}</div>
      </div>
    </div>
  )
);
Disclosure.displayName = 'Disclosure';

export interface DisclosureChevronProps extends React.SVGAttributes<SVGSVGElement> {
  open: boolean;
}

/** 12 px chevron that points right when shut and down when open. */
export const DisclosureChevron = ({ open, className, ...props }: DisclosureChevronProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={cn(
      'size-3 shrink-0 text-muted-foreground transition-transform duration-fast motion-reduce:transition-none',
      open && 'rotate-90',
      className
    )}
    data-slot="disclosure-chevron"
    {...props}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
