import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useScrollLock } from './use-scroll-lock';

const Lock = ({ active }: { active: boolean }): null => {
  useScrollLock(active);
  return null;
};

describe('useScrollLock', () => {
  it('locks body scroll and compensates the scrollbar width', () => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const { rerender } = render(<Lock active={false} />);
    expect(document.body.style.overflow).toBe('');

    rerender(<Lock active />);
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe(`${String(scrollbarWidth)}px`);

    rerender(<Lock active={false} />);
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('restores the inline styles it found instead of clearing them', () => {
    document.body.style.paddingRight = '12px';
    const { unmount } = render(<Lock active />);
    expect(document.body.style.paddingRight).not.toBe('12px');

    unmount();
    expect(document.body.style.paddingRight).toBe('12px');
    document.body.style.paddingRight = '';
  });

  it('applies nested locks once and releases them in any order', () => {
    document.body.style.paddingRight = '3px';
    const a = render(<Lock active />);
    const padding = document.body.style.paddingRight;
    const b = render(<Lock active />);
    expect(document.body.style.paddingRight).toBe(padding);
    a.unmount();
    expect(document.body.style.overflow).toBe('hidden');
    b.unmount();
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('3px');
    document.body.style.paddingRight = '';
  });
});
