import type * as React from 'react';

export interface TreeSelectNode {
  id: string;
  label: string;
  children?: TreeSelectNode[];
  icon?: React.ReactNode;
  /** Quiet trailing number, for example the items inside. */
  count?: number;
  /** Not pickable, for example a root that only groups. */
  disabled?: boolean;
}

export interface FlatNode {
  node: TreeSelectNode;
  depth: number;
  path: TreeSelectNode[];
}

/** Visible rows in order: children of collapsed nodes are skipped; a query keeps matches and their ancestors. */
export const visibleRows = (
  nodes: TreeSelectNode[],
  expanded: Set<string>,
  query: string
): FlatNode[] => {
  const q = query.trim().toLowerCase();
  const out: FlatNode[] = [];
  const keep = new Set<string>();
  const mark = (n: TreeSelectNode): boolean => {
    const self = n.label.toLowerCase().includes(q);
    const below = (n.children ?? []).map(mark).some(Boolean);
    if (self || below) keep.add(n.id);
    return self || below;
  };
  if (q) nodes.forEach(mark);
  const walk = (list: TreeSelectNode[], depth: number, path: TreeSelectNode[]): void => {
    for (const node of list) {
      if (q && !keep.has(node.id)) continue;
      out.push({ node, depth, path: [...path, node] });
      if (node.children && (q || expanded.has(node.id)))
        walk(node.children, depth + 1, [...path, node]);
    }
  };
  walk(nodes, 0, []);
  return out;
};

export const findPath = (nodes: TreeSelectNode[], id: string): TreeSelectNode[] => {
  for (const n of nodes) {
    if (n.id === id) return [n];
    const sub = findPath(n.children ?? [], id);
    if (sub.length) return [n, ...sub];
  }
  return [];
};

/** "root / folder/sub/": the root, then the other labels joined with one slash between them. */
export const defaultPath = (path: TreeSelectNode[]): string => {
  if (path.length <= 1) return path[0]?.label ?? '';
  const rest = path
    .slice(1)
    .reduce((a, n) => (a === '' || a.endsWith('/') ? a : `${a}/`) + n.label, '');
  return `${path[0].label} / ${rest}`;
};
