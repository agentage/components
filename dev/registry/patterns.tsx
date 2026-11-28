import type { ComponentType } from 'react';
import type { CategoryEntry, DemoEntry } from '../registry';
import * as Board from '../demos/patterns/board';
import * as CardGrid from '../demos/patterns/card-grid';
import * as Chat from '../demos/patterns/chat';
import * as ChatExpanded from '../demos/patterns/chat-expanded';
import * as ChatOutcome from '../demos/patterns/chat-outcome';
import * as ChatRun from '../demos/patterns/chat-run';
import * as Catalog from '../demos/patterns/catalog';
import * as DashboardGrid from '../demos/patterns/dashboard-grid';
import * as DetailPane from '../demos/patterns/detail-pane';
import * as FileBrowser from '../demos/patterns/file-browser';
import * as GroupedList from '../demos/patterns/grouped-list';
import * as GroupedTable from '../demos/patterns/grouped-table';
import * as HistoryDetail from '../demos/patterns/history-detail';
import * as IncidentTimeline from '../demos/patterns/incident-timeline';
import * as ListPage from '../demos/patterns/list-page';
import * as LogsExplorer from '../demos/patterns/logs-explorer';
import * as MasterDetail from '../demos/patterns/master-detail';
import * as MonitorDetail from '../demos/patterns/monitor-detail';
import * as PageHeaderProgress from '../demos/patterns/page-header-progress';
import * as Secrets from '../demos/patterns/secrets';
import * as SettingsForm from '../demos/patterns/settings-form';
import * as StatusPage from '../demos/patterns/status-page';

/** One page section per demo module, in the order given; the first is the Example. */
const parts = (...entries: [string, { Example: ComponentType }][]): DemoEntry[] =>
  entries.map(([title, mod]) => ({ title, Component: mod.Example }));

export const PATTERNS: CategoryEntry = {
  slug: 'patterns',
  label: 'Patterns',
  description: 'Composed screens built only from catalog components.',
  bare: true,
  components: [
    {
      slug: 'chat',
      name: 'Chat',
      description:
        'A docked chat with preset context, a run with tool calls and an approval, the outcome, and the expanded layout with its support panel.',
      exports: [],
      sources: [
        'chat',
        'chat-run',
        'chat-outcome',
        'chat-expanded',
        'chat.parts',
        'chat.run',
        'chat.context',
        'chat.session',
      ],
      demos: parts(
        ['Example', Chat],
        ['A run and an approval', ChatRun],
        ['Outcome and the compact strip', ChatOutcome],
        ['Expanded with the support panel', ChatExpanded]
      ),
    },
    {
      slug: 'list-page',
      name: 'List page',
      description:
        'A toolbar over a table with filters, display options and a switch to cards, plus grouped variants with bulk actions.',
      exports: [],
      sources: ['list-page', 'grouped-list', 'grouped-table'],
      demos: parts(
        ['Example', ListPage],
        ['Grouped by day', GroupedList],
        ['Grouped by status with bulk actions', GroupedTable]
      ),
    },
    {
      slug: 'card-grid',
      name: 'Card grid',
      description:
        'A responsive grid of cards: entity cards with an indicator, and cards in every state under a date range.',
      exports: [],
      sources: ['card-grid', 'dashboard-grid'],
      demos: parts(['Example', CardGrid], ['Cards in every state', DashboardGrid]),
    },
    {
      slug: 'catalog',
      name: 'Catalog with views',
      description: 'Simple, advanced and admin views: pill tabs, selection and an inspector panel.',
      exports: [],
      sources: ['catalog'],
      demos: parts(['Example', Catalog]),
    },
    {
      slug: 'board',
      name: 'Board',
      description:
        'A data view as a board: drag and drop, Alt + arrows, folding columns and swimlanes.',
      exports: [],
      sources: ['board'],
      demos: parts(['Example', Board]),
    },
    {
      slug: 'master-detail',
      name: 'Master and detail',
      description:
        'A grouped list beside a resizable reading pane with content blocks and an action bar.',
      exports: [],
      sources: ['master-detail'],
      demos: parts(['Example', MasterDetail]),
    },
    {
      slug: 'detail',
      name: 'Detail view',
      description:
        'A detail aside with facts, status and waiting states, an updates timeline you can add to, and a header with progress.',
      exports: [],
      sources: ['detail-pane', 'incident-timeline', 'page-header-progress'],
      demos: parts(
        ['Example', DetailPane],
        ['Updates timeline', IncidentTimeline],
        ['Header with progress', PageHeaderProgress]
      ),
    },
    {
      slug: 'history-detail',
      name: 'History list and detail',
      description:
        'A filtered list of results that opens a detail page with tabs, a log view, steps and facts.',
      exports: [],
      sources: ['history-detail'],
      demos: parts(['Example', HistoryDetail]),
    },
    {
      slug: 'settings-form',
      name: 'Settings form',
      description:
        'Sections of fields beside an index with a dirty bar, plus secret variables with a show-once token and delete by typing.',
      exports: [],
      sources: ['settings-form', 'secrets'],
      demos: parts(['Example', SettingsForm], ['Secrets and variables', Secrets]),
    },
    {
      slug: 'logs-explorer',
      name: 'Logs explorer',
      description:
        'Search, level filter and range over a live log view, a level bar and an inspector with the fields.',
      exports: [],
      sources: ['logs-explorer'],
      demos: parts(['Example', LogsExplorer]),
    },
    {
      slug: 'file-browser',
      name: 'File browser',
      description:
        'A navigation tree beside a preview that switches between Markdown, code, data, a table and an image.',
      exports: [],
      sources: ['file-browser'],
      demos: parts(['Example', FileBrowser]),
    },
    {
      slug: 'monitoring',
      name: 'Monitoring',
      description:
        'A status page with an overall banner, status rows that open a matrix and incidents, plus a monitor detail with checks and stat cards.',
      exports: [],
      sources: ['status-page', 'monitor-detail'],
      demos: parts(['Example', StatusPage], ['Monitor detail', MonitorDetail]),
    },
  ],
};
