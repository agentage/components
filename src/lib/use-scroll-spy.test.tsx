import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScrollSpy } from './use-scroll-spy';

afterEach(() => vi.restoreAllMocks());

describe('useScrollSpy', () => {
  it('reads the layout once per frame however many scroll events arrive', () => {
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => frames.push(cb));
    const Probe = () => {
      const active = useScrollSpy(['a', 'b']);
      return (
        <>
          <p id="a">A</p>
          <p id="b">B</p>
          <output>{active}</output>
        </>
      );
    };
    const reads = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
    render(<Probe />);
    const before = reads.mock.calls.length;
    for (let i = 0; i < 10; i++) window.dispatchEvent(new Event('scroll'));
    expect(frames).toHaveLength(1);
    expect(reads.mock.calls.length).toBe(before);
    act(() => frames[0](0));
    expect(reads.mock.calls.length).toBe(before + 2);
  });
});
