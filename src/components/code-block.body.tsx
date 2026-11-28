import * as React from 'react';
import { cn } from '../lib/utils';
import { codeLanguage, highlightCode } from '../lib/highlight-code';

// w-max + min-w-full: line backgrounds reach the right edge of the scrolled content.
const BODY = 'block w-max min-w-full font-mono';

const diffTone = (line: string): string => {
  if (line.startsWith('+++') || line.startsWith('---')) return 'text-[color:var(--syntax-comment)]';
  if (line.startsWith('+')) return 'bg-success/10 text-[color:var(--syntax-number)]';
  if (line.startsWith('-')) return 'bg-destructive/10 text-[color:var(--syntax-string)]';
  if (line.startsWith('@@')) return 'text-[color:var(--syntax-keyword)]';
  return 'text-[color:var(--syntax-text)]';
};

/** A diff, one block line each, so added and removed lines get a faint full-width background. */
const DiffBody = ({ code }: { code: string }) => (
  <code className={BODY} data-language="diff">
    {code.split('\n').map((line, i) => (
      <span key={i} className={cn('block min-h-[1lh] px-3', diffTone(line))}>
        {line}
      </span>
    ))}
  </code>
);

/** The code highlighted at runtime by its language; plain escaped text for an unknown one. */
export const CodeBody = ({ code, language }: { code: string; language?: string }) => {
  const lang = codeLanguage(language);
  const html = React.useMemo(
    () => (lang && lang !== 'diff' ? highlightCode(code, lang) : null),
    [code, lang]
  );
  if (lang === 'diff') return <DiffBody code={code} />;
  if (html === null) return <code className={cn(BODY, 'px-3 text-foreground')}>{code}</code>;
  return (
    <code
      className={cn(BODY, 'hljs px-3')}
      data-language={lang}
      // highlight.js escapes the source; its own hljs-* spans are the only markup.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
