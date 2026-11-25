import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ActionKbd } from './action-bar.parts';
import { DataTree } from './data-tree';
import { useListControls } from '../lib/use-list-controls';
import { BulkBar, DataViewToolbar } from './data-view.toolbar';
import {
  ActiveFilters,
  DisplayMenu,
  FilterMenu,
  ListToolbarEnd,
  ToolbarToggle,
  ViewSwitch,
} from './list-toolbar';

describe('toolbar parts forward a ref to their root and take className', () => {
  const groups = [{ id: 'g', label: 'Group', options: [{ value: 'a', label: 'A' }] }];

  it.each([
    ['ListToolbarEnd', (r: React.Ref<never>) => <ListToolbarEnd ref={r} className="x" />],
    [
      'ActiveFilters',
      (r: React.Ref<never>) => (
        <ActiveFilters
          ref={r}
          className="x"
          groups={groups}
          value={{ g: ['a'] }}
          onRemove={vi.fn()}
        />
      ),
    ],
    [
      'ViewSwitch',
      (r: React.Ref<never>) => (
        <ViewSwitch ref={r} className="x" value="list" onValueChange={vi.fn()} />
      ),
    ],
    [
      'ToolbarToggle',
      (r: React.Ref<never>) => (
        <ToolbarToggle ref={r} className="x" pressed={false} onPressedChange={vi.fn()}>
          T
        </ToolbarToggle>
      ),
    ],
    [
      'FilterMenu',
      (r: React.Ref<never>) => (
        <FilterMenu
          ref={r}
          className="x"
          groups={groups}
          value={{}}
          onToggle={vi.fn()}
          onClear={vi.fn()}
        />
      ),
    ],
    ['DisplayMenu', (r: React.Ref<never>) => <DisplayMenu ref={r} className="x" />],
    [
      'BulkBar',
      (r: React.Ref<never>) => <BulkBar ref={r} className="x" count={2} onClear={vi.fn()} />,
    ],
    ['ActionKbd', (r: React.Ref<never>) => <ActionKbd ref={r} className="x" />],
  ])('%s', (_name, el) => {
    const ref = createRef<HTMLElement>();
    render(el(ref as React.Ref<never>));
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.classList.contains('x')).toBe(true);
  });
});

it('DataViewToolbar forwards its ref and className to the toolbar root', () => {
  const { result } = renderHook(() => useListControls());
  const ref = createRef<HTMLDivElement>();
  render(
    <DataViewToolbar
      ref={ref}
      className="x"
      c={result.current}
      columns={[]}
      filters={[]}
      toggles={[]}
      views={['table']}
      view="table"
      shown={0}
      total={0}
      selected={[]}
      onClearSelection={vi.fn()}
    />
  );
  expect(ref.current?.getAttribute('data-slot')).toBe('list-toolbar');
  expect(ref.current?.classList.contains('x')).toBe(true);
});

describe('DataTree long strings', () => {
  it('the row name contains the visible "+N" toggle text', () => {
    render(<DataTree value={{ note: 'x'.repeat(30) }} maxStringLength={10} aria-label="Data" />);
    const more = document.querySelector('button[aria-expanded]') as HTMLElement;
    expect(more.textContent).toBe('+22 more characters');
    expect(screen.getByRole('treeitem', { name: 'note: "xxxxxxxxx... +22 more characters' })).toBe(
      more.closest('[role="treeitem"]')
    );
    fireEvent.click(more);
    expect(more.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('treeitem', { name: /^note: "x+\.\.\. Less$/ })).toBe(
      more.closest('[role="treeitem"]')
    );
  });
});

describe('MiniBars tone', () => {
  it('maps tone to a fill', async () => {
    const { MiniBars } = await import('./sparkline');
    const { container } = render(<MiniBars data={[1, 2]} tone="success" />);
    expect(container.querySelector('rect')?.getAttribute('class')).toContain('fill-success');
  });
});
