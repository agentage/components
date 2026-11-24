'use client';

import * as React from 'react';
import { useControlled } from '../lib/use-controlled';
import { cn } from '../lib/utils';
import { Button } from './button';
import { fieldVariants } from './control.variants';
import { IconButton } from './icon-button';
import { Input, type InputProps } from './input';

const Eye = ({ off }: { off?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M3 3l18 18" />}
  </svg>
);

export interface SecretInputProps extends Omit<
  InputProps,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'size'
> {
  /** Field height: md 30 px (default), sm 26 px. */
  size?: 'sm' | 'md';
  /**
   * The unsaved draft. A stored secret never comes back to the client, so it is never a value
   * here: a controlled parent clears it when the save lands.
   */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** A value is already stored: shows "Set" and Replace in place of the field. */
  isSet?: boolean;
  /** Last characters of the stored value, for "Set, ends with ...abcd". */
  setHint?: string;
}

/** Write-only field for keys and tokens: masked, reveal only while unsaved, set-only display. */
export const SecretInput = React.forwardRef<HTMLInputElement, SecretInputProps>(
  (
    {
      value,
      defaultValue = '',
      onValueChange,
      isSet = false,
      setHint,
      size,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [draft, setDraft] = useControlled(value, defaultValue, onValueChange);
    const [replacing, setReplacing] = React.useState(false);
    const [shown, setShown] = React.useState(false);
    const inner = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inner.current as HTMLInputElement);
    // A newly stored value ends the replace step and hides the draft again.
    const stamp = `${String(isSet)}:${setHint ?? ''}`;
    const [seen, setSeen] = React.useState(stamp);
    if (seen !== stamp) {
      setSeen(stamp);
      setReplacing(false);
      setShown(false);
    }
    // The draft is cleared after commit: it may live in the parent, which must not update mid-render.
    const first = React.useRef(true);
    const clear = React.useRef(setDraft);
    React.useLayoutEffect(() => {
      clear.current = setDraft;
    });
    React.useLayoutEffect(() => {
      if (first.current) first.current = false;
      else clear.current('');
    }, [stamp]);
    // The DOM stays uncontrolled: React would mirror a controlled value into the `value` attribute.
    React.useLayoutEffect(() => {
      if (inner.current && inner.current.value !== draft) inner.current.value = draft;
    });

    if (isSet && !replacing)
      return (
        <div
          className={cn(fieldVariants({ size }), 'flex items-center gap-2 pr-0.5', className)}
          data-slot="secret-input"
          data-state="set"
        >
          <span className="min-w-0 flex-1 truncate text-muted-foreground">
            {setHint ? `Set, ends with ...${setHint}` : 'Set'}
          </span>
          <Button
            id={props.id}
            aria-describedby={props['aria-describedby']}
            size="sm"
            variant="ghost"
            disabled={disabled}
            onClick={() => {
              setReplacing(true);
              requestAnimationFrame(() => inner.current?.focus());
            }}
          >
            Replace
          </Button>
        </div>
      );

    return (
      <div className={cn('relative', className)} data-slot="secret-input" data-state="edit">
        <Input
          ref={inner}
          type={shown ? 'text' : 'password'}
          onChange={(e) => setDraft(e.currentTarget.value)}
          autoComplete="off"
          spellCheck={false}
          mono
          size={size}
          disabled={disabled}
          className={isSet ? 'pr-24' : 'pr-9'}
          {...props}
        />
        <span className="absolute inset-y-0 right-0.5 flex items-center gap-0.5">
          <IconButton
            size="sm"
            icon={<Eye off={shown} />}
            aria-label={shown ? 'Hide value' : 'Show value'}
            pressed={shown}
            disabled={disabled || draft === ''}
            onClick={() => setShown((s) => !s)}
          />
          {isSet && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setDraft('');
                setShown(false);
                setReplacing(false);
              }}
            >
              Cancel
            </Button>
          )}
        </span>
      </div>
    );
  }
);
SecretInput.displayName = 'SecretInput';
