'use client';

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useLayoutEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { distributeSizes, readStoredSizes, resizeAt, writeStoredSizes } from '../lib/panel-sizes';
import { isPrepaintKey, resizablePanelsVar } from '../lib/split-px';
import { cn } from '../lib/utils';
import {
  ResizableHandle,
  ResizablePanel,
  type ResizableHandleProps,
  type ResizablePanelProps,
  type ResizeDirection,
} from './resizable.parts';
import { constraintsOf, sizesForKey, type Drag } from './resizable.model';
import { resizablePanelGroupVariants } from './resizable.variants';

export { ResizableHandle, ResizablePanel } from './resizable.parts';
export type { ResizableHandleProps, ResizablePanelProps, ResizeDirection } from './resizable.parts';

export interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: ResizeDirection;
  /**
   * Persists the sizes in `localStorage` under this key, restored in the hydration commit. List
   * the key in `ResizableSplitPrepaint` (`[A-Za-z0-9._:-]`, max 64) so the server HTML paints them too.
   */
  storageKey?: string;
  onSizesChange?: (sizes: number[]) => void;
  /** `ResizablePanel`s separated by `ResizableHandle`s. */
  children: ReactNode;
}

/**
 * Percentage-sized split view. A handle only spends its delta on the two panels it
 * sits between, so panels further out keep their size.
 */
export const ResizablePanelGroup = ({
  direction = 'horizontal',
  storageKey,
  onSizesChange,
  children,
  className,
  ...props
}: ResizablePanelGroupProps): React.JSX.Element => {
  const items = Children.toArray(children).filter(isValidElement);
  const constraints = constraintsOf(
    items.filter((item) => item.type === ResizablePanel) as ReactElement<ResizablePanelProps>[]
  );
  const count = constraints.length;

  const [drag, setDrag] = useState<Drag | null>(null);
  const [seeded, setSizes] = useState<number[]>(() => distributeSizes(constraints));
  // False on the server and in the hydration render: sizes then come from the prepaint variables.
  const [restored, setRestored] = useState(false);
  // A conditional panel changes the count; until the effect reseeds, fall back to the defaults.
  const sizes = seeded.length === count ? seeded : distributeSizes(constraints);
  const uid = useId();

  // Read in the hydration commit, never during render: the server has no localStorage to match.
  useLayoutEffect(() => {
    const stored = readStoredSizes(storageKey, constraints);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSizes(stored ?? ((prev) => (prev.length === count ? prev : distributeSizes(constraints))));
    setRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reseed on count only, not on each render's constraints
  }, [storageKey, count]);
  const prepaint = !restored && isPrepaintKey(storageKey) ? resizablePanelsVar(storageKey) : null;
  const basis = (index: number): string =>
    prepaint
      ? `var(${prepaint}${String(count)}-${String(index)}, ${String(sizes[index])}%)`
      : `${String(sizes[index])}%`;

  const commit = useCallback(
    (next: number[]) => {
      setSizes(next);
      writeStoredSizes(storageKey, next);
      onSizesChange?.(next);
    },
    [storageKey, onSizesChange]
  );

  const boundsAt = (index: number): { min: number; max: number } => {
    const pair = sizes[index] + sizes[index + 1];
    return {
      min: Math.max(constraints[index].minSize, pair - constraints[index + 1].maxSize),
      max: Math.min(constraints[index].maxSize, pair - constraints[index + 1].minSize),
    };
  };

  const axisPos = (e: React.PointerEvent<HTMLDivElement>): number =>
    direction === 'horizontal' ? e.clientX : e.clientY;

  // The handle is a direct child of the group, so its parent is what the delta is measured against.
  const startDrag = (index: number, e: React.PointerEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    e.preventDefault();
    e.currentTarget.focus();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDrag({
      index,
      origin: axisPos(e),
      base: sizes,
      extent: direction === 'horizontal' ? rect.width : rect.height,
    });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!drag || drag.extent === 0) return;
    const delta = ((axisPos(e) - drag.origin) / drag.extent) * 100;
    commit(resizeAt(drag.base, constraints, drag.index, delta));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!drag) return;
    setDrag(null);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const handleKey = (index: number, e: React.KeyboardEvent<HTMLDivElement>): void => {
    const next = sizesForKey(e.key, e.shiftKey, sizes, constraints, index, boundsAt(index));
    if (!next) return;
    e.preventDefault();
    commit(next);
  };

  const panelsBefore = (position: number): number =>
    items.slice(0, position).filter((item) => item.type === ResizablePanel).length;

  const rendered = items.map((child, position) => {
    if (child.type === ResizablePanel) {
      const panel = child as ReactElement<ResizablePanelProps>;
      const index = panelsBefore(position);
      return cloneElement(panel, {
        id: panel.props.id ?? `${uid}-panel-${String(index)}`,
        style: { ...panel.props.style, flexBasis: basis(index), flexGrow: 0 },
      });
    }
    if (child.type === ResizableHandle) {
      const handle = child as ReactElement<ResizableHandleProps>;
      const index = panelsBefore(position) - 1;
      if (index < 0 || index + 1 >= count) return handle;
      const bounds = boundsAt(index);
      return cloneElement(handle, {
        direction,
        dragging: drag?.index === index,
        'aria-controls': handle.props['aria-controls'] ?? `${uid}-panel-${String(index)}`,
        'aria-label': handle.props['aria-label'] ?? 'Resize panels',
        'aria-valuenow': Math.round(sizes[index]),
        'aria-valuemin': Math.round(bounds.min),
        'aria-valuemax': Math.round(bounds.max),
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
          startDrag(index, e);
        },
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          handleKey(index, e);
        },
      });
    }
    return child;
  });

  return (
    <div
      data-slot="resizable-panel-group"
      data-direction={direction}
      className={cn(resizablePanelGroupVariants({ direction, className }))}
      {...props}
    >
      {rendered}
    </div>
  );
};
