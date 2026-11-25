'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { selectIndicatorVariants, selectOptionVariants } from './select.variants';
import type { SelectOption } from './select';

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

export const chevronProps = { ...iconProps, width: 14, height: 14 } as const;

export interface SelectItemProps {
  id: string;
  option: SelectOption;
  active: boolean;
  selected: boolean;
  onPick: () => void;
}

/** One 28 px option: a check when picked, the label and an optional description. */
export const SelectItem = ({ id, option, active, selected, onPick }: SelectItemProps) => (
  <button
    id={id}
    type="button"
    role="option"
    aria-selected={selected}
    tabIndex={-1}
    disabled={option.disabled}
    onClick={onPick}
    className={cn(selectOptionVariants({ active, selected, disabled: option.disabled }))}
  >
    <span className={cn(selectIndicatorVariants({ selected }))}>
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

export interface SelectTriggerProps {
  open: boolean;
  listId: string;
  disabled: boolean;
  invalid: boolean;
  placeholder: string;
  empty: boolean;
  field: FieldAttrs;
  onClick: () => void;
  onKeyDown: React.KeyboardEventHandler<HTMLButtonElement>;
  className: string;
  children: React.ReactNode;
}

/** A button with role combobox, so a label, hint and required reach it. */
export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      open,
      listId,
      disabled,
      invalid,
      placeholder,
      empty,
      field,
      onClick,
      onKeyDown,
      className,
      children,
    },
    ref
  ) => {
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
        onKeyDown={onKeyDown}
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
        <span className={cn('min-w-0 flex-1 truncate text-left', empty && 'text-muted-foreground')}>
          {children}
        </span>
        <svg {...chevronProps} className="shrink-0 text-muted-foreground">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';
