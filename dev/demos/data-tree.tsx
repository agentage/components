'use client';
import { useState } from 'react';
import { DataTree, ToolbarSearch } from '../../src';
import { Block } from '../components/demo';

const EVENT = {
  id: 'evt_7Hq2',
  type: 'item.updated',
  status: 200,
  ok: true,
  retried: false,
  error: null,
  createdAt: '2026-11-21T09:14:03Z',
  actor: { id: 'u_104', name: 'Ada Park', roles: ['admin', 'viewer'] },
  changes: [
    { field: 'title', from: 'Draft', to: 'Quarterly report' },
    { field: 'state', from: 'open', to: 'done' },
  ],
  note: 'The import ran twice because the first attempt timed out after 30 seconds; the second attempt used the cached upload and finished in 4 seconds.',
};

export const Example = () => {
  const [q, setQ] = useState('');
  return (
    <Block caption="Values are coloured by type. Type to mark matches; hover a row to copy its path or value.">
      <div className="w-full max-w-xl space-y-2">
        <ToolbarSearch
          value={q}
          onValueChange={setQ}
          placeholder="Search keys and values"
          aria-label="Search the data"
        />
        <div className="rounded-lg border border-border bg-card py-1">
          <DataTree value={EVENT} highlight={q} defaultExpandDepth={2} aria-label="Event" />
        </div>
      </div>
    </Block>
  );
};

export const Sizes = () => (
  <Block caption="A large array shows 100 items at a time, then Show more.">
    <div className="w-full max-w-xl rounded-lg border border-border bg-card py-1">
      <DataTree
        value={{ points: Array.from({ length: 340 }, (_, i) => Math.round(Math.sin(i / 9) * 100)) }}
        aria-label="Points"
      />
    </div>
  </Block>
);
