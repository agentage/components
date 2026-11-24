'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { DescriptionDetail, DescriptionTerm } from './description-list';
import { InlineEdit } from './inline-edit';

const PropertyContext = React.createContext<{ label: string }>({ label: '' });

/** The label of the enclosing Property, for editor accessible names ("Status: In progress"). */
export const usePropertyLabel = (): string => React.useContext(PropertyContext).label;

export interface PropertyProps {
  label: string;
  /** An editor (PropertySelect, PropertyDate, ...) or a read-only value. */
  children: React.ReactNode;
  className?: string;
}

/** One row of `<DescriptionList variant="editable">`: the label and its editor or read-only value. */
export const Property = ({ label, children, className }: PropertyProps): React.JSX.Element => (
  <PropertyContext.Provider value={{ label }}>
    <DescriptionTerm className="leading-6">{label}</DescriptionTerm>
    <DescriptionDetail className={cn('flex min-h-6 min-w-0 items-center', className)}>
      {children}
    </DescriptionDetail>
  </PropertyContext.Provider>
);

export const propertyValueClass = cn(
  '-mx-1.5 inline-flex h-6 min-w-0 max-w-[calc(100%+12px)] items-center gap-1.5 rounded-md px-1.5 text-left text-ui text-foreground transition-colors',
  'hover:bg-accent aria-expanded:bg-accent focus-ring',
  'disabled:pointer-events-none [&_svg]:shrink-0',
  'aria-expanded:[--color-muted-foreground:color-mix(in_oklab,var(--color-foreground)_72%,var(--color-accent))]'
);

export interface PropertyValueProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text read after the label, for example "In progress". */
  valueText: string;
}

/** 24 px value button (padding 0 6, radius 6) with a negative inset, so text lines up. */
export const PropertyValue = React.forwardRef<HTMLButtonElement, PropertyValueProps>(
  ({ valueText, className, children, ...props }, ref) => {
    const label = usePropertyLabel();
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label ? `${label}: ${valueText}` : valueText}
        className={cn(propertyValueClass, className)}
        data-slot="property-value"
        {...props}
      >
        {children}
      </button>
    );
  }
);
PropertyValue.displayName = 'PropertyValue';

export interface PropertyTextProps {
  value: string;
  onValueChange: (value: string) => void;
}

/** Free text that edits in place (InlineEdit); Enter commits, Esc reverts. */
export const PropertyText = ({ value, onValueChange }: PropertyTextProps) => (
  <InlineEdit
    value={value}
    onCommit={onValueChange}
    label={usePropertyLabel()}
    className="-ml-1.5 text-ui"
  />
);
