'use client';
import { useState } from 'react';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  Kbd,
} from '../../src';
import { Block } from '../components/demo';
import { UiIcon } from '../lib/ui-icons';

export const Example = () => {
  const [open, setOpen] = useState(false);
  const close = (): void => setOpen(false);
  return (
    <Block
      caption={
        <>
          A palette over grouped items. Type to filter, <Kbd>↑</Kbd> <Kbd>↓</Kbd> to move,{' '}
          <Kbd>Enter</Kbd> to choose.
        </>
      }
    >
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open palette <Kbd>⌘K</Kbd>
      </Button>
      <Command open={open} onOpenChange={setOpen}>
        <CommandGroup heading="Go to">
          <CommandItem icon={<UiIcon name="monitor" />} shortcut="⌘1" onClick={close}>
            Dashboard
          </CommandItem>
          <CommandItem icon={<UiIcon name="folder" />} shortcut="⌘2" onClick={close}>
            Folders
          </CommandItem>
          <CommandItem icon={<UiIcon name="cloud" />} shortcut="⌘3" onClick={close}>
            Services
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem icon={<UiIcon name="plus" />} onClick={close}>
            New item
          </CommandItem>
          <CommandItem icon={<UiIcon name="shield" />} onClick={close}>
            Settings
          </CommandItem>
        </CommandGroup>
        <CommandEmpty>No results found.</CommandEmpty>
      </Command>
    </Block>
  );
};
