import type { CategoryEntry } from '../registry';
import { more, sections } from './sections';
import * as Accordion from '../demos/accordion';
import * as Announce from '../demos/announce';
import * as Card from '../demos/card';
import * as CheckList from '../demos/check-list';
import * as CodeBlock from '../demos/code-block';
import * as Collapsible from '../demos/collapsible';
import * as ContentBlocks from '../demos/content-blocks';
import * as DescriptionList from '../demos/description-list';
import * as EmptyState from '../demos/empty-state';
import * as Progress from '../demos/progress';
import * as RelativeTime from '../demos/relative-time';
import * as Sparkline from '../demos/sparkline';
import * as StatCard from '../demos/stat-card';
import * as StatusBar from '../demos/status-bar';
import * as StepList from '../demos/step-list';

export const DISPLAY: CategoryEntry = {
  slug: 'display',
  label: 'Display',
  description: 'Cards, facts, meters, status, disclosure and content blocks.',
  components: [
    {
      slug: 'card',
      name: 'Card',
      core: true,
      description:
        'The one card surface: parts, loading, empty, error and stale states, a meta line, and the item card composition.',
      exports: [
        'Card',
        'CardHeader',
        'CardTitle',
        'CardDescription',
        'CardAction',
        'CardContent',
        'CardFooter',
        'CardMeta',
        'useAnnounce',
      ],
      parts: ['Skeleton', 'EmptyState', 'RelativeTime'],
      demos: [...sections(Card), ...more('useAnnounce', Announce)],
    },
    {
      slug: 'stat-card',
      name: 'StatCard',
      description:
        'A key number: title, value, trend and one hint line; charts, facts and history go in as children.',
      exports: ['StatCard'],
      parts: ['CardMeta', 'Sparkline', 'Progress', 'DescriptionList', 'StatusBar'],
      demos: sections(StatCard),
    },
    {
      slug: 'sparkline',
      name: 'Sparkline',
      description:
        'A trend line or mini bars at a small fixed height, for StatCard and table cells.',
      exports: ['Sparkline', 'MiniBars'],
      parts: [],
      demos: sections(Sparkline),
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
      exports: ['ContentBlocks'],
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
    {
      slug: 'accordion',
      name: 'Accordion',
      description:
        'Collapsible items, one or many open, as plain rows or 32 px section headers that can remember what is open; Collapsible is the single open and shut body.',
      exports: [
        'Accordion',
        'AccordionItem',
        'AccordionTrigger',
        'AccordionContent',
        'Collapsible',
        'CollapsibleTrigger',
        'CollapsibleContent',
      ],
      parts: ['Disclosure', 'DisclosureChevron', 'Count', 'useControlled'],
      demos: [...sections(Accordion), ...more('Collapsible', Collapsible)],
    },
    {
      slug: 'step-list',
      name: 'StepList and CheckList',
      description:
        'A step timeline with expandable detail, and a check list of status or checkbox rows.',
      exports: ['StepList', 'Step', 'CheckList', 'CheckItem'],
      parts: ['Disclosure', 'StatusGlyph', 'useControlled', 'useRovingFocus'],
      demos: [...sections(StepList), ...more('CheckList', CheckList)],
    },
  ],
};
