'use client';
import { useState } from 'react';
import { ToggleGroup } from '../../src';
import { Block } from '../components/demo';
import { BotIcon, ServerIcon } from '../lib/icons';

export const Example = () => {
  const [theme, setTheme] = useState('dark');
  return (
    <Block caption="The default grid gives each option an equal cell; columns sets how many per row.">
      <div className="max-w-sm">
        <ToggleGroup
          aria-label="Theme"
          value={theme}
          onValueChange={setTheme}
          columns={3}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' },
          ]}
        />
      </div>
    </Block>
  );
};

export const Variants = () => {
  const [view, setView] = useState('list');
  const [range, setRange] = useState('7d');
  return (
    <div className="space-y-5">
      <Block caption="The segmented variant is one joined 28 px control; the selected option gets an accent ring.">
        <ToggleGroup
          variant="segmented"
          aria-label="Range"
          value={range}
          onValueChange={setRange}
          options={[
            { value: '24h', label: '24 h' },
            { value: '7d', label: '7 d' },
            { value: '30d', label: '30 d' },
          ]}
        />
      </Block>
      <Block caption="Icon-only options keep their label as the accessible name.">
        <ToggleGroup
          variant="segmented"
          aria-label="View"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'list', label: 'List', icon: <ServerIcon />, iconOnly: true },
            { value: 'cards', label: 'Cards', icon: <BotIcon />, iconOnly: true },
          ]}
        />
      </Block>
    </div>
  );
};

export const States = () => {
  const [value, setValue] = useState('a');
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ];
  return (
    <div className="max-w-sm space-y-5">
      <Block caption="Error marks the group when no valid choice was made.">
        <ToggleGroup
          error
          aria-label="Required choice"
          value={value}
          onValueChange={setValue}
          columns={2}
          options={options}
        />
      </Block>
      <Block caption="Vertical stacks the options in one column.">
        <ToggleGroup
          vertical
          aria-label="Stacked choice"
          value={value}
          onValueChange={setValue}
          options={options}
        />
      </Block>
    </div>
  );
};
