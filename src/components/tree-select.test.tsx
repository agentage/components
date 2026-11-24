import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';
import { TreeSelect, type TreeSelectNode } from './tree-select';
import { createRef } from 'react';
import { defaultPath, visibleRows } from './tree-select.model';

const NODES: TreeSelectNode[] = [
  {
    id: 'personal',
    label: 'personal',
    disabled: true,
    children: [
      {
        id: 'personal|notes/',
        label: 'notes/',
        children: [{ id: 'personal|notes/ideas/', label: 'ideas/' }],
      },
      { id: 'personal|journal/', label: 'journal/' },
    ],
  },
  {
    id: 'work',
    label: 'work',
    disabled: true,
    children: [{ id: 'work|decisions/', label: 'decisions/' }],
  },
];

const open = () => fireEvent.click(screen.getByRole('button', { name: 'Add folder' }));
const row = (name: string) => screen.getByRole('treeitem', { name: new RegExp(`^${name}`) });

interface PathEntry {
  id: string;
  source: string;
  path: string;
}

// A minimal picked-folders list: the TreeSelect is what is under test.
const Picked = ({ entries, onRemove }: { entries: PathEntry[]; onRemove: (id: string) => void }) =>
  entries.length === 0 ? (
    <p>No folders yet.</p>
  ) : (
    <ul aria-label="Record folders">
      {entries.map((e) => (
        <li key={e.id}>
          {e.path}
          <button type="button" onClick={() => onRemove(e.id)}>
            {`Remove ${e.source} ${e.path}`}
          </button>
        </li>
      ))}
    </ul>
  );

const Folders = ({ multi = false }: { multi?: boolean }) => {
  const [list, setList] = useState<PathEntry[]>([
    { id: 'work|decisions/', source: 'work', path: 'decisions/' },
  ]);
  return (
    <>
      <Picked entries={list} onRemove={(id) => setList((l) => l.filter((e) => e.id !== id))} />
      <TreeSelect
        nodes={NODES}
        title="Add a record folder"
        mode={multi ? 'multi' : 'single'}
        disabledIds={list.map((e) => e.id)}
        defaultExpanded={['personal', 'work']}
        onValueChange={(ids) =>
          setList((l) => [
            ...l,
            ...ids.map((id) => {
              const [source, path] = id.split('|');
              return { id, source, path };
            }),
          ])
        }
        trigger={<Button variant="outline">Add folder</Button>}
      />
    </>
  );
};

describe('TreeSelect picking', () => {
  it('picks a folder in single mode and lists it', () => {
    render(<Folders />);
    open();
    expect(screen.getByRole('dialog', { name: 'Add a record folder' })).toBeTruthy();
    expect(row('decisions/').getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(row('journal/'));
    expect(screen.queryByRole('dialog')).toBeNull();
    const list = screen.getByRole('list', { name: 'Record folders' });
    expect(within(list).getByText('journal/')).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Add folder' }));
  });

  it('ignores disabled and taken nodes', () => {
    const spy = vi.fn();
    render(
      <TreeSelect
        nodes={NODES}
        title="Pick"
        onValueChange={spy}
        disabledIds={['work|decisions/']}
        trigger={<button>Add folder</button>}
      />
    );
    open();
    fireEvent.click(row('personal'));
    fireEvent.click(row('decisions/'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('expands and collapses nodes and filters by search', () => {
    render(<Folders />);
    open();
    expect(screen.queryByRole('treeitem', { name: /ideas/ })).toBeNull();
    fireEvent.click(row('notes/').querySelector('[data-slot="nav-row-chevron"]') as Element);
    expect(row('ideas/')).toBeTruthy();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'jour' } });
    expect(screen.getAllByRole('treeitem').map((r) => r.textContent)).toEqual([
      'personal',
      'journal/',
    ]);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz' } });
    expect(screen.getByText('No match')).toBeTruthy();
  });

  it('multi: toggles several, shows their paths and confirms', () => {
    render(<Folders multi />);
    open();
    expect(screen.getByRole('button', { name: 'Add 0' }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(row('notes/'));
    fireEvent.click(row('journal/'));
    expect(screen.getByText('personal / notes/, personal / journal/')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Add 2' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('Escape closes and returns focus; remove empties the list', () => {
    render(<Folders />);
    open();
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Add folder' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove work decisions/' }));
    expect(screen.getByText('No folders yet.')).toBeTruthy();
  });
});

describe('TreeSelect open, ref and expansion', () => {
  it('opens from the trigger and closes on Escape', () => {
    render(
      <TreeSelect
        nodes={NODES}
        title="Pick"
        onValueChange={vi.fn()}
        trigger={<button>Add folder</button>}
      />
    );
    open();
    expect(screen.getByRole('dialog', { name: 'Pick' })).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('forwards the ref to the trigger, also while closed', () => {
    const ref = createRef<HTMLElement>();
    render(
      <TreeSelect
        ref={ref}
        nodes={NODES}
        title="Pick"
        onValueChange={vi.fn()}
        trigger={<button>Add folder</button>}
      />
    );
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Add folder' }));
  });

  it('expands the roots once nodes arrive late', () => {
    const props = { title: 'Pick', onValueChange: vi.fn(), trigger: <button>Add folder</button> };
    const { rerender } = render(<TreeSelect nodes={[]} {...props} />);
    rerender(<TreeSelect nodes={NODES} {...props} />);
    open();
    expect(row('notes/')).toBeTruthy();
    expect(row('decisions/')).toBeTruthy();
  });

  it('ignores chevron clicks while a search forces the tree open', () => {
    render(<Folders />);
    open();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ideas' } });
    expect(row('notes/').getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(row('notes/').querySelector('[data-slot="nav-row-chevron"]') as Element);
    expect(row('notes/').getAttribute('aria-expanded')).toBe('true');
    expect(row('ideas/')).toBeTruthy();
  });
});

describe('tree-select model', () => {
  const [personal] = NODES;
  const notes = personal.children?.[0] as TreeSelectNode;
  const ideas = notes.children?.[0] as TreeSelectNode;

  it('joins labels with one slash between them', () => {
    expect(defaultPath([personal, notes, ideas])).toBe('personal / notes/ideas/');
    const plain = (label: string): TreeSelectNode => ({ id: label, label });
    expect(defaultPath([plain('Root'), plain('A'), plain('B')])).toBe('Root / A/B');
    expect(defaultPath([plain('Root')])).toBe('Root');
    expect(defaultPath([])).toBe('');
  });

  it('keeps matches with their ancestors in one pass, ignoring collapsed state', () => {
    const ids = visibleRows(NODES, new Set(), 'ideas').map((r) => r.node.id);
    expect(ids).toEqual(['personal', 'personal|notes/', 'personal|notes/ideas/']);
    expect(visibleRows(NODES, new Set(), 'zzz')).toEqual([]);
    expect(visibleRows(NODES, new Set(), '').map((r) => r.node.id)).toEqual(['personal', 'work']);
  });
});
