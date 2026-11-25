import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useControlled } from './use-controlled';

afterEach(() => {
  localStorage.clear();
});

describe('useControlled', () => {
  it('follows the value when controlled and only reports changes', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useControlled(value, 'init', onChange),
      { initialProps: { value: 'a' } }
    );
    expect(result.current[0]).toBe('a');
    act(() => result.current[1]('b'));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(result.current[0]).toBe('a');
    rerender({ value: 'b' });
    expect(result.current[0]).toBe('b');
  });

  it('keeps its own state when uncontrolled and still calls onChange', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControlled<string>(undefined, 'init', onChange));
    expect(result.current[0]).toBe('init');
    act(() => result.current[1]('next'));
    expect(result.current[0]).toBe('next');
    expect(onChange).toHaveBeenCalledWith('next');
  });

  it('persists uncontrolled state under storageKey and restores it', () => {
    const first = renderHook(() => useControlled<boolean>(undefined, false, undefined, 'open'));
    act(() => first.result.current[1](true));
    expect(localStorage.getItem('open')).toBe('true');
    first.unmount();
    const second = renderHook(() => useControlled<boolean>(undefined, false, undefined, 'open'));
    expect(second.result.current[0]).toBe(true);
  });

  it('ignores storage while controlled', () => {
    localStorage.setItem('open', 'true');
    const { result } = renderHook(() => useControlled<boolean>(false, false, undefined, 'open'));
    expect(result.current[0]).toBe(false);
  });

  it('composes updaters called twice in one tick', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControlled<string[]>(undefined, [], onChange));
    act(() => {
      result.current[1]((l) => [...l, 'a']);
      result.current[1]((l) => [...l, 'b']);
    });
    expect(result.current[0]).toEqual(['a', 'b']);
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
  });
});
