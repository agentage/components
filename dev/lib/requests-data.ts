import type { ContentBlockData } from '../../src';

/** Docs-only sample requests for the master and detail pattern. `min` = minutes ago. */
export type RequestKind = 'approval' | 'question' | 'review' | 'failure' | 'outcome' | 'fyi';

export interface RequestItem {
  id: string;
  kind: RequestKind;
  title: string;
  sender: string;
  place: string;
  ref: string;
  min: number;
  unread: boolean;
  summary: string;
  body: ContentBlockData[];
  options?: string[];
}

const DOC_DIFF = [
  '   ## Refund policy',
  '-  Refunds are possible within 14 days.',
  '+  Refunds are possible within 30 days of the purchase date.',
  '+  A refund needs the order number.',
  '   ',
  '   ## Contact',
  '-  Write to the support desk.',
  '+  Write to the support desk or call the help line.',
];

export const REQUESTS: RequestItem[] = [
  {
    id: 'i1',
    kind: 'approval',
    title: 'Allow access to the finance folder for Grace Hopper?',
    sender: 'Ada Lovelace',
    place: 'Shared documents',
    ref: 'request 4812',
    min: 4,
    unread: true,
    summary: 'Grace needs read access to prepare the quarterly report.',
    body: [
      {
        type: 'callout',
        title: 'The request expires in 6 days',
        question: 'Give Grace read access to the finance folder until the end of the quarter?',
      },
      {
        type: 'facts',
        title: 'Request',
        copy: true,
        rows: [
          { label: 'Folder', value: 'shared/finance/2026', mono: true },
          { label: 'Access', value: 'Read only' },
          { label: 'Until', value: '31 Dec 2026' },
          { label: 'Asked by', value: 'Ada Lovelace, team lead' },
        ],
      },
      {
        type: 'text',
        text: 'Grace joins the reporting team next week. The folder holds the `2026` budget files. Nobody else asked for access this quarter.',
      },
    ],
  },
  {
    id: 'i2',
    kind: 'question',
    title: 'Which format for the yearly export?',
    sender: 'Alan Turing',
    place: 'Reports',
    ref: 'request 4807',
    min: 12,
    unread: true,
    summary: 'The export stops at step 2 until you pick one.',
    options: ['Spreadsheet', 'CSV', 'Decide later'],
    body: [
      {
        type: 'text',
        text: 'The export has 14 columns and about 9,000 rows. A spreadsheet keeps the formatting. CSV is smaller and opens anywhere.',
      },
      {
        type: 'facts',
        title: 'Options',
        rows: [
          { label: 'Spreadsheet', value: 'one file, formatting kept, 4 MB' },
          { label: 'CSV', value: 'one file per sheet, plain text, 1 MB' },
          { label: 'Blocks', value: 'step 2 of 5: the export format' },
        ],
      },
    ],
  },
  {
    id: 'i4',
    kind: 'review',
    title: 'Plan: move the help center to the new site',
    sender: 'Alan Turing',
    place: 'Website',
    ref: 'request 4807',
    min: 18,
    unread: true,
    summary: '5 steps, 3 people, about 2 weeks.',
    body: [
      {
        type: 'steps',
        copy: true,
        steps: [
          { title: 'Copy the pages', detail: '412 pages, images included', state: 'done' },
          {
            title: 'Fix the links',
            detail: 'old addresses forward to the new ones',
            state: 'active',
          },
          { title: 'Review the top 50 pages', detail: 'Grace and Ada share the list' },
          { title: 'Switch the address', detail: 'on a Monday morning' },
          { title: 'Remove the old site', detail: 'after 30 days without errors' },
        ],
      },
      { type: 'text', text: 'Not in this version: translated pages and the search index.' },
    ],
  },
  {
    id: 'i5',
    kind: 'review',
    title: 'Refund policy update is ready for review',
    sender: 'Grace Hopper',
    place: 'Policies',
    ref: 'document 131',
    min: 26,
    unread: true,
    summary: '4 lines changed in 1 document. Legal checks passed.',
    body: [
      {
        type: 'checks',
        source: { href: '#checks', label: 'Checks of document 131' },
        rows: [
          { label: 'Spelling', value: 'no issues' },
          { label: 'Links', value: '12 of 12' },
          {
            label: 'Legal review',
            value: 'no findings',
            detail: 'Read 2 sections, 3 rules applied, nothing to report.',
          },
        ],
      },
      {
        type: 'diff',
        copy: true,
        files: [
          {
            path: 'policies/refunds.md',
            hunks: [{ header: '@@ -4,7 +4,8 @@ Refund policy', lines: DOC_DIFF }],
          },
        ],
      },
      { type: 'text', text: 'Before: 14 days to ask for a refund. After: 30 days.' },
    ],
  },
  {
    id: 'i6',
    kind: 'failure',
    title: 'Nightly backup failed: 2 of 41 folders not copied',
    sender: 'Nightly backup',
    place: 'Storage',
    ref: 'job 4771',
    min: 95,
    unread: true,
    summary: 'Both failures are in the archive folders. The first failure this month.',
    body: [
      {
        type: 'checks',
        rows: [
          { label: 'archive/2024 copied', status: 'fail', value: 'timeout' },
          { label: 'archive/2025 copied', status: 'fail', value: 'timeout' },
          { label: '39 other folders', value: '39 of 39' },
        ],
      },
      {
        type: 'log',
        copy: true,
        tail: 6,
        lines: [
          'backup: 41 folders',
          'PASS documents',
          'PASS reports',
          'PASS images',
          'WARN storage slow at 03:12:40',
          'FAIL archive/2024',
          '  no answer in 120 s',
          'FAIL archive/2025',
          '  no answer in 120 s',
          '39 copied, 2 failed',
        ],
      },
      {
        type: 'text',
        text: 'Probable cause: the storage was slow during the two copies. A second attempt can prove it.',
      },
    ],
  },
  {
    id: 'i7',
    kind: 'failure',
    title: 'Update of the search service to 0.4.2 was rolled back',
    sender: 'Release service',
    place: 'Search',
    ref: 'job 4760',
    min: 190,
    unread: false,
    summary: 'The health check did not report the new version in 120 s.',
    body: [
      {
        type: 'log',
        lines: [
          'check: /health version',
          '  want 0.4.2',
          '  got  0.4.1 (previous)',
          'FAIL criterion 1 of 3: version',
          'rollback: search to 0.4.1',
          'rollback: done in 14 s',
        ],
      },
    ],
  },
  {
    id: 'i8',
    kind: 'outcome',
    title: 'Research ready: help center layouts',
    sender: 'Ada Lovelace',
    place: 'Research',
    ref: 'report 4805',
    min: 9,
    unread: true,
    summary: '6 layouts compared, 3 picked. 7 sources opened.',
    body: [
      { type: 'text', text: 'The three layouts that differ most in structure:' },
      {
        type: 'steps',
        title: 'Picked layouts',
        steps: [
          { title: 'List and reading pane', detail: 'the desktop default', state: 'done' },
          { title: 'Focus view', detail: 'one page on the screen, good on a phone', state: 'done' },
          { title: 'Cards in groups', detail: 'the answer is on the card', state: 'done' },
        ],
      },
    ],
  },
  {
    id: 'i10',
    kind: 'outcome',
    title: 'Security review finished: 6 findings, 6 fixed',
    sender: 'Grace Hopper',
    place: 'Security',
    ref: 'report 4779',
    min: 140,
    unread: false,
    summary: 'No open finding. The report has one page.',
    body: [
      {
        type: 'checks',
        title: 'Findings',
        rows: [
          { label: 'Old accounts removed', value: 'fixed' },
          { label: 'Shared links expire', value: 'fixed' },
          { label: 'Export needs a second sign-in', value: 'fixed' },
          { label: '3 smaller findings', value: 'fixed' },
        ],
      },
    ],
  },
  {
    id: 'i11',
    kind: 'fyi',
    title: 'The weekly updates were installed on 7 servers',
    sender: 'Update service',
    place: '7 servers',
    ref: 'job 4741',
    min: 300,
    unread: false,
    summary: 'All checks are green. No restart was needed.',
    body: [{ type: 'text', text: 'Servers: web-1, web-2, db-1, db-2, mail, search, backup.' }],
  },
  {
    id: 'i12',
    kind: 'fyi',
    title: 'The release calendar was updated',
    sender: 'Alan Turing',
    place: 'Documents',
    ref: 'document 4807',
    min: 20,
    unread: false,
    summary: 'Step 1 is marked done.',
    body: [{ type: 'text', text: 'File: `plans/release-calendar.md`. One line changed.' }],
  },
];

export const KIND_LABEL: Record<RequestKind, string> = {
  approval: 'Approval',
  question: 'Question',
  review: 'Review',
  failure: 'Failure',
  outcome: 'Outcome',
  fyi: 'Note',
};

export const GROUP_OF: Record<RequestKind, { key: string; label: string }> = {
  approval: { key: 'wait', label: 'Needs attention' },
  question: { key: 'wait', label: 'Needs attention' },
  review: { key: 'review', label: 'To review' },
  failure: { key: 'review', label: 'To review' },
  outcome: { key: 'info', label: 'For your information' },
  fyi: { key: 'info', label: 'For your information' },
};

export const ago = (min: number): string =>
  min < 60
    ? `${String(min)} min`
    : min < 1440
      ? `${String(Math.round(min / 60))} h`
      : `${String(Math.round(min / 1440))} d`;

export const waits = (it: RequestItem): boolean => it.kind === 'approval' || it.kind === 'question';

const LOADED = Date.now();
/** The moment `min` minutes before the page loaded. */
export const at = (min: number): number => LOADED - min * 60_000;
