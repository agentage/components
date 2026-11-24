'use client';
import { useState } from 'react';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  EntityCard,
  StatusBar,
  StatusGlyph,
  type StatusBarCell,
} from '../../src';
import { Block } from '../components/demo';

const GRID = 'grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3';

const TICKS: StatusBarCell[] = [
  { tone: 'success', label: 'Backup 1, done' },
  { tone: 'success', label: 'Backup 2, done' },
  { tone: 'destructive', label: 'Backup 3, failed' },
  { tone: 'success', label: 'Backup 4, done' },
  { tone: 'success', label: 'Backup 5, done' },
];

const menu = (
  <>
    <DropdownMenuItem>Open</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </>
);

const FACTS = [
  { label: 'Schedule', value: 'Every day 09:00' },
  { label: 'Next', value: 'in 19 h' },
  { label: 'Target', value: 'Main folder' },
  { label: 'Success', value: '83%' },
];

export const Example = () => {
  const [opened, setOpened] = useState(0);
  return (
    <Block
      caption={`The whole card opens the item (${opened} opens so far). The title is the button, and the menu stops at itself.`}
    >
      <div className={GRID}>
        <EntityCard
          title="Nightly backup"
          indicator={<StatusGlyph shape="dot" tone="success" label="Active" />}
          description="Copies the main folder to the archive disk every morning."
          facts={FACTS}
          footer={
            <>
              <StatusBar
                size="sm"
                label="Last 5 results of Nightly backup"
                cells={TICKS}
                slots={8}
              />
              <span>5 results</span>
            </>
          }
          menu={menu}
          onOpen={() => setOpened((n) => n + 1)}
        />
      </div>
    </Block>
  );
};

export const States = () => {
  const [selected, setSelected] = useState(true);
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="space-y-5">
      <Block caption="Selectable adds a checkbox and enabled adds a switch, both above the title button.">
        <div className={GRID}>
          <EntityCard
            title="Weekly digest"
            indicator={
              <StatusGlyph
                shape="dot"
                tone={enabled ? 'success' : 'muted'}
                label={enabled ? 'Active' : 'Paused'}
              />
            }
            description="Sends a summary of the week to the team."
            facts={FACTS.slice(0, 2)}
            selectable
            selected={selected}
            onSelectedChange={setSelected}
            enabled={enabled}
            onEnabledChange={setEnabled}
            menu={menu}
            onOpen={() => {}}
          />
        </div>
      </Block>
      <Block caption="The indicator can pulse for work in progress; a card with no footer or menu stays compact.">
        <div className={GRID}>
          <EntityCard
            title="Import records"
            indicator={<StatusGlyph shape="disc" tone="primary" pulse label="In progress" />}
            description="Reads the uploaded file and adds its rows."
            facts={[{ label: 'Source', value: 'records.csv' }]}
          />
        </div>
      </Block>
    </div>
  );
};
