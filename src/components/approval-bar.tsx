'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { useControlled } from '../lib/use-controlled';
import { Button } from './button';

export type ApprovalDecision = 'once' | 'session' | 'always' | 'skip';

const CHOICES: [ApprovalDecision, string][] = [
  ['once', 'Allow once'],
  ['session', 'Allow in this session'],
  ['always', 'Always allow'],
  ['skip', 'Skip'],
];

export interface ApprovalBarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue'
> {
  /** The decision. Once set, the four buttons stay in place, disabled, with the choice marked. */
  value?: ApprovalDecision | null;
  defaultValue?: ApprovalDecision | null;
  onValueChange?: (value: ApprovalDecision) => void;
}

/**
 * Asks to run one tool call: Allow once, Allow in this session, Always allow or Skip.
 * `children` is the line above the buttons that says what the call will do.
 */
export const ApprovalBar = React.forwardRef<HTMLDivElement, ApprovalBarProps>(
  (
    { value: valueProp, defaultValue = null, onValueChange, className, children, ...props },
    ref
  ) => {
    const [value, setValue] = useControlled<ApprovalDecision | null>(
      valueProp,
      defaultValue,
      onValueChange as ((v: ApprovalDecision | null) => void) | undefined
    );
    const decided = value !== null;
    const marked = value ?? 'once';
    return (
      <div
        ref={ref}
        className={cn('@container flex min-w-0 flex-col gap-1.5', className)}
        data-slot="approval-bar"
        data-state={decided ? 'decided' : 'open'}
        {...props}
      >
        {children && (
          <div className="text-ui leading-normal text-muted-foreground [&_b]:font-semibold [&_b]:text-foreground">
            {children}
          </div>
        )}
        {/* 2 x 2 below 416 px, one row above it: Skip is never left alone on a line. */}
        <div
          role="group"
          aria-label="Approve this call"
          className="grid grid-cols-2 gap-1.5 @min-[26rem]:flex @min-[26rem]:items-center"
        >
          {CHOICES.map(([id, text]) => (
            <Button
              key={id}
              variant={id === marked ? 'default' : 'outline'}
              disabled={decided}
              aria-pressed={decided ? id === value : undefined}
              onClick={() => setValue(id)}
              className={cn(
                'border font-medium',
                id === marked ? 'border-primary disabled:opacity-100' : 'bg-transparent',
                id === 'skip' && '@min-[26rem]:ml-auto'
              )}
            >
              {text}
            </Button>
          ))}
        </div>
      </div>
    );
  }
);
ApprovalBar.displayName = 'ApprovalBar';
