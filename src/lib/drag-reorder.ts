/** Pure geometry and keyboard rules behind `useDragReorder`. */
export interface DragGroup {
  key: string;
  /** Swimlane key when groups repeat per row. */
  row?: string;
  ids: string[];
}

export interface DragMove {
  id: string;
  toGroup: string;
  /** Index in the target group once the moved item is taken out of its old place. */
  toIndex: number;
  toRow?: string;
}

export interface DropTarget extends Omit<DragMove, 'id'> {
  /** Insertion line, in px relative to the root. */
  line: { left: number; top: number; width: number };
}

const esc = (v: string): string => (typeof CSS !== 'undefined' ? CSS.escape(v) : v);

const groupEl = (root: HTMLElement, g: DragGroup): HTMLElement | null =>
  root.querySelector<HTMLElement>(
    `[data-drop-group="${esc(g.key)}"][data-drop-row="${esc(g.row ?? '')}"]`
  );

const inside = (r: DOMRect, x: number, y: number): boolean =>
  x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;

/** The group under the pointer and the insertion index by item midpoints. */
export const dropAt = (
  root: HTMLElement,
  groups: DragGroup[],
  id: string,
  x: number,
  y: number
): DropTarget | null => {
  const origin = root.getBoundingClientRect();
  for (const g of groups) {
    const el = groupEl(root, g);
    const box = el?.getBoundingClientRect();
    if (!box || !inside(box, x, y)) continue;
    const rects = g.ids
      .filter((i) => i !== id)
      .map((i) => root.querySelector(`[data-drag-id="${esc(i)}"]`)?.getBoundingClientRect())
      .filter((r): r is DOMRect => r !== undefined);
    const index = rects.findIndex((r) => r.top + r.height / 2 > y);
    const toIndex = index < 0 ? rects.length : index;
    const at = rects[toIndex];
    const last = rects[rects.length - 1];
    const top = at ? at.top - 4 : last ? last.bottom + 4 : box.top + 6;
    return {
      toGroup: g.key,
      toRow: g.row,
      toIndex,
      line: { left: box.left - origin.left + 6, top: top - origin.top, width: box.width - 12 },
    };
  }
  return null;
};

/** Alt + arrows: Up and Down inside the group, Left and Right to the next group in the row. */
export const keyMove = (
  groups: DragGroup[],
  id: string,
  key: string
): { move: DragMove; total: number } | null => {
  const from = groups.findIndex((g) => g.ids.includes(id));
  const g = groups[from];
  if (!g) return null;
  const index = g.ids.indexOf(id);
  const same = (i: number) => ({
    move: { id, toGroup: g.key, toRow: g.row, toIndex: i },
    total: g.ids.length,
  });
  if (key === 'ArrowUp') return index > 0 ? same(index - 1) : null;
  if (key === 'ArrowDown') return index < g.ids.length - 1 ? same(index + 1) : null;
  if (key !== 'ArrowLeft' && key !== 'ArrowRight') return null;
  const lane = groups.filter((x) => (x.row ?? '') === (g.row ?? ''));
  const next = lane[lane.indexOf(g) + (key === 'ArrowLeft' ? -1 : 1)];
  if (!next) return null;
  const toIndex = Math.min(index, next.ids.length);
  return { move: { id, toGroup: next.key, toRow: next.row, toIndex }, total: next.ids.length + 1 };
};

export const sameTarget = (a: DropTarget | null, b: DropTarget | null): boolean =>
  a === b ||
  (a !== null &&
    b !== null &&
    a.toGroup === b.toGroup &&
    a.toRow === b.toRow &&
    a.toIndex === b.toIndex &&
    a.line.top === b.line.top &&
    a.line.left === b.line.left);

/** A fixed copy of the card under the pointer; ids are stripped so the document keeps them unique. */
export const makeGhost = (source: HTMLElement, box: DOMRect): HTMLElement => {
  const ghost = source.cloneNode(true) as HTMLElement;
  for (const el of [ghost, ...ghost.querySelectorAll<HTMLElement>('[id], [for]')]) {
    el.removeAttribute('id');
    el.removeAttribute('for');
  }
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${String(box.left)}px`,
    top: `${String(box.top)}px`,
    width: `${String(box.width)}px`,
    margin: '0',
    pointerEvents: 'none',
    zIndex: '60',
    opacity: '1',
  });
  ghost.setAttribute('aria-hidden', 'true');
  ghost.removeAttribute('data-drag-id');
  ghost.dataset.slot = 'drag-ghost';
  return ghost;
};
