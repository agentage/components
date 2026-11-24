'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { useOverlayLayer } from '../lib/overlay-layer';
import { useControlled } from '../lib/use-controlled';
import { cn } from '../lib/utils';
import { selectTriggerVariants } from './select.variants';

const POINTS = { down: '6 9 12 15 18 9', up: '18 15 12 9 6 15', check: '20 6 9 17 4 12' };

type SelectIconProps = { points: string; className?: string };

const SelectIcon = ({ points, className }: SelectIconProps): React.JSX.Element => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <polyline points={points} />
  </svg>
);

export { selectTriggerVariants } from './select.variants';

const SelectOpenContext = React.createContext(false);

/** Radix Root that also tells SelectContent when it is open, for the shared layer stack. */
export const Select = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>): React.JSX.Element => {
  const [open, setOpen] = useControlled(openProp, defaultOpen, onOpenChange);
  return (
    <SelectOpenContext.Provider value={open}>
      <SelectPrimitive.Root {...props} open={open} onOpenChange={setOpen} />
    </SelectOpenContext.Provider>
  );
};
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> {
  /** @deprecated Use `size="sm"`. */
  compact?: boolean;
  /** Form-input height: md 30 px (default), sm 26 px. */
  size?: 'sm' | 'md';
  error?: boolean;
}

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, compact = false, size, error = false, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    data-compact={compact || undefined}
    aria-invalid={error || undefined}
    className={cn(selectTriggerVariants({ size, compact, error, className }))}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <SelectIcon points={POINTS.down} className="shrink-0 text-muted-foreground" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

export const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1 text-muted-foreground',
      className
    )}
    {...props}
  >
    <SelectIcon points={POINTS.up} />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = 'SelectScrollUpButton';

export const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1 text-muted-foreground',
      className
    )}
    {...props}
  >
    <SelectIcon points={POINTS.down} />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = 'SelectScrollDownButton';

// Radix can miss the ref reset on close, so the Root's open state drives the layer.
const useSelectLayer = (ref: React.ForwardedRef<HTMLDivElement>) => {
  const node = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => node.current as HTMLDivElement);
  useOverlayLayer(React.useContext(SelectOpenContext), { refs: [node], modal: true });
  return node;
};

// axe aria-hidden-focus on #root while open is an artefact: Radix traps focus in the listbox.
export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => {
  const layerRef = useSelectLayer(ref);
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={layerRef}
        position={position}
        className={cn(
          'relative z-[var(--z-dropdown,100)] max-h-96 min-w-[var(--radix-select-trigger-width)] overflow-hidden',
          'rounded-lg border border-border bg-popover text-popover-foreground shadow-[var(--shadow-popover)]',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'min-w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)]'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = 'SelectContent';

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)}
    {...props}
  />
));
SelectLabel.displayName = 'SelectLabel';

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center justify-start gap-2',
      'h-7 rounded-md px-2 text-left text-ui text-popover-foreground transition-colors outline-none',
      'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:font-medium',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>
      <span className="flex items-center gap-2 truncate text-left">{children}</span>
    </SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="ml-auto flex size-3.5 shrink-0 items-center justify-center">
      <SelectIcon points={POINTS.check} className="text-primary-emphasis" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
));
SelectSeparator.displayName = 'SelectSeparator';
