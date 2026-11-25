import { describe, expect, it } from 'vitest';
import { sortRows } from './data-table.state';

const cols = [{ key: 'k', header: 'K' }];
const data = [{ k: 2 }, { k: null }, { k: 1 }];

describe('sortRows', () => {
  it('keeps empty cells last in both directions', () => {
    const run = (direction: 'asc' | 'desc'): (number | null)[] =>
      sortRows(data, cols, { key: 'k', direction }).map((r) => r.k);
    expect(run('asc')).toEqual([1, 2, null]);
    expect(run('desc')).toEqual([2, 1, null]);
  });
});
