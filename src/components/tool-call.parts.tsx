'use client';

import * as React from 'react';
import { cn, MUTED_ON_HOVER } from '../lib/utils';
import { highlightCode } from '../lib/highlight-code';
import { DisclosureChevron } from './disclosure';
import { StatusGlyph, type StatusGlyphProps } from './status-glyph';

export type ToolCallStatus = 'running' | 'succeeded' | 'failed' | 'waiting';

export const TOOL_GLYPH: Record<
  ToolCallStatus,
  Pick<StatusGlyphProps, 'shape' | 'tone' | 'pulse' | 'label'>
> = {
  running: { shape: 'disc', tone: 'primary', pulse: true, label: 'Running' },
  succeeded: { shape: 'check', tone: 'success', label: 'Succeeded' },
  failed: { shape: 'cross', tone: 'destructive', label: 'Failed' },
  waiting: { shape: 'alert', tone: 'primary', label: 'Waiting for approval' },
};

/** Set by ToolGroup: its calls render as flat 28 px rows inside the group body. */
export const ToolGroupContext = React.createContext(false);

/** `server.tool` with the server prefix dimmed. */
export const ToolName = ({ name }: { name: string }) => {
  const dot = name.indexOf('.');
  return (
    <span className="flex-none whitespace-nowrap font-mono text-xs text-foreground">
      {dot > 0 && <span className="text-muted-foreground">{name.slice(0, dot + 1)}</span>}
      {dot > 0 ? name.slice(dot + 1) : name}
    </span>
  );
};

export interface ToolRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  glyph: React.ReactNode;
  duration?: React.ReactNode;
  /** Set when the row toggles a body: it is a button with a turning chevron. */
  open?: boolean;
  nested?: boolean;
}

const ROW = 'flex w-full min-w-0 items-center gap-2 pl-2.5 pr-1.5 text-left';

/** The one header row of a tool call, group or reasoning line: glyph, text, duration, chevron. */
export const ToolRow = ({
  glyph,
  duration,
  open,
  nested,
  className,
  children,
  ...props
}: ToolRowProps) => {
  const body = (
    <>
      <span className="grid size-3.5 flex-none place-items-center">{glyph}</span>
      {children}
      {duration !== undefined && (
        <span className="w-11 flex-none text-right text-xs tabular-nums text-muted-foreground">
          {duration}
        </span>
      )}
      <span className="grid size-4 flex-none place-items-center">
        {open !== undefined && <DisclosureChevron open={open} />}
      </span>
    </>
  );
  const height = nested ? 'h-7' : 'h-8';
  if (open === undefined)
    return <div className={cn(ROW, height, 'cursor-default', className)}>{body}</div>;
  return (
    <button
      type="button"
      aria-expanded={open}
      className={cn(
        ROW,
        height,
        'rounded-lg hover:bg-accent focus-ring',
        MUTED_ON_HOVER,
        className
      )}
      {...props}
    >
      {body}
    </button>
  );
};

export const StatusMark = ({ status }: { status: ToolCallStatus }) => (
  <StatusGlyph {...TOOL_GLYPH[status]} />
);

const asText = (value: unknown): string =>
  typeof value === 'string' ? value : (JSON.stringify(value, null, 2) ?? String(value));

/** One labelled payload (Input, Output or Error): JSON highlighted, errors in the danger tone. */
export const Payload = ({
  label,
  value,
  error,
}: {
  label: string;
  value: unknown;
  error?: boolean;
}) => {
  const text = asText(value);
  const html = error ? null : highlightCode(text, 'json');
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="flex h-5 items-center text-2xs uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
      {/* Focusable: a long payload scrolls inside its 180 px frame. */}
      <pre
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className={cn(
          'm-0 max-h-[180px] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-card px-2 py-1.5 font-mono text-xs leading-[1.55] [overflow-wrap:anywhere] focus-ring',
          error && 'text-destructive'
        )}
      >
        {html === null ? (
          text
        ) : (
          // highlight.js escapes the payload; its own hljs-* spans are the only markup.
          <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </pre>
    </div>
  );
};
