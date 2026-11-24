import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FilterMenu,
  ListToolbar,
  ListToolbarEnd,
  ToolbarSearch,
  ToolbarToggle,
} from './list-toolbar';

const STEPS = ['labels', 'search', 'menu'];

/** jsdom has no layout: the row is `need` px wide at step 0 and each fit step saves 100 px. */
const stubWidth = (need: number, room = 300) => {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === 'list-toolbar' ? room : 0;
  });
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function (
    this: HTMLElement
  ) {
    if (this.dataset.slot !== 'list-toolbar') return 0;
    return need - 100 * STEPS.filter((s) => this.hasAttribute(`data-fit-${s}`)).length;
  });
};

const Bar = ({ onToggle = vi.fn() }: { onToggle?: (on: boolean) => void }) => {
  const [q, setQ] = useState('');
  const [on, setOn] = useState(false);
  return (
    <ListToolbar>
      <ToolbarSearch value={q} onValueChange={setQ} placeholder="Search items" />
      <FilterMenu groups={[]} value={{}} onToggle={vi.fn()} onClear={vi.fn()} />
      <ListToolbarEnd>
        <ToolbarToggle
          pressed={on}
          onPressedChange={(next) => {
            setOn(next);
            onToggle(next);
          }}
        >
          Mine
        </ToolbarToggle>
      </ListToolbarEnd>
    </ListToolbar>
  );
};

const toolbar = () => screen.getByRole('toolbar');
const steps = () => STEPS.filter((s) => toolbar().hasAttribute(`data-fit-${s}`));
const searchButton = () => screen.getByRole('button', { name: /^Search items/ });

describe('ListToolbar fit', () => {
  afterEach(() => vi.restoreAllMocks());

  it('adds no step while the row fits and keeps the folded controls out of reach', () => {
    stubWidth(300);
    render(<Bar />);
    expect(steps()).toEqual([]);
    expect(searchButton().closest('[inert]')).not.toBeNull();
    const stops = [screen.getByRole('button', { name: 'Filter' }), screen.getByText('Mine')];
    expect(stops.filter((el) => el.tabIndex === 0)).toHaveLength(1);
  });

  it('takes only the steps it needs, in order', () => {
    stubWidth(450);
    render(<Bar />);
    expect(steps()).toEqual(['labels', 'search']);
    expect(searchButton().closest('[inert]')).toBeNull();
    expect(screen.getByText('Mine').closest('[inert]')).toBeNull();
  });

  it('moves toggles into the More menu at the last step', () => {
    const onToggle = vi.fn();
    stubWidth(600);
    render(<Bar onToggle={onToggle} />);
    expect(steps()).toEqual(STEPS);
    expect(screen.getByText('Mine').closest('[inert]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'More controls' }));
    const item = screen.getByRole('menuitemcheckbox', { name: 'Mine' });
    expect(item.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(item);
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Mine' }).getAttribute('aria-checked')
    ).toBe('true');
  });

  it('opens the folded search into the field and Escape folds it back to the button', () => {
    stubWidth(450);
    render(<Bar />);
    fireEvent.click(searchButton());
    const field = screen.getByRole('searchbox', { name: 'Search items' });
    expect(document.activeElement).toBe(field);
    expect(searchButton().getAttribute('aria-expanded')).toBe('true');
    fireEvent.change(field, { target: { value: 'pa' } });
    fireEvent.keyDown(field, { key: 'Escape' });
    expect((field as HTMLInputElement).value).toBe('');
    expect(document.activeElement).toBe(field);
    fireEvent.keyDown(field, { key: 'Escape' });
    expect(document.activeElement).toBe(searchButton());
    expect(searchButton().getAttribute('aria-expanded')).toBe('false');
  });

  it('names the folded search with its query', () => {
    stubWidth(450);
    render(<Bar />);
    fireEvent.click(searchButton());
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'pa' } });
    fireEvent.blur(screen.getByRole('searchbox'));
    expect(screen.getByRole('button', { name: 'Search items: pa' })).toBeTruthy();
  });
});
