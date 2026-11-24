import { describe, expect, it } from 'vitest';
import { compareValues, nextSortState } from './table-sort';

describe('compareValues', () => {
  it('sorts empty values after real ones', () => {
    expect(compareValues(null, 'a')).toBeGreaterThan(0);
    expect(compareValues('a', undefined)).toBeLessThan(0);
    expect(compareValues('', 'a')).toBeGreaterThan(0);
    expect(compareValues(null, undefined)).toBe(0);
  });

  it('compares numbers, dates and booleans numerically', () => {
    expect(compareValues(2, 10)).toBeLessThan(0);
    expect(compareValues(new Date(2026, 0, 2), new Date(2026, 0, 1))).toBeGreaterThan(0);
    expect(compareValues(true, false)).toBeGreaterThan(0);
  });

  it('compares strings with natural numbers, ignoring case', () => {
    expect(compareValues('item 2', 'item 10')).toBeLessThan(0);
    expect(compareValues('Apple', 'apple')).toBe(0);
    expect(compareValues('a', NaN)).not.toBeNaN();
  });
});

describe('compareValues direction', () => {
  it('reverses real values but keeps empties last', () => {
    const sorted = (dir: 'asc' | 'desc'): (number | null)[] =>
      [2, null, 1, 3].sort((a, b) => compareValues(a, b, dir));
    expect(sorted('asc')).toEqual([1, 2, 3, null]);
    expect(sorted('desc')).toEqual([3, 2, 1, null]);
    expect(compareValues('a', 'b', 'desc')).toBeGreaterThan(0);
    expect(compareValues('', 'b', 'desc')).toBeGreaterThan(0);
  });
});

describe('nextSortState', () => {
  it('cycles unsorted, ascending, descending, unsorted', () => {
    const asc = nextSortState(null, 'name');
    expect(asc).toEqual({ key: 'name', direction: 'asc' });
    const desc = nextSortState(asc, 'name');
    expect(desc).toEqual({ key: 'name', direction: 'desc' });
    expect(nextSortState(desc, 'name')).toBeNull();
  });

  it('starts ascending when another column was sorted', () => {
    expect(nextSortState({ key: 'a', direction: 'desc' }, 'b')).toEqual({
      key: 'b',
      direction: 'asc',
    });
  });
});
