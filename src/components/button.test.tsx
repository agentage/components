import { createRef } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('forwards a ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current?.tagName).toBe('BUTTON');
    expect(ref.current?.getAttribute('data-slot')).toBe('button');
  });

  it('forwards a ref through Slot when asChild is set', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button asChild ref={ref}>
        <a href="/docs">Docs</a>
      </Button>
    );
    expect(ref.current?.tagName).toBe('A');
    expect(screen.getByRole('link', { name: 'Docs' }).getAttribute('data-slot')).toBe('button');
  });

  it('keeps a focus-visible ring', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' }).className).toContain('focus-ring');
  });
});

// One control metric: md 28 px, px 10, gap 6, 13 px; `md` must be an exact alias of default.
describe('Button size scale', () => {
  it('renders the 28 px control metric by default', () => {
    render(<Button>Save</Button>);
    const cls = screen.getByRole('button').className;
    for (const c of ['h-7', 'px-2.5', 'gap-1.5', 'rounded-lg', 'text-ui', 'font-semibold']) {
      expect(cls.split(' ')).toContain(c);
    }
  });

  it('renders md as an exact alias of default', () => {
    render(<Button size="md">Save</Button>);
    const md = screen.getByRole('button').className;
    cleanup();
    render(<Button>Save</Button>);
    expect(screen.getByRole('button').className).toBe(md);
  });

  it('renders sm at 24 px with px 8, gap 4 and 12 px text', () => {
    render(<Button size="sm">Save</Button>);
    const cls = screen.getByRole('button').className.split(' ');
    for (const c of ['h-6', 'px-2', 'gap-1', 'text-xs']) expect(cls).toContain(c);
  });

  it('merges className last', () => {
    render(<Button className="mt-4">Save</Button>);
    expect(screen.getByRole('button').className.endsWith(' mt-4')).toBe(true);
  });
});

describe('Button outline-primary and pending', () => {
  it('renders the amber outline look at weight 600', () => {
    render(<Button variant="outline-primary">New service</Button>);
    const cls = screen.getByRole('button').className;
    expect(cls).toContain('border-primary');
    expect(cls).toContain('text-primary-emphasis');
    expect(cls).toContain('font-semibold');
  });

  it('keeps focus, blocks clicks and submits, and marks busy while pending', () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const { rerender } = render(
      <form onSubmit={onSubmit}>
        <Button type="submit" onClick={onClick}>
          Save
        </Button>
      </form>
    );
    const button = screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
    button.focus();
    rerender(
      <form onSubmit={onSubmit}>
        <Button type="submit" onClick={onClick} pending>
          Save
        </Button>
      </form>
    );
    expect(document.activeElement).toBe(button);
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('[data-slot="button-spinner"]')).not.toBeNull();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Save' })).toBe(button);
  });

  it('defaults to type button, so it never submits a form by accident', () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Remove</Button>
        <Button type="submit">Save</Button>
      </form>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
