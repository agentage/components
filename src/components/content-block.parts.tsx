'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { StatusGlyph } from './status-glyph';

export type BlockStepState = 'done' | 'active' | 'pending' | 'failed' | 'skipped';

export interface BlockStep {
  title: string;
  detail?: React.ReactNode;
  state?: BlockStepState;
}

const MARK: Record<Exclude<BlockStepState, 'pending' | 'active'>, React.ReactNode> = {
  done: <StatusGlyph shape="check" tone="success" size="md" label="Done" />,
  failed: <StatusGlyph shape="cross" tone="destructive" size="md" label="Failed" />,
  skipped: <StatusGlyph shape="dashed" tone="muted" size="md" label="Skipped" />,
};

/** Numbered steps: a 22 px number disc (or the state glyph), a bold title and a muted detail. */
export const StepsView = ({ steps }: { steps: BlockStep[] }) => (
  <ol className="m-0 flex list-none flex-col p-0 px-3" data-slot="steps-view">
    {steps.map((s, i) => {
      const state = s.state ?? 'pending';
      return (
        <li
          key={i}
          className="grid grid-cols-[22px_minmax(0,1fr)] gap-x-2.5 gap-y-0.5 border-b border-border py-2 last:border-b-0"
          data-state={state}
          aria-current={state === 'active' ? 'step' : undefined}
        >
          <span
            className={cn(
              'row-span-2 grid size-[22px] place-items-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground',
              state === 'active' && 'border-primary text-primary-emphasis',
              (state === 'done' || state === 'failed' || state === 'skipped') &&
                'border-transparent bg-transparent'
            )}
          >
            {state in MARK ? MARK[state as keyof typeof MARK] : i + 1}
          </span>
          <b
            className={cn(
              'text-ui font-semibold',
              state === 'skipped' && 'text-muted-foreground line-through'
            )}
          >
            {s.title}
          </b>
          {s.detail && <span className="text-ui text-muted-foreground">{s.detail}</span>}
        </li>
      );
    })}
  </ol>
);
