'use client';
import { useState } from 'react';
import {
  FilterBar,
  FilterButtonGroup,
  FilterClear,
  FilterResults,
  FilterSearch,
  FilterSort,
  StatusBar,
  StatusGlyph,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src';
import { Block } from '../components/demo';
import { ServerIcon } from '../lib/icons';

type Tone = 'success' | 'destructive' | 'muted';

const SERVICES = [
  {
    name: 'Nightly backup',
    status: 'active',
    items: 5,
    history: ['success', 'success', 'destructive', 'success'],
  },
  { name: 'Weekly digest', status: 'active', items: 3, history: ['success', 'success', 'success'] },
  {
    name: 'Report export',
    status: 'paused',
    items: 8,
    history: ['success', 'muted', 'destructive'],
  },
  { name: 'Archive cleanup', status: 'paused', items: 1, history: ['muted', 'muted'] },
] as const;

export const Example = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'items'>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const rows = SERVICES.filter(
    (s) =>
      (status === 'all' || s.status === status) &&
      s.name.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => {
    const mul = order === 'asc' ? 1 : -1;
    return sortBy === 'name' ? mul * a.name.localeCompare(b.name) : mul * (a.items - b.items);
  });
  const hasFilters = query !== '' || status !== 'all';

  return (
    <Block caption="Deprecated. Use ListToolbar with FilterMenu, DisplayMenu and ToolbarSearch instead; StatusBar takes slots in place of size.">
      <div className="space-y-3">
        <FilterBar>
          <FilterSearch value={query} onChange={setQuery} placeholder="Search by name..." />
          <FilterButtonGroup
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'paused', label: 'Paused' },
            ]}
          />
          <FilterSort
            label="Sort by"
            value={sortBy}
            order={order}
            onChange={(v, o) => {
              setSortBy(v);
              setOrder(o);
            }}
            options={[
              { value: 'name', label: 'Name' },
              { value: 'items', label: 'Items' },
            ]}
          />
          <FilterClear
            active={hasFilters}
            onClear={() => {
              setQuery('');
              setStatus('all');
            }}
          />
        </FilterBar>
        <FilterResults
          icon={<ServerIcon />}
          filtered={rows.length}
          total={SERVICES.length}
          label="services"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Recent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.name}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    <StatusGlyph
                      shape={s.status === 'active' ? 'disc' : 'ring'}
                      tone={s.status === 'active' ? 'success' : 'muted'}
                    />
                    {s.status}
                  </span>
                </TableCell>
                <TableCell className="tabular-nums">{s.items}</TableCell>
                <TableCell>
                  <StatusBar
                    size="sm"
                    label={`Recent results of ${s.name}`}
                    slots={6}
                    cells={s.history.map((tone: Tone, i) => ({
                      tone,
                      label: `Result ${String(i + 1)}, ${tone}`,
                    }))}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Block>
  );
};
