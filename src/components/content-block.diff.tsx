'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Disclosure } from './disclosure';
import { GroupHeader } from './group-header';

export interface DiffHunk {
  /** `@@ -18,7 +18,9 @@ context`; its start numbers drive the line numbers. */
  header: string;
  /** Lines with a leading `+`, `-` or space. */
  lines: string[];
}

export interface DiffFile {
  path: string;
  hunks: DiffHunk[];
}

export const diffStats = (files: DiffFile[]) => {
  const lines = files.flatMap((f) => f.hunks.flatMap((h) => h.lines));
  return {
    add: lines.filter((l) => l.startsWith('+')).length,
    del: lines.filter((l) => l.startsWith('-')).length,
  };
};

export const diffText = (files: DiffFile[]): string =>
  files
    .map((f) =>
      [
        `--- a/${f.path}`,
        `+++ b/${f.path}`,
        ...f.hunks.flatMap((h) => [h.header, ...h.lines]),
      ].join('\n')
    )
    .join('\n');

export const DiffStat = ({ add, del }: { add: number; del: number }) => (
  <span className="font-mono tabular-nums" data-slot="diff-stat">
    <span className="text-success">+{add}</span> <span className="text-destructive">-{del}</span>
  </span>
);

const startsOf = (header: string): [number, number] => {
  const m = /@@ -(\d+)(?:,\d+)? \+(\d+)/.exec(header);
  return m ? [Number(m[1]), Number(m[2])] : [1, 1];
};

const ROW = 'grid grid-cols-[36px_36px_16px_minmax(0,1fr)] font-mono text-xs leading-[1.7]';
const NUM = 'select-none pr-2 text-right text-muted-foreground';

const Hunk = ({ hunk }: { hunk: DiffHunk }) => {
  let [a, b] = startsOf(hunk.header);
  return (
    <>
      <div className={cn(ROW, 'bg-muted/40 text-muted-foreground')} data-slot="diff-hunk">
        <span className="col-span-3" />
        <span className="truncate">{hunk.header}</span>
      </div>
      {hunk.lines.map((line, i) => {
        if (line.startsWith('\\')) {
          return (
            <div key={i} className={cn(ROW, 'text-muted-foreground')} data-kind="meta">
              <span className="col-span-3" />
              <span className="whitespace-pre italic">{line}</span>
            </div>
          );
        }
        const sign = line[0] === '+' || line[0] === '-' ? line[0] : ' ';
        const left = sign === '+' ? '' : String(a++);
        const right = sign === '-' ? '' : String(b++);
        return (
          <div
            key={i}
            className={cn(
              ROW,
              sign === '+' && 'bg-success/12',
              sign === '-' && 'bg-destructive/12'
            )}
            data-kind={sign === '+' ? 'add' : sign === '-' ? 'del' : 'context'}
          >
            <span className={cn(NUM, sign !== ' ' && 'text-foreground/70')}>{left}</span>
            <span className={cn(NUM, sign !== ' ' && 'text-foreground/70')}>{right}</span>
            <span
              className={cn(
                'select-none font-semibold',
                sign === '+' && 'text-success',
                sign === '-' && 'text-destructive'
              )}
              aria-hidden="true"
            >
              {sign}
            </span>
            <span className="whitespace-pre">
              {sign !== ' ' && (
                <span className="sr-only select-none">{sign === '+' ? 'added ' : 'removed '}</span>
              )}
              {line.slice(1)}
            </span>
          </div>
        );
      })}
    </>
  );
};

/** One file of a diff: a mono path header with +n -n that collapses its hunks. */
export const DiffFileView = ({
  file,
  defaultOpen = true,
}: {
  file: DiffFile;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();
  return (
    <div className="border-b border-border last:border-b-0" data-slot="diff-file">
      <GroupHeader
        label={
          <span className="font-mono text-xs font-normal text-muted-foreground">{file.path}</span>
        }
        summary={<DiffStat {...diffStats([file])} />}
        open={open}
        onOpenChange={setOpen}
        controls={id}
        className="border-b-0 bg-transparent pr-0"
        data-slot="diff-file-toggle"
      />
      <Disclosure id={id} open={open}>
        <div
          // Scrolls sideways for long lines, so it must be reachable by keyboard.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          role="region"
          aria-label={`Changes in ${file.path}`}
          className="overflow-x-auto border-t border-border py-1 focus-ring"
        >
          {file.hunks.map((h, i) => (
            <Hunk key={i} hunk={h} />
          ))}
        </div>
      </Disclosure>
    </div>
  );
};
