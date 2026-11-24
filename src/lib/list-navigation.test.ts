import { describe, expect, it } from 'vitest';
import { nextListIndex } from './list-navigation';

describe('nextListIndex', () => {
  it('returns null for an empty list or a key that does not navigate', () => {
    expect(nextListIndex('ArrowDown', 0, 0)).toBeNull();
    expect(nextListIndex('a', 0, 3)).toBeNull();
  });

  it('wraps in both directions', () => {
    expect(nextListIndex('ArrowDown', 2, 3)).toBe(0);
    expect(nextListIndex('ArrowUp', 0, 3)).toBe(2);
    expect(nextListIndex('ArrowRight', 1, 3)).toBe(2);
    expect(nextListIndex('ArrowLeft', 1, 3)).toBe(0);
  });

  it('starts from the first or last item when nothing is active', () => {
    expect(nextListIndex('ArrowDown', -1, 3)).toBe(0);
    expect(nextListIndex('ArrowUp', -1, 3)).toBe(2);
  });

  it('jumps with Home and End', () => {
    expect(nextListIndex('Home', 2, 5)).toBe(0);
    expect(nextListIndex('End', 0, 5)).toBe(4);
  });

  it('leaves Left and Right alone when not horizontal', () => {
    expect(nextListIndex('ArrowLeft', 1, 3, false)).toBeNull();
    expect(nextListIndex('ArrowRight', 1, 3, false)).toBeNull();
    expect(nextListIndex('ArrowDown', 1, 3, false)).toBe(2);
  });
});
