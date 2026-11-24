import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconContainer, type IconContainerColor } from './icon-container';

const BASE = 'flex items-center justify-center rounded-md';
const MD = 'size-7 [&_svg]:size-4';

// Frozen pre-CVA output of the hand-rolled colorVariants/sizeVariants lookups.
const COLORS: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-500',
  green: 'bg-green-500/10 text-green-500',
  amber: 'bg-amber-500/10 text-amber-500',
  violet: 'bg-violet-500/10 text-violet-500',
  rose: 'bg-rose-500/10 text-rose-500',
  cyan: 'bg-cyan-500/10 text-cyan-500',
  muted: 'bg-muted/50 text-muted-foreground',
};

describe('IconContainer', () => {
  it.each(Object.keys(COLORS))('renders color=%s byte-identically', (color) => {
    const { container } = render(
      <IconContainer color={color as IconContainerColor}>i</IconContainer>
    );
    expect(container.firstElementChild?.className).toBe(`${BASE} ${COLORS[color]} ${MD}`);
  });

  it.each([
    ['sm', 'size-6 [&_svg]:size-3.5'],
    ['md', MD],
    ['lg', 'size-8 [&_svg]:size-4'],
    ['xl', 'size-10 [&_svg]:size-5'],
  ] as const)('renders size=%s byte-identically and merges className last', (size, expected) => {
    const { container } = render(
      <IconContainer color="blue" size={size} className="mt-4">
        i
      </IconContainer>
    );
    expect(container.firstElementChild?.className).toBe(
      `${BASE} bg-blue-500/10 text-blue-500 ${expected} mt-4`
    );
  });

  it('supports the shared status vocabulary', () => {
    const { container } = render(<IconContainer color="success">i</IconContainer>);
    expect(container.firstElementChild?.className).toBe(`${BASE} bg-success/10 text-success ${MD}`);
  });

  it('forwards a ref and spreads extra props', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <IconContainer ref={ref} color="muted" id="ic" aria-hidden="true">
        i
      </IconContainer>
    );
    expect(ref.current?.getAttribute('data-slot')).toBe('icon-container');
    expect(container.querySelector('#ic')?.getAttribute('aria-hidden')).toBe('true');
  });
});
