'use client';

import * as React from 'react';
import { copyText } from '../lib/copy-text';
import { cn } from '../lib/utils';
import { CopyButton } from './copy-button';
import { formatScalar, valueText, type DataKind, type DataNode } from './data-tree.model';
import { highlightText } from './highlight';
import { NavRow } from './nav-tree';

const TONE: Record<DataKind, string> = {
  string: 'text-success',
  number: 'text-info',
  boolean: 'text-warning',
  null: 'text-muted-foreground italic',
  object: 'text-muted-foreground',
  array: 'text-muted-foreground',
  other: 'text-muted-foreground',
};

const preview = (node: DataNode): string =>
  node.kind === 'array'
    ? `[${String(node.size)}]`
    : node.kind === 'object'
      ? `{${String(node.size)}}`
      : formatScalar(node.value, node.kind);

/** Ctrl or Cmd plus C, only when no text is selected, so a native copy of a selection wins. */
export const isCopyKey = (e: React.KeyboardEvent): boolean =>
  (e.metaKey || e.ctrlKey) &&
  e.code === 'KeyC' &&
  (typeof window === 'undefined' || window.getSelection()?.isCollapsed !== false);

export interface LazyCopyProps {
  get: () => string;
  label: string;
  className?: string;
}

/** CopyButton whose text is built on hover or focus, not on every render. */
export const LazyCopy = ({ get, label, className }: LazyCopyProps) => {
  const [text, setText] = React.useState<string | null>(null);
  const prime = (): void => setText(get());
  return (
    <CopyButton
      text={text ?? ''}
      label={label}
      iconOnly
      variant="ghost"
      tabIndex={-1}
      className={className}
      onPointerEnter={prime}
      onFocus={prime}
      onClick={(e) => {
        e.stopPropagation();
        if (text !== null) return;
        e.preventDefault();
        void copyText(get());
      }}
    />
  );
};

export interface DataTreeRowProps {
  node: DataNode;
  depth: number;
  open: boolean;
  highlight?: string;
  matched: boolean;
  maxStringLength: number;
  onToggle: () => void;
}

/** One key and value row. Ctrl+C copies the value, Ctrl+Alt+C the path; Right shows a cut string. */
export const DataTreeRow = ({
  node,
  depth,
  open,
  highlight,
  matched,
  maxStringLength,
  onToggle,
}: DataTreeRowProps) => {
  const [full, setFull] = React.useState(false);
  const branch = node.kind === 'object' || node.kind === 'array';
  const text = preview(node);
  const long = node.kind === 'string' && text.length > maxStringLength;
  const shown = long ? `${text.slice(0, maxStringLength)}...` : text;
  const id = React.useId();
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.target !== e.currentTarget) return;
    if (isCopyKey(e)) void copyText(e.altKey ? node.path : valueText(node.value));
    else if (long && (e.key === ' ' || e.key === (full ? 'ArrowLeft' : 'ArrowRight'))) {
      e.preventDefault();
      setFull((f) => !f);
    }
  };
  return (
    <>
      <NavRow
        depth={depth}
        expanded={branch ? open : undefined}
        onToggle={onToggle}
        onClick={branch ? onToggle : undefined}
        onKeyDown={onKeyDown}
        aria-labelledby={[node.key === null ? '' : `${id}-k`, `${id}-v`, long ? `${id}-more` : '']
          .filter(Boolean)
          .join(' ')}
        data-path={node.path}
        data-kind={node.kind}
        data-match={matched || undefined}
        className="group/data"
      >
        <span className="flex min-w-0 items-baseline gap-1.5">
          {node.key !== null && (
            <span id={`${id}-k`} className="shrink-0 text-ui text-foreground">
              {highlightText(String(node.key), highlight)}
              <span className="text-muted-foreground">:</span>
            </span>
          )}
          <span
            id={`${id}-v`}
            className={cn('min-w-0 truncate font-mono text-xs', TONE[node.kind])}
          >
            {branch ? shown : highlightText(shown, highlight)}
          </span>
          {long && (
            <button
              id={`${id}-more`}
              type="button"
              tabIndex={-1}
              aria-expanded={full}
              aria-controls={`${id}-full`}
              onClick={(e) => {
                e.stopPropagation();
                setFull((f) => !f);
              }}
              className="shrink-0 rounded-md px-1 text-2xs text-muted-foreground hover:bg-background hover:text-foreground"
            >
              {/* Visible text stays inside the name, so the row name contains its visible label. */}
              {full ? (
                'Less'
              ) : (
                <>
                  +{String(text.length - maxStringLength)}{' '}
                  <span className="sr-only">more characters</span>
                </>
              )}
            </button>
          )}
          <span className="ml-auto flex shrink-0 gap-0.5 self-center opacity-0 transition-opacity duration-fast group-hover/data:opacity-100 group-focus/data:opacity-100 motion-reduce:transition-none">
            <LazyCopy get={() => node.path} label="Copy path" />
            <LazyCopy get={() => valueText(node.value)} label="Copy value" />
          </span>
        </span>
      </NavRow>
      {long && full && (
        <div
          id={`${id}-full`}
          className="ml-8 mr-2 mb-1 rounded-md bg-muted/40 px-2 py-1 font-mono text-xs break-all whitespace-pre-wrap text-success"
          style={{ marginLeft: `${String(2 + depth * 0.875)}rem` }}
          data-slot="data-tree-full"
        >
          {highlightText(node.value as string, highlight)}
        </div>
      )}
    </>
  );
};
