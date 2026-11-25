import type { CategoryEntry } from '../registry';
import { more, sections } from './sections';
import * as DataTree from '../demos/data-tree';
import * as DataView from '../demos/data-view';
import * as GroupHeader from '../demos/group-header';
import * as ListDemo from '../demos/list';
import * as ListToolbar from '../demos/list-toolbar';
import * as LogView from '../demos/log-view';
import * as Table from '../demos/table';

export const LISTS: CategoryEntry = {
  slug: 'lists',
  label: 'Lists and data',
  description: 'Rows, tables, the DataView, their toolbar, logs and data trees.',
  components: [
    {
      slug: 'list',
      name: 'List',
      core: true,
      description:
        'Rows of items: a frame for ListRows, or a grouped, selectable, keyboard list from `items`.',
      exports: ['List', 'ListRow', 'GroupHeader', 'Disclosure'],
      parts: ['GroupHeader', 'Disclosure', 'useRovingFocus'],
      demos: [...sections(ListDemo), ...more('Group header', GroupHeader)],
    },
    {
      slug: 'table',
      name: 'Table',
      core: true,
      description: 'Table parts with the dense look: 32 px header, 36 px rows.',
      exports: [
        'Table',
        'TableHeader',
        'TableBody',
        'TableRow',
        'TableHead',
        'TableCell',
        'TableCaption',
      ],
      parts: [],
      demos: sections(Table),
    },
    {
      slug: 'data-view',
      name: 'DataView',
      core: true,
      description:
        'The one data component: a table, cards or a board behind one toolbar, set up by its columns.',
      exports: ['DataView'],
      parts: ['Table', 'Card', 'ListToolbar', 'GroupHeader'],
      demos: sections(DataView),
    },
    {
      slug: 'list-toolbar',
      name: 'ListToolbar',
      core: true,
      description:
        'The one-row 45 px toolbar: search, filter menu, display menu, view switch, chips.',
      exports: [
        'ListToolbar',
        'ListToolbarEnd',
        'ToolbarSearch',
        'ToolbarToggle',
        'FilterMenu',
        'DisplayMenu',
        'ViewSwitch',
        'ActiveFilters',
        'useListControls',
      ],
      parts: [
        'controlVariants',
        'fieldVariants',
        'Badge',
        'ToggleGroup',
        'DropdownMenu',
        'useRovingFocus',
      ],
      demos: sections(ListToolbar),
    },
    {
      slug: 'log-view',
      name: 'LogView',
      description:
        'Windowed mono log: level glyphs, live tail, search marks and expandable fields.',
      exports: ['LogView'],
      parts: ['DataTree', 'RelativeTime', 'StatusGlyph'],
      demos: sections(LogView),
    },
    {
      slug: 'data-tree',
      name: 'DataTree',
      description: 'JSON as NavTree rows: type colours, search, copy path and value, paged arrays.',
      exports: ['DataTree'],
      parts: ['NavTree', 'NavRow', 'CopyButton'],
      demos: sections(DataTree),
    },
  ],
};
