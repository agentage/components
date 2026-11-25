'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const inlineEditVariants = cva('m-0 -ml-1.5 min-w-0 max-w-full', {
  variants: {
    as: {
      h1: 'text-xl font-bold leading-tight',
      h2: 'text-base font-semibold leading-tight',
      h3: 'text-sm font-semibold leading-snug',
      text: 'text-ui leading-normal',
    },
  },
  defaultVariants: { as: 'text' },
});

// Field and mirror share one grid cell and the same box, so read and edit never shift.
const BOX = 'col-start-1 row-start-1 m-0 rounded-md border-0 px-1.5 py-px';

const FIELD = [
  BOX,
  'w-full min-w-0 resize-none overflow-hidden bg-transparent [font:inherit] [letter-spacing:inherit] text-inherit',
  'cursor-text outline-none transition-colors placeholder:text-muted-foreground',
  'hover:bg-accent focus:bg-background focus-ring',
  'disabled:cursor-default disabled:hover:bg-transparent',
].join(' ');

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

/** Passed to the field, so a FormField label, hint and error reach it. */
type FieldAttributes = Pick<
  React.InputHTMLAttributes<FieldElement>,
  'id' | 'name' | 'aria-describedby' | 'aria-invalid' | 'aria-required'
>;

export interface InlineEditProps extends FieldAttributes {
  value: string;
  /** Called on Enter (Ctrl or Cmd+Enter when multiline) and on blur, only when the text changed; Escape reverts. Focus stays in the field. */
  onCommit: (value: string) => void;
  /** Accessible name of the field, for example `Display name`. */
  label: string;
  multiline?: boolean;
  placeholder?: string;
  /** Heading level or plain text; sets the element and the type scale. */
  as?: 'h1' | 'h2' | 'h3' | 'text';
  disabled?: boolean;
  className?: string;
}

const useInlineDraft = (value: string, onCommit: (v: string) => void, multiline: boolean) => {
  const [draft, setDraft] = React.useState<string | null>(null);

  // Commit and revert happen in place, so focus stays in the field.
  const onKeyDown = (e: React.KeyboardEvent<FieldElement>): void => {
    // Safari ends IME composition with an Enter keydown that reports keyCode 229.
    if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
    const commitKey = e.key === 'Enter' && (!multiline || e.ctrlKey || e.metaKey);
    if (!commitKey && e.key !== 'Escape') return;
    e.preventDefault();
    if (draft !== null && e.key === 'Escape') e.stopPropagation();
    if (commitKey && draft !== null && draft !== value) onCommit(draft);
    setDraft(null);
  };

  // The draft exists only after an edit, so a value that changed meanwhile is never reverted.
  const onBlur = (): void => {
    if (draft !== null && draft !== value) onCommit(draft);
    setDraft(null);
  };

  return {
    text: draft ?? value,
    onChange: (e: React.ChangeEvent<FieldElement>) => setDraft(e.target.value),
    onKeyDown,
    onBlur,
  };
};

/** Text that edits in place: a real input or textarea that looks like text until hovered or focused. */
export const InlineEdit = React.forwardRef<FieldElement, InlineEditProps>(
  (
    {
      value,
      onCommit,
      label,
      multiline = false,
      placeholder,
      as = 'text',
      disabled,
      className,
      ...attrs
    },
    ref
  ) => {
    const { text, ...handlers } = useInlineDraft(value, onCommit, multiline);
    const Wrapper = as === 'text' ? 'div' : as;
    const field = {
      ...attrs,
      ...handlers,
      value: text,
      placeholder,
      disabled,
      'aria-label': label,
    };

    return (
      <Wrapper className={cn(inlineEditVariants({ as }), className)} data-slot="inline-edit">
        <span className={cn('max-w-full', multiline ? 'grid w-full' : 'inline-grid align-top')}>
          <span
            aria-hidden="true"
            className={cn(
              BOX,
              'invisible min-w-0 overflow-hidden',
              multiline ? 'whitespace-pre-wrap wrap-anywhere' : 'whitespace-pre'
            )}
          >
            {`${text || placeholder || ''} `}
          </span>
          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              {...field}
              rows={1}
              className={cn(FIELD, 'whitespace-pre-wrap wrap-anywhere')}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              {...field}
              type="text"
              className={cn(FIELD, 'text-ellipsis')}
            />
          )}
        </span>
      </Wrapper>
    );
  }
);
InlineEdit.displayName = 'InlineEdit';
