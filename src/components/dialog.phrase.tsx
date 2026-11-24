'use client';

import { useId } from 'react';
import { cn } from '../lib/utils';
import { Input } from './input';
import { Label } from './label';

export interface DialogPhraseProps {
  phrase: string;
  value: string;
  onChange: (value: string) => void;
  confirmLabel: string;
}

/** The retype-to-confirm field of a confirm dialog, with a live match hint. */
export const DialogPhrase = ({ phrase, value, onChange, confirmLabel }: DialogPhraseProps) => {
  const uid = useId();
  const inputId = `${uid}-confirm-input`;
  const hintId = `${uid}-confirm-hint`;
  const matches = value === phrase;
  return (
    <div data-slot="dialog-phrase" className="space-y-2">
      <Label htmlFor={inputId}>
        Type <span className="font-mono font-semibold text-foreground">{phrase}</span> to confirm
      </Label>
      <Input
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        aria-describedby={hintId}
        data-slot="dialog-phrase-input"
      />
      <p
        id={hintId}
        aria-live="polite"
        className={cn('text-xs', matches ? 'text-success' : 'text-muted-foreground')}
      >
        {matches
          ? `Phrase matches - ${confirmLabel} is enabled.`
          : `Enter the exact phrase to enable ${confirmLabel}.`}
      </p>
    </div>
  );
};
