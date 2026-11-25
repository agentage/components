'use client';
import { useState } from 'react';
import { Button, Input, Textarea } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="A text field at the default md size, 30 px tall.">
    <Input aria-label="Name" placeholder="Enter a name" className="max-w-xs" />
  </Block>
);

export const Variants = () => {
  const [text, setText] = useState('Summarise the changes since the last release.');
  return (
    <div className="max-w-md space-y-5">
      <Block caption="Plain text, the default look.">
        <Input aria-label="Title" defaultValue="Quarterly report" />
      </Block>
      <Block caption="Mono for ids, paths and keys.">
        <Input mono aria-label="Identifier" defaultValue="release-notes" />
      </Block>
      <Block caption="A textarea with fixed rows.">
        <Textarea aria-label="Notes" rows={3} placeholder="Write a note" />
      </Block>
      <Block caption="An auto-grow textarea follows its content, starting at minRows.">
        <Textarea
          autoGrow
          minRows={3}
          aria-label="Description"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </Block>
      <Block caption="A mono textarea for code-like content.">
        <Textarea
          mono
          rows={2}
          aria-label="Snippet"
          defaultValue={'const total = 1;\nexport { total }'}
        />
      </Block>
    </div>
  );
};

export const Sizes = () => (
  <div className="max-w-md space-y-5">
    <Block caption="Size md is 30 px tall and the default.">
      <Input size="md" aria-label="Medium input" placeholder="Medium" />
    </Block>
    <Block caption="Size sm is 26 px tall at 12 px, for dense toolbars and rows.">
      <Input size="sm" aria-label="Small input" placeholder="Small" />
    </Block>
    <Block caption="Textareas follow the same two sizes.">
      <div className="space-y-2">
        <Textarea size="md" rows={2} aria-label="Medium textarea" placeholder="Medium" />
        <Textarea size="sm" rows={2} aria-label="Small textarea" placeholder="Small" />
      </div>
    </Block>
  </div>
);

export const States = () => (
  <div className="max-w-md space-y-5">
    <Block caption="Error marks the field invalid with a red border.">
      <Input error aria-label="Email" defaultValue="ada@" />
    </Block>
    <Block caption="Disabled fields dim and ignore input.">
      <Input disabled aria-label="Locked" defaultValue="Locked value" />
    </Block>
    <Block caption="Read-only fields keep their value selectable but not editable.">
      <Input readOnly aria-label="Reference" defaultValue="REC-2048" />
    </Block>
    <Block caption="The same states on a textarea.">
      <div className="space-y-2">
        <Textarea error rows={2} aria-label="Error textarea" defaultValue="Too short" />
        <Textarea disabled rows={2} aria-label="Disabled textarea" defaultValue="Locked" />
      </div>
    </Block>
  </div>
);

export const Composition = () => (
  <Block caption="A field and its action sit on one row, with the same height.">
    <div className="flex max-w-md items-center gap-2">
      <Input aria-label="Invite by email" placeholder="name@example.com" />
      <Button>Invite</Button>
    </div>
  </Block>
);
