'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { NavRow } from './nav-tree';
import type { FlatNode, TreeSelectNode } from './tree-select.model';

const Check = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-3.5 fill-none stroke-current stroke-2 text-primary"
    aria-hidden="true"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface TreeRowsProps {
  rows: FlatNode[];
  query: string;
  expanded: Set<string>;
  picked: string[];
  disabledIds: string[];
  disabledLabel: string;
  onToggle: (id: string) => void;
  onChoose: (node: TreeSelectNode) => void;
  onFocusRow: (id: string) => void;
}

/** NavRows of the visible nodes: chosen ones carry a check, taken ones a quiet label. */
export const TreeRows = ({
  rows,
  query,
  expanded,
  picked,
  disabledIds,
  disabledLabel,
  onToggle,
  onChoose,
  onFocusRow,
}: TreeRowsProps): React.JSX.Element => (
  <>
    {rows.map(({ node, depth }) => {
      const taken = disabledIds.includes(node.id);
      const off = taken || node.disabled;
      const chosen = picked.includes(node.id);
      return (
        <NavRow
          key={node.id}
          depth={depth}
          icon={node.icon}
          selected={chosen}
          expanded={
            node.children?.length ? query.trim() !== '' || expanded.has(node.id) : undefined
          }
          onToggle={query.trim() === '' ? () => onToggle(node.id) : undefined}
          onClick={() => onChoose(node)}
          onFocus={() => onFocusRow(node.id)}
          aria-disabled={off || undefined}
          count={taken ? disabledLabel : chosen ? <Check /> : node.count}
          className={cn(
            'text-ui',
            off &&
              'cursor-default text-muted-foreground/70 hover:bg-transparent hover:text-muted-foreground/70'
          )}
          data-id={node.id}
        >
          {node.label}
        </NavRow>
      );
    })}
  </>
);

/** Open ids and a toggle; with no `initial`, every root opens once nodes first arrive. */
export const useExpanded = (
  nodes: TreeSelectNode[],
  initial?: string[]
): readonly [Set<string>, (id: string) => void] => {
  const roots = (): Set<string> => new Set(initial ?? nodes.map((n) => n.id));
  const [expanded, setExpanded] = React.useState(roots);
  const [seeded, setSeeded] = React.useState(nodes.length > 0);
  if (!seeded && nodes.length > 0) {
    setSeeded(true);
    setExpanded(roots());
  }
  const toggle = (id: string): void =>
    setExpanded((s) => {
      const next = new Set(s);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  return [expanded, toggle];
};
