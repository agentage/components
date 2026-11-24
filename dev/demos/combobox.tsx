'use client';
import { useState } from 'react';
import { Combobox, InlineCode } from '../../src';
import { Block, Row } from '../components/demo';

const OPTIONS = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Engineering' },
  { value: 'grace', label: 'Grace Hopper', description: 'Platform' },
  { value: 'alan', label: 'Alan Turing', description: 'Research' },
  { value: 'edsger', label: 'Edsger Dijkstra', description: 'Research' },
  { value: 'barbara', label: 'Barbara Liskov', description: 'Platform' },
];

export const Example = () => {
  const [value, setValue] = useState('');
  return (
    <Block
      caption={
        <>
          Type to filter the list; the picked value is <InlineCode>{value || 'none'}</InlineCode>.
        </>
      }
    >
      <div className="max-w-xs">
        <Combobox
          value={value}
          onValueChange={setValue}
          placeholder="Select a person"
          searchPlaceholder="Search people"
          options={OPTIONS}
        />
      </div>
    </Block>
  );
};

export const Variants = () => {
  const [value, setValue] = useState('ada');
  return (
    <Block caption="Options without descriptions show the label only.">
      <div className="max-w-xs">
        <Combobox
          value={value}
          onValueChange={setValue}
          placeholder="Select a person"
          options={OPTIONS.map(({ value: v, label }) => ({ value: v, label }))}
        />
      </div>
    </Block>
  );
};

export const Sizes = () => (
  <Block caption="Size md is 30 px tall and the default; sm is 26 px.">
    <Row>
      <div className="w-52">
        <Combobox size="md" placeholder="Medium" options={OPTIONS} />
      </div>
      <div className="w-52">
        <Combobox size="sm" placeholder="Small" options={OPTIONS} />
      </div>
    </Row>
  </Block>
);

export const States = () => (
  <div className="max-w-xs space-y-5">
    <Block caption="Error marks the field invalid.">
      <Combobox error placeholder="Select a person" options={OPTIONS} />
    </Block>
    <Block caption="Disabled dims the field and blocks opening.">
      <Combobox disabled value="grace" options={OPTIONS} />
    </Block>
    <Block caption="With no match, the list shows the empty text.">
      <Combobox emptyMessage="No people found." placeholder="Select a person" options={[]} />
    </Block>
  </div>
);
