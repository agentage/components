'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import type { DataViewColumn } from './data-view.config';
import { labelOf, valueOf } from './data-view.config';
import { EntityCard } from './entity-card';

export interface CardContext<T> {
  row: T;
  columns: DataViewColumn<T>[];
  onOpen?: () => void;
  menu?: React.ReactNode;
}

const cellOf = <T,>(column: DataViewColumn<T>, row: T): React.ReactNode =>
  column.cell ? column.cell(row) : String(valueOf(column, row) ?? '');

/** Default card: the first column is the title, the next four are facts. */
export const DefaultCard = <T,>({ row, columns, onOpen, menu }: CardContext<T>) => {
  const [first, ...rest] = columns;
  return (
    <EntityCard
      title={first ? cellOf(first, row) : ''}
      name={first ? String(valueOf(first, row) ?? '') : undefined}
      facts={rest.slice(0, 4).map((c) => ({ label: labelOf(c), value: cellOf(c, row) }))}
      onOpen={onOpen}
      menu={menu}
    />
  );
};

export interface CardsViewProps<T> {
  rows: T[];
  getRowId: (row: T) => string;
  renderCard: (row: T) => React.ReactNode;
}

/** Card grid; one flat keyed list so cards keep their nodes across filter and sort. */
export const CardsView = <T,>({ rows, getRowId, renderCard }: CardsViewProps<T>) => (
  <div
    className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3 p-4"
    data-slot="data-view-cards"
  >
    {rows.map((row) => (
      <React.Fragment key={getRowId(row)}>{renderCard(row)}</React.Fragment>
    ))}
  </div>
);

export const ResultCount = ({ shown, total }: { shown: number; total: number }) => (
  <span
    className={cn(
      'min-w-[4.5rem] text-right text-xs tabular-nums text-muted-foreground group-data-[fit-labels]/list-toolbar:hidden'
    )}
    data-slot="data-view-count"
  >
    {shown === total ? `${String(total)} items` : `${String(shown)} of ${String(total)}`}
  </span>
);
