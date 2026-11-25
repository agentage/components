'use client';

import * as React from 'react';
import { GroupHeader } from './group-header';

export interface GroupHeadRowProps {
  groupKey: string;
  columnCount: number;
  expanded: boolean;
  count: number;
  onToggle: () => void;
  /** Leading 14 px glyph of the group value, for example a StatusGlyph. */
  icon?: React.ReactNode;
  /** Shows a 24 px "+" at the right of the header. */
  onAdd?: () => void;
  addLabel?: string;
  children?: React.ReactNode;
}

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-3.5 fill-none stroke-current stroke-2"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

/** Sticky group header row: a GroupHeader across every column, optional add button. */
export const GroupHeadRow = ({
  groupKey,
  columnCount,
  expanded,
  count,
  onToggle,
  icon,
  onAdd,
  addLabel = 'Add',
  children,
}: GroupHeadRowProps): React.JSX.Element => (
  <tr data-slot="data-table-group" data-group={groupKey}>
    <th
      colSpan={columnCount}
      scope="colgroup"
      className="sticky z-20 p-0 text-left font-semibold"
      style={{ top: 'var(--dt-head, 0px)' }}
    >
      <GroupHeader
        label={children}
        icon={icon}
        count={count}
        open={expanded}
        onOpenChange={onToggle}
        actions={
          onAdd && (
            <button
              type="button"
              aria-label={addLabel}
              title={addLabel}
              onClick={onAdd}
              className="grid size-6 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors duration-fast hover:bg-accent hover:text-foreground focus-ring"
              data-slot="data-table-group-add"
            >
              <PlusIcon />
            </button>
          )
        }
      />
    </th>
  </tr>
);
