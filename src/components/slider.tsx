'use client';

import { forwardRef, useCallback, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const sliderVariants = cva(
  [
    'group relative flex h-5 w-full touch-none select-none items-center cursor-pointer',
    'outline-none',
  ],
  {
    variants: {
      disabled: { true: 'opacity-50 cursor-not-allowed', false: '' },
    },
    defaultVariants: { disabled: false },
  }
);

export const sliderThumbVariants = cva(
  [
    'pointer-events-none absolute size-4 rounded-full border-2 border-primary bg-foreground',
    'group-focus-ring',
  ],
  {
    variants: {
      disabled: { true: '', false: 'group-hover:scale-110' },
      error: { true: 'border-destructive', false: '' },
    },
    defaultVariants: { disabled: false, error: false },
  }
);

type SliderOwnHandlers =
  'onKeyDown' | 'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onPointerCancel';

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, SliderOwnHandlers> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  error?: boolean;
}

const PAGE_STEPS = 10;

const decimalsOf = (n: number): number => {
  const [, fraction = ''] = String(n).split('.');
  return fraction.length;
};

/** Nearest point of the step grid anchored at `min`, or `max` itself when that is nearer; no float noise. */
const snapToStep = (raw: number, min: number, max: number, step: number): number => {
  const clamped = Math.min(max, Math.max(min, raw));
  if (!(step > 0)) return clamped;
  let stepped = min + Math.round((clamped - min) / step) * step;
  if (stepped > max) stepped -= step;
  if (max - clamped < clamped - stepped) return max;
  return Number(stepped.toFixed(Math.max(decimalsOf(step), decimalsOf(min))));
};

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      disabled = false,
      error = false,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = controlledValue ?? internalValue;
    const trackRef = useRef<HTMLDivElement | null>(null);
    const draggingRef = useRef(false);

    const setRefs = (node: HTMLDivElement | null): void => {
      trackRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;

    const commit = useCallback(
      (next: number) => {
        setInternalValue(next);
        onValueChange?.(next);
      },
      [onValueChange]
    );

    const computeValue = useCallback(
      (clientX: number) => {
        if (!trackRef.current || disabled) return;
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        commit(snapToStep(min + ratio * (max - min), min, max, step));
      },
      [min, max, step, disabled, commit]
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
      if (disabled) return;
      e.preventDefault();
      e.currentTarget.focus();
      e.currentTarget.setPointerCapture?.(e.pointerId);
      draggingRef.current = true;
      computeValue(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
      if (!draggingRef.current) return;
      computeValue(e.clientX);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (disabled) return;
      let next = value;
      const by = (delta: number) => snapToStep(value + delta, min, max, step);
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = by(step);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = by(-step);
      else if (e.key === 'PageUp') next = by(step * PAGE_STEPS);
      else if (e.key === 'PageDown') next = by(-step * PAGE_STEPS);
      else if (e.key === 'Home') next = min;
      else if (e.key === 'End') next = max;
      else return;
      e.preventDefault();
      commit(next);
    };

    return (
      <div
        ref={setRefs}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
        aria-invalid={error || undefined}
        aria-orientation="horizontal"
        tabIndex={disabled ? -1 : 0}
        className={cn(sliderVariants({ disabled, className }))}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        data-slot="slider"
        {...props}
      >
        <div className="relative h-1.5 w-full rounded-full bg-muted">
          <div
            className="absolute h-full rounded-full bg-primary"
            style={{ width: `${String(percentage)}%` }}
          />
        </div>
        <div
          aria-hidden="true"
          data-slot="slider-thumb"
          className={cn(sliderThumbVariants({ disabled, error }))}
          style={{ left: `calc(${String(percentage)}% - 8px)` }}
        />
      </div>
    );
  }
);
Slider.displayName = 'Slider';
