'use client';
import {
  ActiveFilters,
  DisplayMenu,
  FilterMenu,
  ListToolbar,
  ListToolbarEnd,
  ToolbarSearch,
  ToolbarToggle,
  useListControls,
  ViewSwitch,
  type ListFilterGroup,
} from '../../src';
import { Block } from '../components/demo';

const GROUPS: ListFilterGroup[] = [
  {
    id: 'status',
    label: 'Status',
    options: [
      { value: 'active', label: 'Active', count: 4 },
      { value: 'paused', label: 'Paused', count: 2 },
    ],
  },
  {
    id: 'kind',
    label: 'Kind',
    options: [
      { value: 'report', label: 'Report', count: 3 },
      { value: 'sheet', label: 'Sheet', count: 2 },
      { value: 'note', label: 'Note', count: 1 },
    ],
  },
];

const FRAME = 'overflow-hidden rounded-lg border border-border bg-background';

export const Example = () => {
  const c = useListControls({});
  return (
    <Block caption="The minimum: a search box and a filter menu in the one 45 px row.">
      <div className={FRAME}>
        <ListToolbar>
          <ToolbarSearch
            value={c.state.query}
            onValueChange={c.setQuery}
            placeholder="Search items"
          />
          <FilterMenu
            groups={GROUPS}
            value={c.state.filters}
            onToggle={c.toggleFilter}
            onClear={c.clearFilters}
          />
        </ListToolbar>
      </div>
    </Block>
  );
};

export const Composition = () => {
  const c = useListControls({ filters: { status: ['paused'] } });
  return (
    <Block caption="The full toolbar. The row never wraps: search shrinks and chips scroll with a fade edge. The state below is the one plain object from useListControls.">
      <div className={FRAME}>
        <ListToolbar>
          <ToolbarSearch
            value={c.state.query}
            onValueChange={c.setQuery}
            placeholder="Search items"
          />
          <FilterMenu
            groups={GROUPS}
            value={c.state.filters}
            onToggle={c.toggleFilter}
            onClear={c.clearFilters}
          />
          <ActiveFilters groups={GROUPS} value={c.state.filters} onRemove={c.toggleFilter} />
          <ListToolbarEnd>
            <ToolbarToggle
              pressed={c.state.flags.mine ?? false}
              onPressedChange={(on) => c.setFlag('mine', on)}
            >
              Mine
            </ToolbarToggle>
            <ViewSwitch
              value={c.state.view}
              onValueChange={c.setView}
              options={[
                { value: 'list', label: 'List view' },
                { value: 'cards', label: 'Cards view' },
                { value: 'board', label: 'Board view' },
              ]}
            />
            <DisplayMenu
              sortOptions={[
                { value: 'name', label: 'Name' },
                { value: 'due', label: 'Due date' },
              ]}
              sort={c.state.sort}
              onSortChange={c.setSort}
              groupOptions={[
                { value: 'status', label: 'Status' },
                { value: 'owner', label: 'Owner' },
              ]}
              groupBy={c.state.groupBy}
              onGroupByChange={c.setGroupBy}
            />
          </ListToolbarEnd>
        </ListToolbar>
        <pre className="m-0 overflow-auto p-4 font-mono text-xs text-muted-foreground">
          {JSON.stringify(c.state, null, 2)}
        </pre>
      </div>
    </Block>
  );
};
