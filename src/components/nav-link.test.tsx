import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NavLink } from './nav-link';

describe('NavLink', () => {
  it('marks the active link as the current page', () => {
    render(
      <NavLink href="/documents" active>
        Documents
      </NavLink>
    );
    expect(screen.getByRole('link', { name: 'Documents' }).getAttribute('aria-current')).toBe(
      'page'
    );
  });

  it('leaves inactive links without aria-current', () => {
    render(<NavLink href="/settings">Settings</NavLink>);
    expect(screen.getByRole('link', { name: 'Settings' }).getAttribute('aria-current')).toBe(null);
  });

  it('does not clobber a caller-supplied aria-current', () => {
    render(
      <NavLink href="/step" active aria-current="step">
        Step
      </NavLink>
    );
    expect(screen.getByRole('link', { name: 'Step' }).getAttribute('aria-current')).toBe('step');
  });
});

describe('navLinkVariants', () => {
  it('renders the active and idle states', () => {
    const active = render(<NavLink href="/a" active density="comfortable" />).container;
    const on = (active.querySelector('[data-slot="nav-link"]') as HTMLElement).className;
    for (const c of ['border-l-primary', 'bg-primary-soft', 'focus-ring', 'duration-fast']) {
      expect(on).toContain(c);
    }

    const idle = render(<NavLink href="/b" density="comfortable" />).container;
    const off = (idle.querySelector('[data-slot="nav-link"]') as HTMLElement).className;
    for (const c of ['border-l-transparent', 'text-muted-foreground', 'hover:bg-accent']) {
      expect(off).toContain(c);
    }
    expect(off).not.toContain('bg-primary-soft');
  });
});

describe('NavLink density', () => {
  it('defaults to the shared 28 px nav row with a selected accent bar', () => {
    const { container } = render(<NavLink href="/a" active />);
    const el = container.querySelector('[data-slot="nav-link"]') as HTMLElement;
    expect(el.dataset.density).toBe('compact');
    expect(el.className).toContain('h-7');
    expect(el.className).toContain('before:bg-primary');
  });
});

describe('NavLink asChild', () => {
  it('renders the child element instead of an anchor', () => {
    const { container } = render(
      <NavLink asChild active icon={<svg data-testid="icon" />}>
        <button type="button">Machines</button>
      </NavLink>
    );
    const el = container.querySelector('[data-slot="nav-link"]') as HTMLElement;
    expect(el.tagName).toBe('BUTTON');
    expect(el.getAttribute('aria-current')).toBe('page');
    expect(el.className).toContain('before:bg-primary');
    expect(el.textContent).toContain('Machines');
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  it('still renders an anchor by default', () => {
    const { container } = render(<NavLink href="/reports">Reports</NavLink>);
    expect((container.querySelector('[data-slot="nav-link"]') as HTMLElement).tagName).toBe('A');
  });
});
