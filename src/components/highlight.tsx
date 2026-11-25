import * as React from 'react';

const MARK = 'bg-warning/30 text-foreground';

/** `text` with every case-insensitive hit of `query` wrapped in a `<mark>`. */
export const highlightText = (text: string, query?: string): React.ReactNode => {
  const q = query?.trim();
  if (!q) return text;
  const pattern = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const out: React.ReactNode[] = [];
  let at = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > at) out.push(text.slice(at, match.index));
    out.push(
      <mark key={match.index} className={MARK}>
        {match[0]}
      </mark>
    );
    at = match.index + match[0].length;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
};
