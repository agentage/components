'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';
import { MARKDOWN_COMPONENTS } from './markdown.parts';

const REMARK = [remarkGfm];

export interface MarkdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The markdown text. Raw HTML in it shows as text; it is never rendered. */
  children: string;
}

/**
 * A markdown answer: headings, lists, inline code, links, tables and fenced code highlighted by
 * its language. Safe to re-render with a growing string while it streams.
 */
export const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 flex-col gap-2 text-ui leading-[1.55] text-foreground [overflow-wrap:anywhere]',
        className
      )}
      data-slot="markdown"
      {...props}
    >
      <ReactMarkdown remarkPlugins={REMARK} components={MARKDOWN_COMPONENTS}>
        {children}
      </ReactMarkdown>
    </div>
  )
);
Markdown.displayName = 'Markdown';
