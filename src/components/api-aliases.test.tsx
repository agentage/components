import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ActionKbd } from './action-bar.parts';
import { Button } from './button';
import { DataTable, type DataTableColumn } from './data-table';
import { DataTree } from './data-tree';
import { useListControls } from '../lib/use-list-controls';
import { BulkBar, DataViewToolbar } from './data-view.toolbar';
import { HeatmapCard } from './heatmap-card';
import { IconContainer } from './icon-container';
import {
  ActiveFilters,
  DisplayMenu,
  FilterMenu,
  ListToolbarEnd,
  ToolbarToggle,
  ViewSwitch,
} from './list-toolbar';

const COLUMNS: DataTableColumn<{ name: string }>[] = [{ key: 'name', header: 'Name' }];
const cells = (): string[] => screen.getAllByRole('cell').map((c) => c.textContent ?? '');

describe('renamed props keep their old names', () => {
  it('DataTable takes `rows`, and the deprecated `data` still renders', () => {
    const { unmount } = render(<DataTable columns={COLUMNS} rows={[{ name: 'a' }]} />);
    expect(cells()).toEqual(['a']);
    unmount();
    render(<DataTable columns={COLUMNS} data={[{ name: 'b' }]} />);
    expect(cells()).toEqual(['b']);
  });

  it('DataTable: `rows` wins over `data`, and neither renders the empty state', () => {
    const { unmount } = render(
      <DataTable columns={COLUMNS} rows={[{ name: 'new' }]} data={[{ name: 'old' }]} />
    );
    expect(cells()).toEqual(['new']);
    unmount();
    render(<DataTable columns={COLUMNS} empty="Nothing" />);
    expect(screen.getByText('Nothing')).toBeTruthy();
  });

  it('IconContainer takes `tone`, the deprecated `color` gives the same tile', () => {
    render(
      <>
        <IconContainer tone="success" data-testid="tone" />
        <IconContainer color="success" data-testid="color" />
        <IconContainer tone="info" color="success" data-testid="both" />
      </>
    );
    const tone = screen.getByTestId('tone').className;
    expect(screen.getByTestId('color').className).toBe(tone);
    expect(screen.getByTestId('both').className).not.toBe(tone);
  });

  it('HeatmapCard `tone` maps to a token; the deprecated `color` still sets the ramp', () => {
    const cell = (id: string) =>
      screen.getByTestId(id).querySelector('td div[aria-hidden]') as HTMLElement;
    render(
      <>
        <HeatmapCard title="T" data={[[1]]} tone="success" data-testid="tone" />
        <HeatmapCard title="C" data={[[1]]} color="red" data-testid="color" />
        <HeatmapCard title="D" data={[[1]]} data-testid="default" />
      </>
    );
    expect(cell('tone').style.background).toContain('var(--color-success)');
    expect(cell('color').style.background).toContain('red');
    expect(cell('default').style.background).toContain('var(--color-primary)');
  });

  it('Button `size="default"` (deprecated) still renders the md control', () => {
    render(
      <>
        <Button size="default">Old</Button>
        <Button>New</Button>
      </>
    );
    const old = screen.getByRole('button', { name: 'Old' }).className;
    expect(screen.getByRole('button', { name: 'New' }).className).toBe(old);
  });
});

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
  it('maps tone to a fill and keeps the deprecated color class', async () => {
    const { MiniBars } = await import('./stat-card-charts');
    const { container, rerender } = render(<MiniBars data={[1, 2]} tone="success" />);
    expect(container.querySelector('rect')?.getAttribute('class')).toContain('fill-success');
    rerender(<MiniBars data={[1, 2]} color="fill-warning" />);
    expect(container.querySelector('rect')?.getAttribute('class')).toContain('fill-warning');
  });
});
