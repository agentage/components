'use client';
import { useState } from 'react';
import { InlineEdit } from '../../src';
import { Block } from '../components/demo';

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-xl rounded-lg border border-border p-4">{children}</div>
);

export const Example = () => {
  const [name, setName] = useState('Daily digest');
  return (
    <Block caption="Looks like text, shows an outline on hover and an input on focus. Enter or blur commits, Esc reverts.">
      <Frame>
        <InlineEdit as="h1" value={name} onCommit={setName} label="Report name" />
      </Frame>
    </Block>
  );
};

export const Variants = () => {
  const [title, setTitle] = useState('Quarterly review');
  const [text, setText] = useState('Weekly');
  const [desc, setDesc] = useState(
    'A short summary of yesterday’s merged changes and new records, sent each morning.'
  );
  return (
    <div className="space-y-5">
      <Block caption="The as prop sets the text style: h1, h2, h3 or plain text.">
        <Frame>
          <InlineEdit as="h2" value={title} onCommit={setTitle} label="Section title" />
          <InlineEdit value={text} onCommit={setText} label="Frequency" />
        </Frame>
      </Block>
      <Block caption="Multiline fields commit with Ctrl+Enter.">
        <Frame>
          <InlineEdit multiline value={desc} onCommit={setDesc} label="Description" />
        </Frame>
      </Block>
    </div>
  );
};

export const States = () => {
  const [empty, setEmpty] = useState('');
  return (
    <div className="space-y-5">
      <Block caption="An empty value shows the placeholder.">
        <Frame>
          <InlineEdit value={empty} onCommit={setEmpty} label="Note" placeholder="Untitled note" />
        </Frame>
      </Block>
      <Block caption="Disabled fields show the value and cannot be edited.">
        <Frame>
          <InlineEdit disabled value="Locked title" onCommit={() => {}} label="Locked title" />
        </Frame>
      </Block>
    </div>
  );
};
