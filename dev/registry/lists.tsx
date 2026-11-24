import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as DataTable from '../demos/data-table';
import * as DataView from '../demos/data-view';
import * as EntityList from '../demos/entity-list';
import * as GroupHeader from '../demos/group-header';
import * as ListToolbar from '../demos/list-toolbar';
import * as Table from '../demos/table';

export const LISTS: CategoryEntry = {
  slug: 'lists',
  label: 'Lists and tables',
  description: 'Rows of items: lists, tables, the data view and their toolbar.',
  components: [
    {
      slug: 'list',
      name: 'List',
      core: true,
      description:
        'Rows of items: a frame for ListRows, or a grouped, selectable, keyboard list from `items`.',
      exports: ['EntityList', 'List', 'ListRow'],
      parts: ['rowVariants', 'GroupHeader', 'Disclosure', 'useRovingFocus', 'useControlled'],
      demos: sections(EntityList),
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
      slug: 'data-table',
      name: 'DataTable',
      core: true,
      description: 'Typed columns with sort, grouping, selection and row actions.',
      exports: ['DataTable'],
      parts: ['Table', 'GroupHeader', 'Disclosure', 'useRovingFocus', 'useControlled'],
      demos: sections(DataTable),
    },
    {
      slug: 'data-view',
      name: 'DataView',
      core: true,
      description:
        'A DataTable or cards behind one ListToolbar: search, filter, group, views, bulk bar.',
      exports: ['DataView'],
      parts: ['DataTable', 'EntityCard', 'ListToolbar'],
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
      slug: 'group-header',
      name: 'GroupHeader',
      description:
        'The 32 px group header and 42 px section header every list, table and stack uses.',
      exports: ['GroupHeader', 'Disclosure', 'DisclosureChevron', 'Count'],
      parts: ['DisclosureChevron', 'Count'],
      demos: sections(GroupHeader),
    },
  ],
};
