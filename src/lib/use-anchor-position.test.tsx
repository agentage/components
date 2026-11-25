import { act, render } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAnchorPosition } from './use-anchor-position';

const rect = (top: number, height: number): DOMRect =>
  ({
    top,
    bottom: top + height,
    left: 10,
    right: 110,
    width: 100,
    height,
    x: 10,
    y: top,
  }) as DOMRect;

afterEach(() => vi.unstubAllGlobals());

describe('useAnchorPosition', () => {
  it('measures again when the surface grows after open, and flips when it no longer fits', () => {
    let resized: () => void = () => {};
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(cb: () => void) {
          resized = cb;
        }
        observe() {}
        disconnect() {}
      }
    );
    let surfaceHeight = 100;
    const Probe = () => {
      const anchor = useRef<HTMLDivElement>(null);
      const surface = useRef<HTMLDivElement>(null);
      const { top } = useAnchorPosition(anchor, surface, true, { side: 'bottom', offset: 0 });
      return (
        <>
          <div ref={anchor} data-testid="a" />
          <div ref={surface} data-testid="s" data-top={top} />
        </>
      );
    };
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.dataset.testid === 'a' ? rect(500, 20) : rect(0, surfaceHeight);
    });
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('s').dataset.top).toBe('520');
    surfaceHeight = 400;
    act(() => resized());
    expect(Number(getByTestId('s').dataset.top)).toBeLessThan(520);
  });
});
