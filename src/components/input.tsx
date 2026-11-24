import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { fieldVariants } from './control.variants';

const state = {
  error: { true: 'border-destructive', false: 'border-border' },
  disabled: { true: 'opacity-50 cursor-not-allowed', false: '' },
};

export const inputVariants = cva([fieldVariants({ size: null }), 'focus:bg-background'], {
  variants: {
    /** md 30 px (default), sm 26 px at 12 px. */
    size: { sm: fieldVariants({ size: 'sm' }), md: fieldVariants({ size: 'md' }) },
    mono: { true: 'font-mono', false: '' },
    ...state,
  },
  compoundVariants: [{ mono: true, size: 'md', class: 'text-xs' }],
  defaultVariants: { size: 'md', mono: false, error: false, disabled: false },
});

export const textareaVariants = cva(
  [fieldVariants({ size: null }), 'block h-auto resize-none focus:bg-background'],
  {
    variants: {
      size: {
        sm: 'px-2 py-1 text-xs leading-normal',
        md: 'px-2.5 py-1.5 text-ui leading-normal',
      },
      mono: { true: 'font-mono text-xs leading-relaxed', false: '' },
      autoGrow: { true: '[field-sizing:content]', false: '' },
      ...state,
    },
    defaultVariants: { size: 'md', mono: false, autoGrow: false, error: false, disabled: false },
  }
);

type FieldSize = NonNullable<VariantProps<typeof inputVariants>['size']>;

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean;
  /** 'sm' | 'md' sets the height (md 30 px, default); a number is the native visible character width. */
  size?: FieldSize | number;
  /** Monospace text for ids, paths and keys. */
  mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, size, mono, className, ...props }, ref) => (
    <input
      ref={ref}
      data-slot="input"
      aria-invalid={error || undefined}
      size={typeof size === 'number' ? size : undefined}
      className={cn(
        inputVariants({
          size: typeof size === 'string' ? size : undefined,
          mono,
          error,
          disabled: props.disabled,
          className,
        })
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  size?: FieldSize;
  mono?: boolean;
  /** Grow with the content (CSS field-sizing, no JS); `minRows` sets the floor. */
  autoGrow?: boolean;
  /** Minimum visible rows when `autoGrow` is on. Default 3. */
  minRows?: number;
}

const PAD_Y = { sm: 8, md: 12, lg: 16 } as const;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, size, mono, autoGrow, minRows = 3, className, style, rows, ...props }, ref) => (
    <textarea
      ref={ref}
      data-slot="textarea"
      aria-invalid={error || undefined}
      rows={rows ?? (autoGrow ? minRows : undefined)}
      style={
        autoGrow
          ? { minHeight: `calc(${minRows}lh + ${PAD_Y[size ?? 'md'] + 2}px)`, ...style }
          : style
      }
      className={cn(
        textareaVariants({ size, mono, autoGrow, error, disabled: props.disabled, className })
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
