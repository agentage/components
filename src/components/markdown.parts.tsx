'use client';

import * as React from 'react';
import type { Components, ExtraProps } from 'react-markdown';
import { cn } from '../lib/utils';
import { CodeBlock, InlineCode } from './code-block';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

type HastNode = NonNullable<ExtraProps['node']>['children'][number];

const textOf = (node: HastNode): string =>
  node.type === 'text' ? node.value : 'children' in node ? node.children.map(textOf).join('') : '';

const HEADING = 'm-0 mt-1 text-sm font-semibold leading-snug text-foreground';

/** Fenced code: the hast `pre > code` node becomes a CodeBlock highlighted by its language. */
const Pre = ({ node }: React.HTMLAttributes<HTMLPreElement> & ExtraProps) => {
  const code = node?.children.find((c) => c.type === 'element' && c.tagName === 'code');
  const classes = code?.type === 'element' ? code.properties.className : undefined;
  const language = Array.isArray(classes)
    ? classes
        .map(String)
        .find((c) => c.startsWith('language-'))
        ?.slice(9)
    : undefined;
  const text = code ? textOf(code).replace(/\n$/, '') : '';
  return <CodeBlock code={text} language={language} />;
};

const Cell =
  (Comp: typeof TableHead | typeof TableCell, extra: string) =>
  ({
    node: _node,
    className,
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement> & ExtraProps) => (
    <Comp className={cn('h-7 px-2.5', extra, className)} {...props} />
  );

/** Module-level, so a growing (streamed) string re-renders in place instead of remounting. */
export const MARKDOWN_COMPONENTS: Components = {
  h1: ({ node: _n, children, ...p }) => (
    <h2 className={HEADING} {...p}>
      {children}
    </h2>
  ),
  h2: ({ node: _n, children, ...p }) => (
    <h3 className={HEADING} {...p}>
      {children}
    </h3>
  ),
  h3: ({ node: _n, children, ...p }) => (
    <h4 className={HEADING} {...p}>
      {children}
    </h4>
  ),
  h4: ({ node: _n, children, ...p }) => (
    <h5 className={HEADING} {...p}>
      {children}
    </h5>
  ),
  p: ({ node: _n, ...p }) => <p className="m-0" {...p} />,
  ul: ({ node: _n, ...p }) => <ul className="m-0 list-disc pl-[18px]" {...p} />,
  ol: ({ node: _n, ...p }) => <ol className="m-0 list-decimal pl-[18px]" {...p} />,
  li: ({ node: _n, ...p }) => <li className="my-0.5" {...p} />,
  a: ({ node: _n, children, ...p }) => (
    <a
      className="rounded-sm text-primary-emphasis underline underline-offset-4 hover:text-foreground focus-ring"
      rel="noreferrer"
      {...p}
    >
      {children}
    </a>
  ),
  strong: ({ node: _n, ...p }) => <strong className="font-semibold" {...p} />,
  blockquote: ({ node: _n, ...p }) => (
    <blockquote className="m-0 border-l-2 border-border pl-3 text-muted-foreground" {...p} />
  ),
  hr: () => <hr className="my-1 border-0 border-t border-border" />,
  code: ({ node: _n, className, ...p }) => (
    <InlineCode className={cn('bg-accent', className)} {...p} />
  ),
  pre: Pre,
  table: ({ node: _n, ...p }) => (
    // Focusable: a wide table scrolls sideways inside its frame.
    <div
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className="min-w-0 overflow-x-auto rounded-lg border border-border focus-ring"
    >
      <table className="w-full border-collapse text-xs" {...p} />
    </div>
  ),
  thead: ({ node: _n, ...p }) => <TableHeader {...p} />,
  tbody: ({ node: _n, ...p }) => <TableBody {...p} />,
  tr: ({ node: _n, ...p }) => <TableRow className="hover:bg-transparent" {...p} />,
  th: Cell(TableHead, 'static bg-card font-semibold'),
  td: Cell(TableCell, 'whitespace-nowrap'),
};
