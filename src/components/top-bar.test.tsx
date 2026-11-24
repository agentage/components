import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TopBar, TopBarNavItem } from './top-bar';

const bar = (container: HTMLElement): HTMLElement =>
  container.querySelector('[data-slot="top-bar"]') as HTMLElement;

describe('topBarVariants', () => {
  it('renders the exact class string with and without sticky', () => {
    expect(bar(render(<TopBar>x</TopBar>).container).className).toBe(
      'border-b border-border bg-background/95 backdrop-blur'
    );
    expect(bar(render(<TopBar sticky>x</TopBar>).container).className).toBe(
      'border-b border-border bg-background/95 backdrop-blur sticky top-0 z-[var(--z-sticky,40)]'
    );
  });

  it('keeps the width class ahead of the inner layout classes', () => {
    expect(
      (bar(render(<TopBar>x</TopBar>).container).firstElementChild as HTMLElement).className
    ).toBe('mx-auto max-w-6xl flex h-14 items-center gap-6 px-6');
    expect(
      (bar(render(<TopBar contained={false}>x</TopBar>).container).firstElementChild as HTMLElement)
        .className
    ).toBe('w-full flex h-14 items-center gap-6 px-6');
  });
});

describe('topBarNavItemVariants', () => {
  it('renders the active and idle states', () => {
    const { unmount } = render(
      <TopBarNavItem href="#" active>
        A
      </TopBarNavItem>
    );
    const on = screen.getByRole('link').className;
    for (const c of ['h-7', 'focus-ring', 'bg-accent', 'text-foreground']) expect(on).toContain(c);
    expect(screen.getByRole('link').getAttribute('aria-current')).toBe('page');
    unmount();

    render(<TopBarNavItem href="#">B</TopBarNavItem>);
    const off = screen.getByRole('link').className;
    expect(off).toContain('text-foreground/70');
    expect(off).toContain('hover:bg-accent');
    expect(off.split(' ')).not.toContain('bg-accent');
  });
});
