import { Children, cloneElement, forwardRef, isValidElement, useId } from 'react';
import { cn } from '../lib/utils';
import { SettledPreview } from './form-field.live';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Live result of the value under the control, for example a computed summary of the entered value. */
  preview?: React.ReactNode;
  required?: boolean;
  /** `row`: a 150 px label column beside the control, stacking below 560 px of container width. */
  layout?: 'stack' | 'row';
  children: React.ReactNode;
}

type ControlProps = {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean;
};

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      error,
      hint,
      preview,
      required,
      layout = 'stack',
      children,
      className,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const fieldId = providedId ?? generatedId;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;
    const previewId = `${fieldId}-preview`;
    const describedBy =
      [error ? errorId : hint ? hintId : '', preview ? previewId : ''].filter(Boolean).join(' ') ||
      undefined;

    const kids = Children.toArray(children);
    const firstControl = kids.find((c) => isValidElement<ControlProps>(c));
    const controlId =
      (isValidElement<ControlProps>(firstControl) ? firstControl.props.id : undefined) ?? fieldId;

    // Only the first element child is the control; later children stay untouched.
    const control = kids.map((child) => {
      if (!isValidElement<ControlProps>(child) || child !== firstControl) return child;
      return cloneElement(child, {
        id: controlId,
        'aria-describedby': child.props['aria-describedby'] ?? describedBy,
        'aria-invalid': child.props['aria-invalid'] ?? (error ? true : undefined),
        'aria-required': child.props['aria-required'] ?? (required || undefined),
      });
    });

    const labelEl = (
      <label
        htmlFor={controlId}
        className={cn(
          'block cursor-pointer text-muted-foreground',
          layout === 'row' ? 'text-ui @[560px]:leading-7.5' : 'text-xs font-medium'
        )}
      >
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
    );
    const messages = (
      <>
        {preview && (
          <div
            id={previewId}
            className="rounded-md bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground"
            data-slot="form-field-preview"
          >
            {preview}
          </div>
        )}
        {/* Always mounted: a region inserted together with its text is often not announced. */}
        <SettledPreview value={preview} />
        {error && (
          <p id={errorId} className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </>
    );

    if (layout === 'row') {
      return (
        <div
          ref={ref}
          className={cn('@container', className)}
          data-slot="form-field"
          data-layout="row"
          {...props}
        >
          <div className="grid grid-cols-1 items-start gap-1 @[560px]:grid-cols-[150px_minmax(0,1fr)] @[560px]:gap-x-4">
            {labelEl}
            <div className="min-w-0 space-y-1">
              {control}
              {messages}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-1.5', className)} data-slot="form-field" {...props}>
        {labelEl}
        {control}
        {messages}
      </div>
    );
  }
);
FormField.displayName = 'FormField';
