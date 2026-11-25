'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Alert } from './alert';
import { CheckItem, CheckList, type CheckStatus } from './check-list';
import { DescriptionDetail, DescriptionList, DescriptionTerm } from './description-list';
import { InlineText, ContentBlock, type ContentBlockSource } from './content-block';
import { DiffFileView, type DiffFile } from './content-block.diff';
import { StepsView, type BlockStep } from './content-block.parts';
import { LogView, type LogLine } from './log-view';
import { toLogLine } from './log-view.model';
import { asText, ICON, summaryOf, TITLE } from './content-blocks.meta';

export type { DiffFile, DiffHunk } from './content-block.diff';
export type { BlockStep, BlockStepState } from './content-block.parts';

/** A log block starts at the tail and follows new lines until the reader scrolls up. */
const TailLog = (props: { lines: LogLine[]; 'aria-label': string; style: React.CSSProperties }) => {
  const [follow, setFollow] = React.useState(true);
  return (
    <LogView
      {...props}
      follow={follow}
      onFollowChange={setFollow}
      showTime={false}
      className="py-1"
    />
  );
};

interface BlockBase {
  /** Stable key when blocks change. */
  id?: string;
  title?: string;
  source?: ContentBlockSource;
  /** Adds the header copy button; `true` copies the block as text. */
  copy?: boolean;
  defaultOpen?: boolean;
}

export type ContentBlockData = BlockBase &
  (
    | { type: 'text'; text: string }
    | {
        type: 'facts';
        rows: { label: string; value: React.ReactNode; mono?: boolean; href?: string }[];
      }
    | { type: 'steps'; steps: BlockStep[] }
    | {
        type: 'checks';
        rows: { label: string; status?: CheckStatus; value?: string; detail?: React.ReactNode }[];
      }
    | { type: 'diff'; files: DiffFile[] }
    | { type: 'log'; lines: (string | LogLine)[]; tail?: number }
    | {
        type: 'callout';
        question: React.ReactNode;
        actions?: React.ReactNode;
        icon?: React.ReactNode;
      }
  );

/** Keys by name, suffixing repeats, so an inserted row never remounts the rows after it. */
const keysOf = (names: string[]): string[] => {
  const seen = new Map<string, number>();
  return names.map((n) => {
    const k = seen.get(n) ?? 0;
    seen.set(n, k + 1);
    return k ? `${n}#${String(k)}` : n;
  });
};

const BlockBody = ({ block: b }: { block: ContentBlockData }) => {
  switch (b.type) {
    case 'text':
      return (
        <p className="m-0 px-3 py-2.5 text-ui leading-relaxed">
          <InlineText text={b.text} />
        </p>
      );
    case 'facts': {
      const keys = keysOf(b.rows.map((r) => r.label));
      return (
        <DescriptionList labelWidth="md" className="px-3.5 py-3">
          {b.rows.map((r, i) => (
            <React.Fragment key={keys[i]}>
              <DescriptionTerm>{r.label}</DescriptionTerm>
              <DescriptionDetail mono={r.mono} href={r.href}>
                {typeof r.value === 'string' ? <InlineText text={r.value} /> : r.value}
              </DescriptionDetail>
            </React.Fragment>
          ))}
        </DescriptionList>
      );
    }
    case 'steps':
      return <StepsView steps={b.steps} />;
    case 'checks': {
      const keys = keysOf(b.rows.map((r) => r.label));
      return (
        <CheckList variant="plain">
          {b.rows.map((r, i) => (
            <CheckItem key={keys[i]} label={r.label} status={r.status} value={r.value}>
              {r.detail}
            </CheckItem>
          ))}
        </CheckList>
      );
    }
    case 'diff': {
      const keys = keysOf(b.files.map((f) => f.path));
      return (
        <div>
          {b.files.map((f, i) => (
            <DiffFileView key={keys[i]} file={f} />
          ))}
        </div>
      );
    }
    case 'log':
      return (
        <TailLog
          lines={b.lines.map(toLogLine)}
          aria-label={b.title ?? 'Log lines'}
          style={{ height: Math.min(b.lines.length, b.tail ?? 8) * 24 + 8 }}
        />
      );
    default:
      return null;
  }
};

const Block = ({ block: b }: { block: ContentBlockData }) => {
  if (b.type === 'callout')
    return (
      <Alert variant="primary" icon={b.icon} title={b.title} actions={b.actions} role="note">
        {b.question}
      </Alert>
    );
  if (b.type === 'text' && !b.title)
    return (
      <p className="m-0 text-ui leading-relaxed">
        <InlineText text={b.text} />
      </p>
    );
  return (
    <ContentBlock
      title={b.title ?? TITLE[b.type]}
      icon={ICON[b.type]}
      summary={summaryOf(b)}
      source={b.source}
      copyText={b.copy ? asText(b) : undefined}
      defaultOpen={b.defaultOpen}
      data-block={b.type}
    >
      <BlockBody block={b} />
    </ContentBlock>
  );
};

export interface ContentBlocksProps extends React.HTMLAttributes<HTMLDivElement> {
  blocks: ContentBlockData[];
}

/**
 * Typed detail body, richer than markdown: text, facts, steps, checks, diff, log and a callout.
 * Each framed block has a header with an icon, title, summary, collapse, link and copy.
 */
export const ContentBlocks = React.forwardRef<HTMLDivElement, ContentBlocksProps>(
  ({ blocks, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex min-w-0 flex-col gap-3.5', className)}
      data-slot="content-blocks"
      {...props}
    >
      {blocks.map((b, i) => (
        <Block key={b.id ?? `${b.type}-${String(i)}`} block={b} />
      ))}
    </div>
  )
);
ContentBlocks.displayName = 'ContentBlocks';
