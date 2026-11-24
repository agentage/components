'use client';
import { useState } from 'react';
import { InlineCode, Select } from '../../src';
import { Block, Row } from '../components/demo';

const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'failed', label: 'Failed' },
];

const PEOPLE = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Engineering' },
  { value: 'grace', label: 'Grace Hopper', description: 'Platform' },
  { value: 'alan', label: 'Alan Turing', description: 'Research' },
  { value: 'edsger', label: 'Edsger Dijkstra', description: 'Research' },
  { value: 'barbara', label: 'Barbara Liskov', description: 'Platform' },
];

export const Example = () => (
  <Block caption="A single choice from a short list.">
    <div className="w-48">
      <Select aria-label="Status" placeholder="Select a status" options={STATUSES} />
    </div>
  </Block>
);

export const Variants = () => {
  const [value, setValue] = useState('');
  return (
    <Block
      caption={
        <>
          With <InlineCode>searchable</InlineCode>, typing filters the list; the picked value is{' '}
          <InlineCode>{value || 'none'}</InlineCode>.
        </>
      }
    >
      <div className="max-w-xs">
        <Select
          searchable
          aria-label="Person"
          value={value}
          onValueChange={setValue}
          placeholder="Select a person"
          labels={{ search: 'Search people', empty: 'No people found.' }}
          options={PEOPLE}
        />
      </div>
    </Block>
  );
};

export const Sizes = () => (
  <Block caption="Size md is 30 px tall and the default; sm is 26 px for dense rows.">
    <Row>
      <div className="w-40">
        <Select size="md" aria-label="Medium select" defaultValue="active" options={STATUSES} />
      </div>
      <div className="w-40">
        <Select size="sm" aria-label="Small select" defaultValue="active" options={STATUSES} />
      </div>
    </Row>
  </Block>
);

export const States = () => (
  <div className="w-48 space-y-5">
    <Block caption="Error marks the trigger invalid.">
      <Select error aria-label="Required status" placeholder="Select a status" options={STATUSES} />
    </Block>
    <Block caption="A disabled select dims and cannot open.">
      <Select disabled aria-label="Locked status" defaultValue="paused" options={STATUSES} />
    </Block>
    <Block caption="A disabled option stays visible but cannot be picked.">
      <Select
        aria-label="Status with disabled option"
        defaultValue="active"
        options={STATUSES.map((o) => ({ ...o, disabled: o.value === 'failed' }))}
      />
    </Block>
  </div>
);
