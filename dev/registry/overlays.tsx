import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as Command from '../demos/command';
import * as Dialog from '../demos/dialog';
import * as DropdownMenu from '../demos/dropdown-menu';
import * as Popover from '../demos/popover';
import * as Resizable from '../demos/resizable';
import * as Sheet from '../demos/sheet';
import * as Tooltip from '../demos/tooltip';

export const OVERLAYS: CategoryEntry = {
  slug: 'overlays',
  label: 'Overlays',
  description: 'Dialogs, sheets, popovers, menus and split panes.',
  components: [
    {
      slug: 'dialog',
      name: 'Dialog',
      core: true,
      description: 'A centred modal dialog; with onConfirm, a confirm dialog with a safe default.',
      exports: ['Dialog', 'DialogFooter'],
      parts: ['Button', 'Input', 'Label'],
      demos: sections(Dialog),
    },
    {
      slug: 'sheet',
      name: 'Sheet',
      core: true,
      description: 'A side panel: a modal overlay, or docked in the page and resizable.',
      exports: ['Sheet'],
      parts: ['ResizableHandle', 'usePersistedState'],
      demos: sections(Sheet),
    },
    {
      slug: 'popover',
      name: 'Popover',
      description: 'An anchored floating surface for small forms and pickers.',
      exports: ['Popover'],
      parts: [],
      demos: sections(Popover),
    },
    {
      slug: 'tooltip',
      name: 'Tooltip',
      core: true,
      description: 'A short label on hover or focus.',
      exports: ['Tooltip'],
      parts: [],
      demos: sections(Tooltip),
    },
    {
      slug: 'dropdown-menu',
      name: 'DropdownMenu',
      core: true,
      description: 'The menu: 28 px items, 13 px text, checkbox and radio items.',
      exports: [
        'DropdownMenu',
        'DropdownMenuItem',
        'DropdownMenuLabel',
        'DropdownMenuSeparator',
        'DropdownMenuCheckboxItem',
        'DropdownMenuRadioGroup',
        'DropdownMenuRadioItem',
      ],
      parts: [],
      demos: sections(DropdownMenu),
    },
    {
      slug: 'command',
      name: 'Command',
      core: true,
      description: 'A command palette: search over grouped items.',
      exports: ['Command', 'CommandGroup', 'CommandItem', 'CommandSeparator', 'CommandEmpty'],
      parts: ['Kbd'],
      demos: sections(Command),
    },
    {
      slug: 'resizable',
      name: 'Resizable',
      core: true,
      description: 'Split panes resized by drag or keyboard, in percent or in px.',
      exports: [
        'ResizablePanelGroup',
        'ResizablePanel',
        'ResizableHandle',
        'ResizableSplit',
        'ResizableSplitPrepaint',
        'useResizableSplit',
      ],
      parts: [],
      demos: sections(Resizable),
    },
  ],
};
