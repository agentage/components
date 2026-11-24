import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi, type Mock } from 'vitest';
import { Command, CommandEmpty, CommandGroup, CommandItem } from './command';

const Harness = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ overflow: 'hidden' }}>
      <button type="button" onClick={() => setOpen(true)}>
        Open palette
      </button>
      <Command open={open} onOpenChange={setOpen}>
        <CommandItem>Dashboard</CommandItem>
      </Command>
    </div>
  );
};

const renderPalette = (onOpenChange: Mock = vi.fn()): { onOpenChange: Mock } => {
  render(
    <Command open onOpenChange={onOpenChange}>
      <CommandGroup heading="Navigation">
        <CommandItem>Dashboard</CommandItem>
        <CommandItem>Machines</CommandItem>
        <CommandItem>Reports</CommandItem>
      </CommandGroup>
      <CommandEmpty>No results found.</CommandEmpty>
    </Command>
  );
  return { onOpenChange };
};

const input = (): HTMLElement => screen.getByRole('combobox');

describe('Command', () => {
  it('exposes a labelled dialog and search input', () => {
    renderPalette();
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
    expect(input().getAttribute('aria-label')).toBe('Search');
  });

  it('filters items case-insensitively by their text', () => {
    renderPalette();
    fireEvent.change(input(), { target: { value: 'MACH' } });
    expect(screen.getByText('Machines').closest('button')?.hidden).toBe(false);
    expect(screen.getByText('Dashboard').closest('button')?.hidden).toBe(true);
  });

  it('shows the empty state when nothing matches', () => {
    renderPalette();
    expect(screen.queryByText('No results found.')).toBeNull();
    fireEvent.change(input(), { target: { value: 'zzz' } });
    expect(screen.getByText('No results found.')).not.toBeNull();
  });

  it('moves the active descendant with arrow keys', () => {
    renderPalette();
    const first = screen.getByText('Dashboard').closest('button');
    expect(input().getAttribute('aria-activedescendant')).toBe(first?.id);
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(input().getAttribute('aria-activedescendant')).toBe(
      screen.getByText('Machines').closest('button')?.id
    );
    fireEvent.keyDown(input(), { key: 'ArrowUp' });
    expect(input().getAttribute('aria-activedescendant')).toBe(first?.id);
  });

  it('activates the highlighted item on Enter', () => {
    const onSelect = vi.fn();
    render(
      <Command open onOpenChange={vi.fn()}>
        <CommandItem onClick={onSelect}>Dashboard</CommandItem>
      </Command>
    );
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', () => {
    const { onOpenChange } = renderPalette();
    fireEvent.keyDown(input(), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('portals the palette to document.body and lands focus on the input', () => {
    const { container } = render(
      <div style={{ overflow: 'hidden' }}>
        <Command open onOpenChange={vi.fn()}>
          <CommandItem>Dashboard</CommandItem>
        </Command>
      </div>
    );
    expect(container.querySelector('[data-slot="command"]')).toBeNull();
    expect(screen.getByRole('dialog').closest('body')).toBe(document.body);
    expect(document.activeElement).toBe(screen.getByRole('combobox'));
  });

  it('locks body scroll and restores focus to the opener on close', () => {
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Open palette' });
    opener.focus();
    fireEvent.click(opener);
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(input(), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(opener);
  });
});

describe('CommandItem classes', () => {
  it('renders the active and inactive states', () => {
    render(
      <Command open onOpenChange={vi.fn()}>
        <CommandItem>Alpha</CommandItem>
        <CommandItem className="pl-2">Beta</CommandItem>
      </Command>
    );
    const items = document.body.querySelectorAll('[data-slot="command-item"]');
    for (const item of items) {
      expect(item.className).toContain('h-7');
      expect(item.className).toContain('focus-ring');
      expect(item.className).toContain('hover:bg-accent');
    }
    expect(items[0].className.split(' ')).toContain('bg-accent');
    expect(items[1].className.split(' ')).not.toContain('bg-accent');
    expect(items[1].className).toContain('text-popover-foreground');
    expect(items[1].className.endsWith('pl-2')).toBe(true);
  });

  it('merges className last on the palette surface and spreads props', () => {
    render(
      <Command open onOpenChange={vi.fn()} className="mt-4" id="palette">
        <CommandItem>Alpha</CommandItem>
      </Command>
    );
    const surface = document.body.querySelector('[data-slot="command-content"]') as HTMLElement;
    expect(surface.className).toContain('rounded-lg');
    expect(surface.className).toContain('bg-popover');
    expect(surface.className.endsWith('mt-4')).toBe(true);
    expect(document.body.querySelector('#palette')).not.toBeNull();
  });
});

describe('Command input pass-through', () => {
  it('spreads inputProps onto the search input', () => {
    render(
      <Command open onOpenChange={vi.fn()} inputProps={{ id: 'palette-q', 'data-testid': 'q' }}>
        <CommandItem>Dashboard</CommandItem>
      </Command>
    );
    const el = screen.getByTestId('q');
    expect(el).toBe(input());
    expect(el.id).toBe('palette-q');
    expect(el.dataset.slot).toBe('command-input');
  });

  it('forwards a ref to the search input', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Command open onOpenChange={vi.fn()} inputRef={ref}>
        <CommandItem>Dashboard</CommandItem>
      </Command>
    );
    expect(ref.current).toBe(input());
  });

  it('keeps arrow-key navigation after an inputProps keydown handler', () => {
    const onKeyDown = vi.fn();
    render(
      <Command open onOpenChange={vi.fn()} inputProps={{ onKeyDown }}>
        <CommandItem>Dashboard</CommandItem>
        <CommandItem>Machines</CommandItem>
      </Command>
    );
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(input().getAttribute('aria-activedescendant')).toBe(
      screen.getByText('Machines').closest('[role="option"]')?.id
    );
  });

  it('gives the search icon a stable slot and class', () => {
    renderPalette();
    const icon = document.querySelector('[data-slot="command-search-icon"]') as SVGElement;
    expect(icon.getAttribute('class')).toContain('command-search-icon');
  });
});

describe('Command order and Escape', () => {
  it('arrows follow the DOM order when an item mounts late', () => {
    const Harness = ({ late }: { late: boolean }) => (
      <Command open onOpenChange={() => {}}>
        {late && <CommandItem>Alpha</CommandItem>}
        <CommandItem>Beta</CommandItem>
      </Command>
    );
    const { rerender } = render(<Harness late={false} />);
    rerender(<Harness late />);
    const input = screen.getByRole('combobox');
    const active = () => document.getElementById(input.getAttribute('aria-activedescendant') ?? '');
    fireEvent.keyDown(input, { key: 'Home' });
    expect(active()?.textContent).toBe('Alpha');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(active()?.textContent).toBe('Beta');
  });

  it('closes once per Escape', () => {
    const onOpenChange = vi.fn();
    render(
      <Command open onOpenChange={onOpenChange}>
        <CommandItem>Alpha</CommandItem>
      </Command>
    );
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });
});
