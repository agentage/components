import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { List, ListRow, type ListItem } from './entity-list';

const row = (c: HTMLElement, i = 0): HTMLElement =>
  c.querySelectorAll<HTMLElement>('[data-slot="list-row"]')[i];

describe('ListRow', () => {
  it('is 52 px two-line or 36 px one-line by default', () => {
    const { container } = render(
      <List>
        <ListRow title="Nightly backup" description="Copies the archive" href="/a" />
        <ListRow title="Weekly report" />
      </List>
    );
    expect(row(container, 0).className).toContain('min-h-[52px]');
    expect(row(container, 1).className).toContain('min-h-9');
    expect(row(container, 0).className).toContain('hover:bg-accent');
    expect(row(container, 1).className).not.toContain('cursor-pointer');
  });

  it('stretches the link across the row and keeps actions above it', () => {
    render(<ListRow title="Open me" href="/x" actions={<button type="button">More</button>} />);
    expect(screen.getByRole('link', { name: 'Open me' }).className).toContain('after:inset-0');
    expect(screen.getByRole('button', { name: 'More' }).parentElement?.className).toContain('z-10');
  });
});

interface Item extends ListItem {
  group: string;
}

const ITEMS: Item[] = [
  {
    id: 'a',
    title: 'Approve access',
    kind: 'Request',
    alert: 'waiting 4 min',
    emphasized: true,
    group: 'now',
  },
  { id: 'b', title: 'Draft ready', meta: '18 min', description: '5 sections', group: 'review' },
  { id: 'c', title: 'Change ready', meta: '26 min', group: 'review' },
];
const LABEL: Record<string, string> = { now: 'Needs attention', review: 'To review' };

const Grouped = ({ open = vi.fn() }: { open?: (id: string) => void }) => {
  const [sel, setSel] = useState<string | null>('b');
  return (
    <List
      items={ITEMS}
      variant="stacked"
      groupBy={(m) => ({ key: m.group, label: LABEL[m.group] })}
      value={sel}
      onValueChange={setSel}
      onOpen={open}
      aria-label="Requests"
    />
  );
};

const btn = (name: RegExp) => screen.getByRole('button', { name });

describe('List data mode', () => {
  it('groups rows under counted headers and marks the selected row', () => {
    render(<Grouped />);
    expect(screen.getByRole('region', { name: 'Requests' })).toBeTruthy();
    expect(btn(/To review/).textContent).toContain('2');
    expect(btn(/Draft ready/).getAttribute('aria-current')).toBe('true');
    expect(btn(/New.*Request.*Approve access/).className).toContain('h-[54px]');
    expect(screen.getByText('waiting 4 min')).toBeTruthy();
  });

  it('selects on click and opens on Enter', () => {
    const open = vi.fn();
    render(<Grouped open={open} />);
    fireEvent.click(btn(/Change ready/));
    expect(btn(/Change ready/).getAttribute('aria-current')).toBe('true');
    fireEvent.keyDown(btn(/Change ready/), { key: 'Enter' });
    expect(open).toHaveBeenCalledWith('c');
  });

  it('j and k move between rows across groups and select them', () => {
    render(<Grouped />);
    btn(/Draft ready/).focus();
    fireEvent.keyDown(btn(/Draft ready/), { key: 'k' });
    expect(document.activeElement).toBe(btn(/Approve access/));
    expect(btn(/Approve access/).getAttribute('aria-current')).toBe('true');
    fireEvent.keyDown(btn(/Approve access/), { key: 'j' });
    expect(btn(/Draft ready/).getAttribute('aria-current')).toBe('true');
  });

  it('collapses a group, makes its rows inert and keeps the state in storage', () => {
    render(
      <List
        items={ITEMS}
        groupBy={(m) => ({ key: m.group, label: LABEL[m.group] })}
        storageKey="list-test"
      />
    );
    const head = btn(/Needs attention/);
    fireEvent.click(head);
    expect(head.getAttribute('aria-expanded')).toBe('false');
    expect(
      document.getElementById(head.getAttribute('aria-controls') ?? '')?.hasAttribute('inert')
    ).toBe(true);
    expect(localStorage.getItem('list-test')).toBe('["now"]');
  });

  it('renders a flat list with the default label', () => {
    const { container } = render(<List items={ITEMS} />);
    expect(screen.getByRole('region', { name: 'List' })).toBeTruthy();
    expect(container.querySelectorAll('[data-slot="list-item"]')).toHaveLength(3);
    expect(container.querySelector('[data-slot="group-header"]')).toBeNull();
  });
});
