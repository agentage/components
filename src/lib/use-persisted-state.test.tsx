import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePersistedState } from './use-persisted-state';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('usePersistedState', () => {
  it('starts from the initial value without a key and never touches storage', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => usePersistedState(undefined, 'a'));
    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('b');
    expect(spy).not.toHaveBeenCalled();
  });

  it('reads a stored value on mount', () => {
    localStorage.setItem('k', JSON.stringify({ n: 2 }));
    const { result } = renderHook(() => usePersistedState('k', { n: 0 }));
    expect(result.current[0]).toEqual({ n: 2 });
  });

  it('writes every change as JSON', () => {
    const { result } = renderHook(() => usePersistedState('k', 1));
    act(() => result.current[1](5));
    expect(result.current[0]).toBe(5);
    expect(localStorage.getItem('k')).toBe('5');
  });

  it('falls back to the initial value on corrupt JSON', () => {
    localStorage.setItem('k', '{oops');
    const { result } = renderHook(() => usePersistedState('k', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('survives a throwing localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('full');
    });
    const { result } = renderHook(() => usePersistedState('k', 'x'));
    expect(result.current[0]).toBe('x');
    act(() => result.current[1]('y'));
    expect(result.current[0]).toBe('y');
  });

  it('falls back on a stored value of the wrong shape', () => {
    localStorage.setItem('k', '{}');
    const { result } = renderHook(() => usePersistedState<string[]>('k', []));
    expect(result.current[0]).toEqual([]);
    localStorage.setItem('n', '"x"');
    const check = (v: unknown): v is number => typeof v === 'number' && v > 0;
    expect(renderHook(() => usePersistedState('n', 1, check)).result.current[0]).toBe(1);
  });

  it('flags the restore frames, re-reads on a key change and follows other tabs', () => {
    localStorage.setItem('a', '1');
    localStorage.setItem('b', '2');
    const { result, rerender } = renderHook(({ k }) => usePersistedState(k, 0), {
      initialProps: { k: 'a' },
    });
    expect(result.current).toEqual([1, expect.any(Function), true]);
    rerender({ k: 'b' });
    expect(result.current[0]).toBe(2);
    act(() => {
      localStorage.setItem('b', '7');
      window.dispatchEvent(new StorageEvent('storage', { key: 'b' }));
    });
    expect(result.current[0]).toBe(7);
  });
});
