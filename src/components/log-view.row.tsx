'use client';

import * as React from 'react';
import { cn, MUTED_ON_ACCENT, MUTED_ON_HOVER } from '../lib/utils';
import { DataTree } from './data-tree';
import { LazyCopy } from './data-tree.row';
import { highlightText } from './highlight';
import { lineText, type LogLevelStyle, type LogLine, type LogTone } from './log-view.model';
import { RelativeTime } from './relative-time';
import { StatusGlyph } from './status-glyph';

const TEXT: Record<LogTone, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
};

const GLYPH = {
  default: 'muted',
  muted: 'muted',
  info: 'info',
  success: 'success',
  warning: 'warning',
  destructive: 'destructive',
} as const;

export interface LogRowProps {
  id: string;
  line: LogLine;
  index: number;
  style: LogLevelStyle;
  top?: number;
  height: number;
  wrap: boolean;
  showTime: 'absolute' | 'relative' | false;
  showSource: boolean;
  highlight?: string;
  active: boolean;
  /** Undefined for a line without fields; true shows the detail inside the row. */
  expanded?: boolean;
  onPick: (id: string) => void;
  onHeight: (id: string, height: number) => void;
}

// Error text keeps AA contrast on the accent of a hovered or active line.
const ERROR_ON_ACCENT =
  '[--color-destructive:color-mix(in_oklab,var(--color-destructive)_70%,var(--color-foreground))]';
const ERROR_ON_HOVER =
  'hover:[--color-destructive:color-mix(in_oklab,var(--color-destructive)_70%,var(--color-foreground))]';

/** One mono log line: level glyph, time, source, text and a copy button; open, its fields below. */
export const LogRow = React.memo(
  ({ id, line, index, style, top, height, wrap, showTime, showSource, ...p }: LogRowProps) => {
    const cols = 3 + (showTime ? 1 : 0) + (showSource ? 1 : 0);
    return (
      <div
        id={id}
        role="row"
        aria-rowindex={index + 1}
        aria-selected={p.active}
        data-level={line.level}
        data-line={line.id}
        style={top === undefined ? undefined : { position: 'absolute', top, left: 0, right: 0 }}
        className="group/log"
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- the grid handles keys through aria-activedescendant */}
        <div
          onClick={() => p.onPick(line.id)}
          style={wrap ? { minHeight: height } : { height }}
          className={cn(
            'relative flex cursor-pointer items-start gap-2 px-2 font-mono text-xs leading-6 hover:bg-accent',
            MUTED_ON_HOVER,
            ERROR_ON_HOVER,
            wrap && '[content-visibility:auto] [contain-intrinsic-size:auto_24px]',
            p.active && [
              'bg-accent',
              MUTED_ON_ACCENT,
              ERROR_ON_ACCENT,
              'before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary',
            ]
          )}
        >
          <span
            role="gridcell"
            aria-expanded={p.expanded}
            className="flex h-6 w-3.5 shrink-0 items-center"
          >
            <StatusGlyph
              shape={style.shape}
              tone={GLYPH[style.tone]}
              label={style.label ?? line.level}
            />
          </span>
          {showTime && (
            <span role="gridcell" className="shrink-0 text-muted-foreground">
              {line.time !== undefined && (
                <RelativeTime value={line.time} format={showTime} className="font-mono" />
              )}
            </span>
          )}
          {showSource && (
            <span role="gridcell" className="w-24 shrink-0 truncate text-muted-foreground">
              {line.source}
            </span>
          )}
          <span
            role="gridcell"
            className={cn(
              'min-w-0 flex-1',
              wrap ? 'break-words whitespace-pre-wrap' : 'truncate whitespace-pre',
              TEXT[style.tone]
            )}
          >
            {highlightText(line.message, p.highlight)}
          </span>
          <span
            role="gridcell"
            className="flex h-6 shrink-0 items-center opacity-0 group-hover/log:opacity-100 group-aria-selected/log:opacity-100"
          >
            <LazyCopy get={() => lineText(line)} label="Copy line" />
          </span>
        </div>
        {p.expanded && (
          <LogDetail
            id={line.id}
            fields={line.fields}
            index={index}
            cols={cols}
            onHeight={p.onHeight}
          />
        )}
      </div>
    );
  }
);
LogRow.displayName = 'LogRow';

export interface LogDetailProps {
  id: string;
  fields: unknown;
  index: number;
  cols: number;
  onHeight: (id: string, height: number) => void;
}

/** The open detail of a line: its fields as a DataTree; reports every height change for windowing. */
export const LogDetail = ({ id, fields, index, cols, onHeight }: LogDetailProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const report = (): void => {
      if (el.offsetHeight) onHeight(id, el.offsetHeight);
    };
    report();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [id, onHeight]);
  return (
    <div
      ref={ref}
      role="gridcell"
      aria-colspan={cols}
      className="py-1 pr-2 pl-7"
      data-slot="log-view-detail"
    >
      <div className="rounded-md border border-border bg-background">
        <DataTree
          value={fields}
          defaultExpandDepth={2}
          aria-label={`Fields of line ${String(index + 1)}`}
        />
      </div>
    </div>
  );
};
