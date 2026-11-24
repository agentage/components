'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { comboboxOptionIndicatorVariants, comboboxOptionVariants } from './combobox.variants';
import type { ComboboxOption } from './combobox';

export const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export interface ComboboxItemProps {
  id: string;
  option: ComboboxOption;
  active: boolean;
  selected: boolean;
  onPick: () => void;
}

/** One 28 px option: a check when picked, the label and an optional description. */
export const ComboboxItem = ({ id, option, active, selected, onPick }: ComboboxItemProps) => (
  <button
    id={id}
    type="button"
    role="option"
    aria-selected={selected}
    tabIndex={-1}
    onClick={onPick}
    className={cn(comboboxOptionVariants({ active, selected }))}
  >
    <span className={cn(comboboxOptionIndicatorVariants({ selected }))}>
      <svg {...iconProps}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
    <div className="flex-1 text-left">
      <div>{option.label}</div>
      {option.description && (
        <div className="text-xs text-muted-foreground">{option.description}</div>
      )}
    </div>
  </button>
);

/** A label click focuses the trigger, as for a native select, instead of opening the list. */
const useLabelFocusOnly = (ref: React.RefObject<HTMLButtonElement | null>): void => {
  React.useEffect(() => {
    const onClick = (e: MouseEvent): void => {
      const el = ref.current;
      const label = e.target instanceof Element ? e.target.closest('label') : null;
      if (!el || !label || label.control !== el || el.contains(e.target as Node)) return;
      e.preventDefault();
      el.focus();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [ref]);
};

type FieldAttrs = Pick<
  React.HTMLAttributes<HTMLElement>,
  'id' | 'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'aria-invalid' | 'aria-required'
>;

/** FormField passes these to its child: they belong on the focusable trigger, not the root. */
export const splitField = <P extends FieldAttrs>(
  props: P
): [FieldAttrs, Omit<P, keyof FieldAttrs>] => {
  const {
    id,
    'aria-label': l,
    'aria-labelledby': lb,
    'aria-describedby': d,
    'aria-invalid': inv,
    'aria-required': req,
    ...rest
  } = props;
  const field = { id, 'aria-label': l, 'aria-labelledby': lb, 'aria-describedby': d };
  return [{ ...field, 'aria-invalid': inv, 'aria-required': req }, rest];
};

export interface ComboboxTriggerProps {
  open: boolean;
  listId: string;
  disabled: boolean;
  invalid: boolean;
  placeholder: string;
  field: FieldAttrs;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}

/** The select-only combobox: a button with role combobox, so a label, hint and required reach it. */
export const ComboboxTrigger = React.forwardRef<HTMLButtonElement, ComboboxTriggerProps>(
  ({ open, listId, disabled, invalid, placeholder, field, onClick, className, children }, ref) => {
    // A combobox takes no name from its content: without a label, the placeholder names it.
    const unnamed = !field.id && !field['aria-label'] && !field['aria-labelledby'];
    const fieldInvalid = field['aria-invalid'] === true || field['aria-invalid'] === 'true';
    const inner = React.useRef<HTMLButtonElement>(null);
    React.useImperativeHandle(ref, () => inner.current as HTMLButtonElement);
    useLabelFocusOnly(inner);
    return (
      <button
        ref={inner}
        id={field.id}
        type="button"
        role="combobox"
        disabled={disabled}
        onClick={onClick}
        aria-label={field['aria-label'] ?? (unnamed ? placeholder : undefined)}
        aria-labelledby={field['aria-labelledby']}
        aria-describedby={field['aria-describedby']}
        aria-required={field['aria-required']}
        aria-invalid={invalid || fieldInvalid || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        className={className}
      >
        <span className="truncate">{children}</span>
        <svg {...iconProps}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    );
  }
);
ComboboxTrigger.displayName = 'ComboboxTrigger';
