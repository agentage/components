import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar } from './avatar';

describe('Avatar', () => {
  it('names the initials avatar from the name prop', () => {
    const { container } = render(<Avatar name="Ada Lovelace" />);
    const root = container.querySelector('[data-slot="avatar"]');
    expect(root?.getAttribute('aria-label')).toBe('Ada Lovelace');
    expect(screen.getByText('AL').getAttribute('aria-hidden')).toBe(null);
  });

  it('prefers a caller-supplied aria-label', () => {
    const { container } = render(<Avatar name="Ada Lovelace" aria-label="Owner" />);
    expect(container.querySelector('[data-slot="avatar"]')?.getAttribute('aria-label')).toBe(
      'Owner'
    );
  });

  it('leaves the avatar unlabeled without a name or aria-label', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('[data-slot="avatar"]')?.getAttribute('aria-label')).toBe(null);
  });

  it('lets the image alt carry the name when an image renders', () => {
    const { container } = render(<Avatar name="Ada" src="/a.png" />);
    expect(container.querySelector('[data-slot="avatar"]')?.getAttribute('aria-label')).toBe(null);
    expect(screen.getByRole('img').getAttribute('alt')).toBe('Ada');
  });
});

describe('avatarVariants', () => {
  it('renders the size scale', () => {
    const sizes = {
      xs: 'size-[22px]',
      sm: 'size-7',
      md: 'size-10',
      lg: 'size-12',
    } as const;
    for (const [size, cls] of Object.entries(sizes)) {
      const { container, unmount } = render(<Avatar size={size as keyof typeof sizes} name="A" />);
      expect(container.querySelector('[data-slot="avatar"]')?.className).toContain(cls);
      unmount();
    }
  });

  it('defaults to sm (28 px), semibold initials, and merges className last', () => {
    const { container } = render(<Avatar name="A" className="ring-2" />);
    const cls = container.querySelector('[data-slot="avatar"]')?.className ?? '';
    expect(cls).toContain('size-7');
    expect(cls).toContain('font-semibold');
    expect(cls.endsWith('ring-2')).toBe(true);
  });

  it('tints a square icon tile with a meaning tone', () => {
    const { container } = render(<Avatar shape="square" icon={<svg />} tone="success" />);
    const cls = container.querySelector('[data-slot="avatar"]')?.className ?? '';
    expect(cls).toContain('bg-success/10');
    expect(cls).toContain('text-success');
  });

  it('paints the accent disc with tone primary', () => {
    const { container } = render(<Avatar name="A" tone="primary" />);
    expect(container.querySelector('[data-slot="avatar"]')?.className).toContain('bg-primary');
  });
});

describe('Avatar shapes and icon', () => {
  it('renders initials as a named image on a circle by default', () => {
    render(<Avatar name="Anna Kowal" />);
    const el = screen.getByRole('img', { name: 'Anna Kowal' });
    expect(el.textContent).toBe('AK');
    expect(el.dataset.shape).toBe('circle');
    expect(el.className).toContain('rounded-full');
  });

  it('renders a rounded square at the 2xs size', () => {
    render(<Avatar shape="square" size="2xs" aria-label="Billing service" />);
    const el = screen.getByRole('img', { name: 'Billing service' });
    expect(el.dataset.shape).toBe('square');
    expect(el.className).toContain('rounded-md');
    expect(el.className).not.toContain('rounded-full');
    expect(el.className).toContain('size-[18px]');
  });

  it('draws the icon instead of the initials', () => {
    render(<Avatar name="Billing" shape="square" icon={<svg data-testid="ico" />} />);
    expect(screen.getByTestId('ico')).toBeTruthy();
    expect(screen.queryByText('B')).toBeNull();
    expect(screen.getByTestId('ico').parentElement?.getAttribute('aria-hidden')).toBe('true');
  });

  it('prefers the image over the icon', () => {
    render(<Avatar name="Ada" src="/a.png" icon={<svg data-testid="ico" />} />);
    expect(screen.queryByTestId('ico')).toBeNull();
    expect(screen.getByRole('img').getAttribute('alt')).toBe('Ada');
  });
});

describe('Avatar image failure before hydration', () => {
  it('falls back to the name when the image already failed to load on mount', () => {
    const complete = vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
    const width = vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(0);
    const { container } = render(<Avatar name="Ada Lovelace" src="/missing.png" />);
    complete.mockRestore();
    width.mockRestore();
    expect(container.querySelector('[data-slot="avatar"]')?.getAttribute('aria-label')).toBe(
      'Ada Lovelace'
    );
    expect(screen.getByText('AL')).toBeTruthy();
  });
});
