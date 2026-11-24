import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as AlertDialog from '../demos/alert-dialog';
import * as Command from '../demos/command';
import * as ContextMenu from '../demos/context-menu';
import * as DropdownMenu from '../demos/dropdown-menu';
import * as HoverCard from '../demos/hover-card';
import * as InspectorPanel from '../demos/inspector-panel';
import * as Modal from '../demos/modal';
import * as OverlayPortals from '../demos/overlay-portals';
import * as Popover from '../demos/popover';
import * as Resizable from '../demos/resizable';
import * as ScrollArea from '../demos/scroll-area';
import * as Sheet from '../demos/sheet';
import * as Tooltip from '../demos/tooltip';

export const OVERLAYS: CategoryEntry = {
  slug: 'overlays',
  label: 'Overlays',
  description: 'Surfaces above the page: dialogs, panels, popovers, menus.',
  components: [
    {
      slug: 'modal',
      name: 'Modal',
      core: true,
      description: 'A centred dialog with a title bar and a footer.',
      exports: ['Modal', 'ModalFooter'],
      parts: [],
      demos: sections(Modal),
    },
    {
      slug: 'sheet',
      name: 'Sheet',
      description: 'A dialog docked to the left or right edge.',
      exports: ['Sheet'],
      parts: [],
      demos: sections(Sheet),
    },
    {
      slug: 'alert-dialog',
      name: 'AlertDialog',
      core: true,
      description: 'A confirm dialog with a safe default and Button actions.',
      exports: ['AlertDialog'],
      parts: ['Button'],
      demos: sections(AlertDialog),
    },
    {
      slug: 'inspector-panel',
      name: 'InspectorPanel',
      core: true,
      description: 'An in-page docked, resizable right panel for the selected item.',
      exports: ['InspectorPanel'],
      parts: ['ResizableHandle', 'usePersistedState'],
      demos: sections(InspectorPanel),
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
      slug: 'hover-card',
      name: 'HoverCard',
      description: 'A preview card on hover or focus.',
      exports: ['HoverCard'],
      parts: [],
      demos: sections(HoverCard),
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
      slug: 'context-menu',
      name: 'ContextMenu',
      description: 'The same menu at the pointer on right click.',
      exports: ['ContextMenu', 'ContextMenuItem', 'ContextMenuLabel', 'ContextMenuSeparator'],
      parts: [],
      demos: sections(ContextMenu),
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
    {
      slug: 'scroll-area',
      name: 'ScrollArea',
      description: 'A scroll container with a focusable viewport.',
      exports: ['ScrollArea'],
      parts: [],
      demos: sections(ScrollArea),
    },
    {
      slug: 'overlay-portals',
      name: 'Overlay portals',
      description: 'Every floating surface portals to the body and stacks on the z-index scale.',
      exports: ['Tooltip', 'DropdownMenu', 'Popover', 'HoverCard', 'Modal'],
      parts: [],
      demos: sections(OverlayPortals),
    },
  ],
};
