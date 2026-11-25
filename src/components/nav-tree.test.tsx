import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NavTree, NavRow } from './nav-tree';

const Sample = ({ onSelect = vi.fn() }: { onSelect?: (id: string) => void }) => {
  const [open, setOpen] = useState(true);
  return (
    <NavTree aria-label="Services">
      <NavRow
        expanded={open}
        onToggle={() => {
          setOpen(!open);
        }}
        count={2}
        onClick={() => {
          onSelect('views');
        }}
      >
        Views
      </NavRow>
      {open && (
        <>
          <NavRow depth={1} selected pill={3}>
            Reports
          </NavRow>
          <NavRow depth={1} dirty>
            Daily digest
          </NavRow>
        </>
      )}
      <NavRow>Settings</NavRow>
    </NavTree>
  );
};

const item = (name: RegExp | string) => screen.getByRole('treeitem', { name });

describe('NavTree and NavRow', () => {
  it('exposes tree semantics with levels, selection and expansion', () => {
    render(<Sample />);
    expect(screen.getByRole('tree', { name: 'Services' })).toBeTruthy();
    expect(item(/Views/).getAttribute('aria-expanded')).toBe('true');
    expect(item(/Views/).getAttribute('aria-level')).toBe('1');
    expect(item(/Reports/).getAttribute('aria-level')).toBe('2');
    expect(item(/Reports/).getAttribute('aria-selected')).toBe('true');
    expect(item('Settings').getAttribute('aria-expanded')).toBeNull();
  });

  it('keeps one tab stop, on the selected row', () => {
    render(<Sample />);
    const stops = screen.getAllByRole('treeitem').filter((r) => r.tabIndex === 0);
    expect(stops).toHaveLength(1);
    expect(stops[0]).toBe(item(/Reports/));
  });

  it('moves focus with Up, Down, Home and End without wrapping', () => {
    render(<Sample />);
    const reports = item(/Reports/);
    reports.focus();
    fireEvent.keyDown(reports, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(item(/Daily digest/));
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'End' });
    expect(document.activeElement).toBe(item('Settings'));
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(item('Settings'));
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Home' });
    expect(document.activeElement).toBe(item(/Views/));
    expect(item(/Views/).tabIndex).toBe(0);
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(item(/Views/));
  });

  it('Left goes to the parent, then collapses; Right expands, then enters', () => {
    render(<Sample />);
    const digest = item(/Daily digest/);
    digest.focus();
    fireEvent.keyDown(digest, { key: 'ArrowLeft' });
    const views = item(/Views/);
    expect(document.activeElement).toBe(views);
    fireEvent.keyDown(views, { key: 'ArrowLeft' });
    expect(views.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('treeitem', { name: /Reports/ })).toBeNull();
    fireEvent.keyDown(views, { key: 'ArrowRight' });
    expect(views.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(views, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(item(/Reports/));
  });

  it('activates with Enter and click, and toggles from the chevron only', () => {
    const onSelect = vi.fn();
    const { container } = render(<Sample onSelect={onSelect} />);
    const views = item(/Views/);
    fireEvent.keyDown(views, { key: 'Enter' });
    fireEvent.click(views);
    expect(onSelect).toHaveBeenCalledTimes(2);
    const chevron = container.querySelector('[data-slot="nav-row-chevron"]') as HTMLElement;
    fireEvent.click(chevron);
    expect(views.getAttribute('aria-expanded')).toBe('false');
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('names the dirty dot and shows count and pill', () => {
    render(<Sample />);
    expect(item(/Daily digest/).textContent).toContain('Unsaved changes');
    expect(item(/Views/).textContent).toContain('2');
    expect(item(/Reports/).textContent).toContain('3');
  });

  it('indents by depth', () => {
    render(<Sample />);
    expect(item(/Reports/).style.paddingLeft).toBe('1.25rem');
  });
});

describe('NavRow keyboard on a parent without onClick', () => {
  it('Enter, Space and a row click toggle through onToggle', () => {
    const onToggle = vi.fn();
    render(
      <NavTree aria-label="Tree">
        <NavRow expanded={false} onToggle={onToggle}>
          Folder
        </NavRow>
      </NavTree>
    );
    const row = screen.getByRole('treeitem', { name: /Folder/ });
    fireEvent.keyDown(row, { key: 'Enter' });
    fireEvent.keyDown(row, { key: ' ' });
    expect(onToggle).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByText('Folder'));
    expect(onToggle).toHaveBeenCalledTimes(3);
  });
});
