import { act, fireEvent, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { List, ListRow, type ListItem } from './entity-list';

interface Item extends ListItem {
  group: string;
}

const ITEMS: Item[] = [
  { id: 'a', title: 'Alpha', group: 'In progress' },
  { id: 'b', title: 'Bravo', group: 'Done' },
];
const byGroup = (i: Item) => ({ key: i.group, label: i.group });

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('ListRow behaviour', () => {
  it('keeps actions and children beside the title', () => {
    render(
      <ListRow title="Row" meta="2 min" actions={<button type="button">Menu</button>}>
        <span>extra</span>
      </ListRow>
    );
    expect(screen.getByRole('button', { name: 'Menu' })).toBeTruthy();
    expect(screen.getByText('extra')).toBeTruthy();
    expect(screen.getByText('2 min')).toBeTruthy();
  });

  it('a row with onClick and no href is a keyboard button', () => {
    const onClick = vi.fn();
    render(<ListRow title="Open" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Open' });
    button.focus();
    expect(document.activeElement).toBe(button);
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('List behaviour', () => {
  it('group body ids hold no spaces, so aria-controls resolves', () => {
    render(<List items={ITEMS} groupBy={byGroup} />);
    const head = screen.getByRole('button', { name: /In progress/ });
    const id = head.getAttribute('aria-controls') ?? '';
    expect(id).not.toMatch(/\s/);
    expect(document.getElementById(id)).toBeTruthy();
  });

  it('Ctrl or Cmd + K is left to the page', () => {
    render(<List items={ITEMS} />);
    const bravo = screen.getByRole('button', { name: 'Bravo' });
    bravo.focus();
    fireEvent.keyDown(bravo, { key: 'k', ctrlKey: true });
    fireEvent.keyDown(bravo, { key: 'k', metaKey: true });
    expect(document.activeElement).toBe(bravo);
  });

  it('Tab lands on the current selection, not a stale tab stop', () => {
    const { rerender } = render(<List items={ITEMS} value="a" />);
    rerender(<List items={ITEMS} value="b" />);
    expect(screen.getByRole('button', { name: 'Bravo' }).tabIndex).toBe(0);
    expect(screen.getByRole('button', { name: 'Alpha' }).tabIndex).toBe(-1);
  });

  it.each([['{}'], ['"x"'], ['[1,2]'], ['{oops']])(
    'ignores stored %s of the wrong shape',
    (raw) => {
      localStorage.setItem('el', raw);
      render(<List items={ITEMS} groupBy={byGroup} storageKey="el" />);
      expect(
        screen.getByRole('button', { name: /In progress/ }).getAttribute('aria-expanded')
      ).toBe('true');
    }
  );

  it('hydrates with stored collapsed groups and no hydration error', () => {
    localStorage.setItem('el', '["Done"]');
    const ui = <List items={ITEMS} groupBy={byGroup} storageKey="el" />;
    const host = document.createElement('div');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
      throw new Error('no storage on the server');
    });
    host.innerHTML = renderToString(ui);
    vi.restoreAllMocks();
    document.body.appendChild(host);
    expect(host.innerHTML).toContain('aria-expanded="true"');
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const recoverable = vi.fn();
    act(() => {
      hydrateRoot(host, ui, { onRecoverableError: recoverable });
    });
    const done = screen.getByRole('button', { name: /Done/ });
    expect(done.getAttribute('aria-expanded')).toBe('false');
    expect(recoverable).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
  });
});
