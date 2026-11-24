'use client';

import * as React from 'react';

type NodeRef = React.RefObject<HTMLElement | null>;

export interface OverlayLayer {
  parent: OverlayLayer | null;
  /** Latest options; read at event time so callers may pass fresh closures each render. */
  options: React.RefObject<OverlayLayerOptions>;
}

export interface OverlayLayerOptions {
  /** Nodes that count as inside the layer: its trigger wrapper and its surface. */
  refs: readonly NodeRef[];
  /** Escape while this is the top layer. Without it Escape does nothing for this layer. */
  onEscape?: () => void;
  /** A pointer press outside this layer and every layer opened from inside it. */
  onOutside?: () => void;
  /** Blocks the page: while it is on top, a press outside it reaches no layer below it. */
  modal?: boolean;
}

const stack: OverlayLayer[] = [];
const LayerContext = React.createContext<OverlayLayer | null>(null);

const isAncestor = (layer: OverlayLayer, of: OverlayLayer): boolean => {
  for (let p = of.parent; p; p = p.parent) if (p === layer) return true;
  return false;
};

/** The open layer with no open child layer; the latest opened wins among siblings. */
export const topLayer = (): OverlayLayer | undefined =>
  [...stack].reverse().find((l) => !stack.some((o) => o !== l && isAncestor(l, o)));

export const isTopLayer = (layer: OverlayLayer): boolean => topLayer() === layer;

const inside = (layer: OverlayLayer, target: Node): boolean =>
  stack.some(
    (l) =>
      (l === layer || isAncestor(layer, l)) &&
      l.options.current.refs.some((ref) => ref.current?.contains(target))
  );

const onKeyDown = (e: KeyboardEvent): void => {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  const top = topLayer();
  if (!top) return;
  e.preventDefault();
  top.options.current.onEscape?.();
};

const blocks = (target: Node): boolean => {
  const top = topLayer();
  return !!top?.options.current.modal && !inside(top, target);
};

// A modal layer (Radix Select) may close on pointerdown, before this press reaches mousedown.
let blockedPress: EventTarget | null = null;
const onPress = (e: PointerEvent): void => {
  blockedPress = blocks(e.target as Node) ? e.target : null;
};

const onPointerDown = (e: MouseEvent): void => {
  const target = e.target as Node;
  const blocked = blockedPress === e.target || blocks(target);
  blockedPress = null;
  if (blocked) return;
  for (const layer of [...stack])
    if (layer.options.current.onOutside && !inside(layer, target))
      layer.options.current.onOutside();
};

const push = (layer: OverlayLayer): void => {
  if (stack.length === 0) {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPress, true);
    document.addEventListener('mousedown', onPointerDown);
  }
  stack.push(layer);
};

const pop = (layer: OverlayLayer): void => {
  const i = stack.indexOf(layer);
  if (i >= 0) stack.splice(i, 1);
  if (stack.length === 0) {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('pointerdown', onPress, true);
    document.removeEventListener('mousedown', onPointerDown);
    blockedPress = null;
  }
};

/**
 * Registers an open overlay in the shared layer stack: Escape reaches only the top layer, and a
 * press inside a child layer's portal never counts as outside its parents.
 */
export const useOverlayLayer = (open: boolean, options: OverlayLayerOptions): OverlayLayer => {
  const parent = React.useContext(LayerContext);
  const optionsRef = React.useRef(options);
  React.useLayoutEffect(() => {
    optionsRef.current = options;
  });
  const layer = React.useMemo<OverlayLayer>(() => ({ parent, options: optionsRef }), [parent]);
  React.useLayoutEffect(() => {
    if (!open) return;
    push(layer);
    return () => pop(layer);
  }, [open, layer]);
  return layer;
};

/** Wrap a layer's surface so overlays opened inside it nest under it. */
export const OverlayLayerProvider = ({
  layer,
  children,
}: {
  layer: OverlayLayer;
  children: React.ReactNode;
}): React.JSX.Element => React.createElement(LayerContext.Provider, { value: layer }, children);
