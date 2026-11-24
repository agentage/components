import type { ReactNode } from 'react';
import { cn } from '../../src';
import { Caption } from './caption';

/** One horizontal line of examples that wraps: buttons, badges, chips. */
export const Row = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('flex flex-wrap items-center gap-2', className)}>{children}</div>
);

/** One example with its caption under it; demo sections are a column of these. */
export const Block = ({
  caption,
  children,
  className,
}: {
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <div className="space-y-2">
    <div className={className}>{children}</div>
    {caption && <Caption>{caption}</Caption>}
  </div>
);
