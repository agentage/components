import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DocSidebar, DocSidebarItem } from './doc-sidebar';

describe('docSidebarItemVariants', () => {
  it('uses the shared 28 px nav row with the nesting rule on indented items', () => {
    const cases = [
      { active: true, depth: 0 },
      { active: true, depth: 1 },
      { active: false, depth: 0 },
      { active: false, depth: 1 },
    ];

    for (const { active, depth } of cases) {
      const { unmount } = render(
        <DocSidebarItem href="#" active={active} depth={depth}>
          i
        </DocSidebarItem>
      );
      const cls = screen.getByRole('link').className;
      expect(cls).toContain('h-7');
      expect(cls.includes('before:bg-primary')).toBe(active);
      expect(cls).not.toContain('border-l');
      unmount();
    }
  });

  it('indents nested items and marks the active one as current', () => {
    render(
      <DocSidebarItem href="#" active depth={2}>
        i
      </DocSidebarItem>
    );
    const link = screen.getByRole('link');
    expect(link.style.paddingLeft).toBe('2.25rem');
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('keeps the sidebar width prop ahead of the base classes', () => {
    const { container } = render(<DocSidebar>x</DocSidebar>);
    expect((container.querySelector('[data-slot="doc-sidebar"]') as HTMLElement).className).toBe(
      'w-60 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground'
    );
  });
});
