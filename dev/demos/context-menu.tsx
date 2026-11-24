'use client';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  EntityList,
  Kbd,
} from '../../src';
import { Block } from '../components/demo';

const FILES = ['README.md', 'roadmap.md', 'notes/standup.md'];

export const Example = () => (
  <Block
    caption={
      <>
        Right-click a file, or focus one and press <Kbd>Shift</Kbd> + <Kbd>F10</Kbd>. The menu opens
        at the pointer.
      </>
    }
  >
    <EntityList className="max-w-md">
      {FILES.map((file) => (
        <ContextMenu
          key={file}
          trigger={
            <button
              type="button"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-ui text-foreground transition-colors duration-[140ms] hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              {file}
            </button>
          }
        >
          <ContextMenuLabel>{file}</ContextMenuLabel>
          <ContextMenuItem>Rename</ContextMenuItem>
          <ContextMenuItem>Copy path</ContextMenuItem>
          <ContextMenuItem disabled>Move (not allowed)</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenu>
      ))}
    </EntityList>
  </Block>
);
