'use client';

import { Count } from './count';
import { DisclosureChevron } from './disclosure';
import { GroupHeader } from './group-header';
import { IconButton } from './icon-button';
import type { BoardGroup } from './data-view.board';

const Plus = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export interface BoardColumnHeadProps {
  column: BoardGroup;
  index: number;
  count: number;
  collapsed: boolean;
  /** Grid line after the last card row, so a folded strip spans the full height. */
  rowEnd: number;
  onToggle: () => void;
  onAdd?: (key: string) => void;
}

const STRIP =
  'sticky top-0 z-10 flex flex-col items-center gap-2 rounded-lg bg-muted/40 py-2 text-ui font-semibold transition-colors duration-fast hover:bg-accent focus-ring';

/** A column header: a GroupHeader with count and add, or a 40 px vertical strip when collapsed. */
export const BoardColumnHead = ({
  column,
  index,
  count,
  collapsed,
  rowEnd,
  onToggle,
  onAdd,
}: BoardColumnHeadProps) => {
  const label = typeof column.label === 'string' ? column.label : column.key;
  if (collapsed)
    return (
      <button
        type="button"
        aria-expanded={false}
        aria-label={`${label}, ${String(count)}, expand column`}
        onClick={onToggle}
        className={STRIP}
        style={{ gridColumn: index + 1, gridRow: `1 / ${String(rowEnd)}` }}
        data-slot="board-strip"
      >
        <DisclosureChevron open={false} />
        {column.icon && (
          <span className="flex text-muted-foreground [&_svg]:size-3.5">{column.icon}</span>
        )}
        <span className="[writing-mode:vertical-rl]">{column.label}</span>
        <Count>{count}</Count>
      </button>
    );
  return (
    <GroupHeader
      label={column.label}
      icon={column.icon}
      count={count}
      open
      onOpenChange={onToggle}
      level={3}
      sticky
      className="rounded-lg border-0 bg-background"
      style={{ gridColumn: index + 1, gridRow: 1 }}
      actions={
        onAdd && (
          <IconButton
            size="sm"
            icon={<Plus />}
            aria-label={`Add to ${label}`}
            onClick={() => onAdd(column.key)}
          />
        )
      }
    />
  );
};
