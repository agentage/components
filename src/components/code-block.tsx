'use client';

import * as React from 'react';
import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { CodeBody } from './code-block.body';

export const codeBlockCopyVariants = cva(
  [
    'absolute right-2 top-2 grid size-6 place-items-center rounded-lg transition-colors duration-fast [&_svg]:size-3.5',
    'text-muted-foreground hover:bg-accent hover:text-foreground',
    'opacity-0 group-hover:opacity-100 focus:opacity-100',
    'focus-ring',
  ],
  {
    variants: {
      /** The language bar pushes the button below it. */
      withHeader: {
        true: 'top-10',
        false: '',
      },
    },
    defaultVariants: {
      withHeader: false,
    },
  }
);

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  /**
   * Language label in the header. A known language (typescript, bash, json, yaml, diff and more)
   * is also highlighted at runtime; an unknown one shows plain text.
   */
  language?: string;
  showCopy?: boolean;
  /** Pre-tokenized markup rendered instead of the raw `code` text; skips runtime highlighting. */
  children?: React.ReactNode;
}

const CopyIcon = (): React.JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = (): React.JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ code, language, showCopy = true, className, children, ...props }, ref) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (): Promise<void> => {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative group min-w-0 rounded-lg border border-border bg-background',
          className
        )}
        data-slot="code-block"
        {...props}
      >
        {language && (
          <div className="flex h-8 items-center justify-between rounded-t-lg border-b border-border bg-card px-3">
            <span className="text-xs text-muted-foreground font-mono">{language}</span>
          </div>
        )}
        {showCopy && (
          <button
            type="button"
            onClick={() => void handleCopy()}
            className={cn(codeBlockCopyVariants({ withHeader: !!language }), 'z-10')}
            aria-label={copied ? 'Copied' : 'Copy code'}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        )}
        {/* Focusable: long lines and the 320 px cap scroll inside, and keys must reach them. */}
        <pre
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          className={cn(
            'm-0 max-h-80 overflow-auto rounded-b-lg py-2.5 text-xs leading-relaxed focus-ring',
            children !== undefined && 'px-3'
          )}
        >
          {children ?? <CodeBody code={code} language={language} />}
        </pre>
      </div>
    );
  }
);
CodeBlock.displayName = 'CodeBlock';

export type InlineCodeProps = React.HTMLAttributes<HTMLElement>;

export const InlineCode = React.forwardRef<HTMLElement, InlineCodeProps>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn('rounded-sm bg-muted px-1 py-px font-mono text-xs text-foreground', className)}
      data-slot="inline-code"
      {...props}
    />
  )
);
InlineCode.displayName = 'InlineCode';
