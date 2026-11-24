'use client';
import { useState } from 'react';
import { Button, TreeSelect } from '../../src';
import { Block } from '../components/demo';
import { folderPath, FOLDER_TREE } from '../lib/folders-data';
import { UiIcon } from '../lib/ui-icons';

// Forwards the trigger props TreeSelect slots in (ref, click, aria-expanded).
const Plus = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" {...props}>
    <UiIcon name="plus" />
    {children}
  </Button>
);

export const Example = () => {
  const [one, setOne] = useState<string[]>([]);
  return (
    <Block caption="A popover over a searchable tree. Type to filter, Down enters the tree, Right and Left expand and collapse, Enter picks.">
      <div className="flex flex-wrap items-center gap-3">
        <TreeSelect
          nodes={FOLDER_TREE}
          title="Add a folder"
          onValueChange={setOne}
          formatPath={folderPath}
          searchPlaceholder="Search folders"
          trigger={<Plus>Single pick</Plus>}
        />
        <span className="font-mono text-xs text-muted-foreground">
          {one.join(', ') || 'nothing yet'}
        </span>
      </div>
    </Block>
  );
};

export const Variants = () => {
  const [many, setMany] = useState<string[]>([]);
  return (
    <Block caption="Multi mode ticks several nodes and confirms them with one button.">
      <div className="flex flex-wrap items-center gap-3">
        <TreeSelect
          nodes={FOLDER_TREE}
          title="Add folders"
          mode="multi"
          onValueChange={(ids) => {
            setMany((m) => [...m, ...ids]);
          }}
          disabledIds={many}
          formatPath={folderPath}
          confirmLabel={(n) => `Add ${String(n)} ${n === 1 ? 'folder' : 'folders'}`}
          searchPlaceholder="Search folders"
          trigger={<Plus>Multi pick</Plus>}
        />
        <span className="font-mono text-xs text-muted-foreground">
          {many.join(', ') || 'nothing yet'}
        </span>
      </div>
    </Block>
  );
};

export const States = () => (
  <Block caption="Nodes in disabledIds are shown but cannot be picked, and group roots only group.">
    <TreeSelect
      nodes={FOLDER_TREE}
      title="Add folders"
      mode="multi"
      disabledIds={['work|decisions/', 'personal|journal/']}
      defaultExpanded={['work', 'personal']}
      onValueChange={() => {}}
      formatPath={folderPath}
      searchPlaceholder="Search folders"
      trigger={<Plus>Some already added</Plus>}
    />
  </Block>
);
