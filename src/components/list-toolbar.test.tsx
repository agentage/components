import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  ActiveFilters,
  DisplayMenu,
  FilterMenu,
  ListToolbar,
  ToolbarSearch,
  ToolbarToggle,
  ViewSwitch,
  type ListFilterGroup,
} from './list-toolbar';

const GROUPS: ListFilterGroup[] = [
  {
    id: 'status',
    label: 'Status',
    options: [
      { value: 'enabled', label: 'Enabled' },
      { value: 'paused', label: 'Paused' },
    ],
  },
  { id: 'trigger', label: 'Trigger', options: [{ value: 'cron', label: 'Schedule' }] },
];

const Filters = () => {
  const [value, setValue] = useState<Record<string, string[]>>({});
  const toggle = (g: string, v: string) =>
    setValue((s) => ({
      ...s,
      [g]: s[g]?.includes(v) ? s[g].filter((x) => x !== v) : [...(s[g] ?? []), v],
    }));
  return (
    <ListToolbar>
      <FilterMenu groups={GROUPS} value={value} onToggle={toggle} onClear={() => setValue({})} />
      <ActiveFilters groups={GROUPS} value={value} onRemove={toggle} />
    </ListToolbar>
  );
};

describe('ListToolbar', () => {
  it('is a labelled 45 px toolbar', () => {
    render(<ListToolbar />);
    const bar = screen.getByRole('toolbar', { name: 'List controls' });
    expect(bar.className).toContain('h-[45px]');
    expect(bar.className).toContain('flex-nowrap');
  });

  it('search reports changes and Escape clears it', () => {
    const onValueChange = vi.fn();
    render(
      <ToolbarSearch value="rel" onValueChange={onValueChange} placeholder="Search services" />
    );
    const input = screen.getByRole('searchbox', { name: 'Search services' });
    fireEvent.change(input, { target: { value: 'rele' } });
    expect(onValueChange).toHaveBeenLastCalledWith('rele');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onValueChange).toHaveBeenLastCalledWith('');
  });

  it('multi-selects filters into chips, counts them, removes and clears', () => {
    render(<Filters />);
    fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Paused' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Schedule' }));
    expect(screen.getByRole('button', { name: /Filter\s*2\s*active/ })).toBeTruthy();
    expect(screen.getByText('Status: Paused')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Remove filter Status: Paused' }));
    expect(screen.queryByText('Status: Paused')).toBeNull();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Clear all filters' }));
    expect(screen.queryByText('Trigger: Schedule')).toBeNull();
  });

  it('toggle exposes pressed state and the view switch is a radio group', () => {
    const onPressedChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <>
        <ToolbarToggle pressed={false} onPressedChange={onPressedChange}>
          Needs attention
        </ToolbarToggle>
        <ViewSwitch value="list" onValueChange={onValueChange} />
      </>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Needs attention' }));
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('radio', { name: 'List view' }).getAttribute('aria-checked')).toBe(
      'true'
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Cards view' }));
    expect(onValueChange).toHaveBeenCalledWith('cards');
  });

  it('display menu sets sort, direction, group and toggles', () => {
    const onSortChange = vi.fn();
    const onGroupByChange = vi.fn();
    const onFlagChange = vi.fn();
    render(
      <DisplayMenu
        sortOptions={[
          { value: 'name', label: 'Name' },
          { value: 'next', label: 'Next update' },
        ]}
        sort={{ key: 'name', dir: 'asc' }}
        onSortChange={onSortChange}
        groupOptions={[{ value: 'trigger', label: 'Trigger' }]}
        groupBy={null}
        onGroupByChange={onGroupByChange}
        toggles={[{ value: 'desc', label: 'Descriptions' }]}
        flags={{ desc: true }}
        onFlagChange={onFlagChange}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Display options' }));
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Next update' }));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'next', dir: 'asc' });
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Descending' }));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', dir: 'desc' });
    const group = within(screen.getByRole('group', { name: 'Group by' }));
    expect(group.getByRole('menuitemradio', { name: 'None' }).getAttribute('aria-checked')).toBe(
      'true'
    );
    const sortBy = within(screen.getByRole('group', { name: 'Sort by' }));
    fireEvent.click(sortBy.getByRole('menuitemradio', { name: 'None' }));
    expect(onSortChange).toHaveBeenLastCalledWith(null);
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Trigger' }));
    expect(onGroupByChange).toHaveBeenCalledWith('trigger');
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Descriptions' }));
    expect(onFlagChange).toHaveBeenCalledWith('desc', false);
  });
});

describe('ViewSwitch icons', () => {
  it('draws a built-in icon for table, cards and board', () => {
    render(
      <ViewSwitch
        value="table"
        onValueChange={() => {}}
        options={[
          { value: 'table', label: 'List view' },
          { value: 'cards', label: 'Cards view' },
          { value: 'board', label: 'Board view' },
        ]}
      />
    );
    for (const name of ['List view', 'Cards view', 'Board view'])
      expect(screen.getByRole('radio', { name }).querySelector('svg')).not.toBeNull();
  });
});
