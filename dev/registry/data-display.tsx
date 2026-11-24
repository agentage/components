import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as Card from '../demos/card';
import * as CodeBlock from '../demos/code-block';
import * as ContentBlocks from '../demos/content-blocks';
import * as DescriptionList from '../demos/description-list';
import * as EmptyState from '../demos/empty-state';
import * as EntityCard from '../demos/entity-card';
import * as StatusBar from '../demos/status-bar';
import * as LogView from '../demos/log-view';
import * as DataTree from '../demos/data-tree';
import * as RelativeTime from '../demos/relative-time';
import * as Progress from '../demos/progress';
import * as StatCard from '../demos/stat-card';

export const DATA_DISPLAY: CategoryEntry = {
  slug: 'data-display',
  label: 'Data display',
  description: 'Cards, facts, meters and blocks that show values.',
  components: [
    {
      slug: 'card',
      name: 'Card',
      core: true,
      description:
        'The one card surface, with loading, empty, error and stale states and a meta footer.',
      exports: [
        'Card',
        'CardHeader',
        'CardTitle',
        'CardDescription',
        'CardAction',
        'CardContent',
        'CardFooter',
      ],
      parts: ['cardSurface', 'Skeleton', 'EmptyState', 'RelativeTime', 'useAnnounce'],
      demos: sections(Card),
    },
    {
      slug: 'entity-card',
      name: 'EntityCard',
      description: 'A dense rich card: indicator, title, description, facts and footer.',
      exports: ['EntityCard'],
      parts: ['Card', 'Checkbox', 'Switch'],
      demos: sections(EntityCard),
    },
    {
      slug: 'stat-card',
      name: 'StatCard',
      description:
        'A headline figure with period, trend, comparison, chart, facts, breakdown, history, states and source.',
      exports: ['StatCard'],
      parts: ['Progress', 'Sparkline', 'MiniBars', 'StatusBar', 'Card'],
      demos: sections(StatCard),
    },
    {
      slug: 'description-list',
      name: 'DescriptionList',
      core: true,
      description:
        'Label and value pairs in one or two columns, with groups; variant="editable" holds Property editors.',
      exports: [
        'DescriptionList',
        'DescriptionGroup',
        'DescriptionTerm',
        'DescriptionDetail',
        'Property',
        'PropertyValue',
        'PropertyText',
        'PropertySelect',
        'PropertyMultiSelect',
        'PropertyDate',
      ],
      parts: ['CopyButton', 'InlineEdit', 'DropdownMenu', 'Popover', 'Badge'],
      demos: sections(DescriptionList),
    },
    {
      slug: 'progress',
      name: 'Progress',
      core: true,
      description:
        'A bar with an optional value or label row, quota thresholds as a meter, or segments with a legend.',
      exports: ['Progress'],
      parts: ['StatusGlyph', 'resolveUsageLevel'],
      demos: sections(Progress),
    },
    {
      slug: 'status-bar',
      name: 'StatusBar',
      description: 'Status history as ticks coded by shape and colour, with a tooltip per tick.',
      exports: ['StatusBar'],
      parts: ['useRovingFocus'],
      demos: sections(StatusBar),
    },
    {
      slug: 'relative-time',
      name: 'RelativeTime',
      description: 'A time that keeps itself current on one shared timer, exact time on hover.',
      exports: ['RelativeTime'],
      parts: [],
      demos: sections(RelativeTime),
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
    {
      slug: 'code-block',
      name: 'CodeBlock',
      core: true,
      description: 'Code with an optional language bar and a copy button.',
      exports: ['CodeBlock', 'InlineCode'],
      parts: [],
      demos: sections(CodeBlock),
    },
    {
      slug: 'content-blocks',
      name: 'ContentBlocks',
      description: 'A typed detail body: text, facts, steps, checks, diff, log and callout.',
      exports: ['ContentBlocks', 'ContentBlock'],
      parts: ['GroupHeader', 'Disclosure', 'CheckList', 'DescriptionList', 'Alert', 'CopyButton'],
      demos: sections(ContentBlocks),
    },
    {
      slug: 'empty-state',
      name: 'EmptyState',
      core: true,
      description: 'What to show when there is nothing yet, with a next action.',
      exports: ['EmptyState'],
      parts: [],
      demos: sections(EmptyState),
    },
  ],
};
