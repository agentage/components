'use client';
import { useState } from 'react';
import {
  ActiveFilters,
  Button,
  DataTable,
  DisplayMenu,
  FilterMenu,
  ListToolbar,
  ListToolbarEnd,
  PageHeader,
  ToolbarSearch,
  useListControls,
  ViewSwitch,
} from '../../../src';
import { Block } from '../../components/demo';
import { UiIcon } from '../../lib/ui-icons';
import { SERVICE_CONFIG, SERVICES, serviceFilters } from '../../lib/services-data';
import { serviceColumns, serviceMenu, ServiceCard } from '../../lib/services-list-parts';

const SORTS = [
  { value: 'name', label: 'Name' },
  { value: 'next', label: 'Next' },
  { value: 'last', label: 'Last result' },
];
const GROUPS = [
  { value: 'status', label: 'Status' },
  { value: 'trigger', label: 'Trigger' },
  { value: 'owner', label: 'Owner' },
];

const useServices = () => {
  const [rows, setRows] = useState(SERVICES);
  const [picked, setPicked] = useState<string[]>([]);
  const [opened, setOpened] = useState<string | null>(null);
  const setEnabled = (id: string, on: boolean) =>
    setRows((list) => list.map((s) => (s.id === id ? { ...s, enabled: on } : s)));
  const pick = (id: string, on: boolean) =>
    setPicked((l) => (on ? [...l, id] : l.filter((x) => x !== id)));
  return { rows, picked, pick, opened, setOpened, setEnabled };
};

export const Example = () => {
  const s = useServices();
  const c = useListControls({ sort: { key: 'name', dir: 'asc' } });
  const { state } = c;
  const result = c.apply(s.rows, SERVICE_CONFIG);
  const filters = serviceFilters(s.rows, state);
  const empty = <p className="m-0 p-6 text-ui text-muted-foreground">No services match.</p>;
  return (
    <Block caption="Search, filter with counts, sort and group from Display, then switch to cards. Click a row to open it; the switches and menus work on the sample data.">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <PageHeader title="Services" className="border-b border-border px-4">
          <Button variant="outline-primary">
            <UiIcon name="plus" />
            New service
          </Button>
        </PageHeader>
        <ListToolbar aria-label="Service controls">
          <ToolbarSearch
            value={state.query}
            onValueChange={c.setQuery}
            placeholder="Search services"
          />
          <FilterMenu
            groups={filters}
            value={state.filters}
            onToggle={c.toggleFilter}
            onClear={c.clearFilters}
          />
          <ActiveFilters groups={filters} value={state.filters} onRemove={c.toggleFilter} />
          <ListToolbarEnd>
            <ViewSwitch value={state.view} onValueChange={c.setView} />
            <DisplayMenu
              sortOptions={SORTS}
              sort={state.sort}
              onSortChange={c.setSort}
              groupOptions={GROUPS}
              groupBy={state.groupBy}
              onGroupByChange={c.setGroupBy}
            />
          </ListToolbarEnd>
        </ListToolbar>
        <div className="h-[460px] overflow-auto">
          {state.view === 'cards' ? (
            result.rows.length === 0 ? (
              empty
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 p-4">
                {result.rows.map((row) => (
                  <ServiceCard
                    key={row.id}
                    service={row}
                    selected={s.picked.includes(row.id)}
                    onSelectedChange={(on) => s.pick(row.id, on)}
                    onEnabledChange={(on) => s.setEnabled(row.id, on)}
                    onOpen={() => s.setOpened(row.id)}
                  />
                ))}
              </div>
            )
          ) : (
            <DataTable
              columns={serviceColumns(true, s.setEnabled)}
              rows={result.rows}
              rowLines={2}
              sticky
              overflowX="visible"
              rowKey={(row) => row.id}
              groupBy={result.groupOf}
              sort={state.sort ? { key: state.sort.key, direction: state.sort.dir } : null}
              onSortChange={(v) => c.setSort(v ? { key: v.key, dir: v.direction } : null)}
              onRowClick={(row) => s.setOpened(row.id)}
              isRowSelected={(row) => row.id === s.opened}
              rowMenu={serviceMenu}
              rowMenuLabel={(row) => `Actions for ${row.name}`}
              empty={empty}
            />
          )}
        </div>
      </div>
    </Block>
  );
};
