import type { ReactElement } from 'react';
import { resizeAt, setSizeAt, type PanelConstraint } from '../lib/panel-sizes';
import type { ResizablePanelProps } from './resizable.parts';

export interface Drag {
  index: number;
  origin: number;
  base: number[];
  extent: number;
}

export const KEY_STEP = 2;
export const SHIFT_STEP = 10;

export const constraintsOf = (panels: ReactElement<ResizablePanelProps>[]): PanelConstraint[] =>
  panels.map(({ props }) => ({
    defaultSize: props.defaultSize,
    minSize: props.minSize ?? 10,
    maxSize: props.maxSize ?? 100,
  }));

/** Sizes after a keyboard step on handle `index`, or null when the key does not resize. */
export const sizesForKey = (
  key: string,
  shift: boolean,
  sizes: number[],
  constraints: PanelConstraint[],
  index: number,
  bounds: { min: number; max: number }
): number[] | null => {
  const step = shift ? SHIFT_STEP : KEY_STEP;
  if (key === 'ArrowRight' || key === 'ArrowDown') return resizeAt(sizes, constraints, index, step);
  if (key === 'ArrowLeft' || key === 'ArrowUp') return resizeAt(sizes, constraints, index, -step);
  if (key === 'Home') return setSizeAt(sizes, constraints, index, bounds.min);
  if (key === 'End') return setSizeAt(sizes, constraints, index, bounds.max);
  return null;
};
