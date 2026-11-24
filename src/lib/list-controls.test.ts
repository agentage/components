import { describe, expect, it } from 'vitest';
import { EMPTY_LIST_CONTROLS, activeFilterCount, applyListControls } from './list-controls';

interface Row {
  id: string;
  n: number | null;
}
const ROWS: Row[] = [
  { id: 'b', n: 2 },
  { id: 'x', n: null },
  { id: 'a', n: 1 },
  { id: 'c', n: 3 },
];
const config = { sorts: { n: (r: Row) => r.n } };
const ids = (dir: 'asc' | 'desc'): string[] =>
  applyListControls(ROWS, { ...EMPTY_LIST_CONTROLS, sort: { key: 'n', dir } }, config).rows.map(
    (r) => r.id
  );

describe('applyListControls sort', () => {
  it('keeps empty values last in both directions', () => {
    expect(ids('asc')).toEqual(['a', 'b', 'c', 'x']);
    expect(ids('desc')).toEqual(['c', 'b', 'a', 'x']);
  });

  it('reverses a custom comparator', () => {
    const rows = applyListControls(
      ROWS,
      { ...EMPTY_LIST_CONTROLS, sort: { key: 'id', dir: 'desc' } },
      { sorts: { id: { compare: (a: Row, b: Row) => a.id.localeCompare(b.id) } } }
    ).rows;
    expect(rows.map((r) => r.id)).toEqual(['x', 'c', 'b', 'a']);
  });
});

describe('activeFilterCount', () => {
  it('sums selected values across groups', () => {
    expect(activeFilterCount({ a: ['1', '2'], b: [], c: ['3'] })).toBe(3);
  });
});
