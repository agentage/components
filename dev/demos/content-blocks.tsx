'use client';
import { Button, ContentBlocks, type ContentBlockData } from '../../src';
import { Block } from '../components/demo';

const DIFF = [
  '   const items = useItems();',
  '-  const live = items.filter((i) => i.age < 5000);',
  '+  const unread = items.filter((i) => !i.read);',
  '   return <List items={unread} />;',
];

const LOG = [
  'build: 41 checks',
  'PASS build > files > list',
  'PASS build > files > write',
  { id: 'w1', message: 'WARN build > worker restarted at 03:12:40', level: 'warn' as const },
  { id: 'f1', message: 'FAIL build > upload above the limit is refused', level: 'error' as const },
  '  expected status 413, received 502',
  '40 passed, 1 failed',
];

const TEXT: ContentBlockData = {
  type: 'text',
  text: 'I rebased the branch on `main` to remove a conflict in `src/report.ts`. The old history needs the lease flag.',
};

const STEPS: ContentBlockData = {
  type: 'steps',
  copy: true,
  steps: [
    { title: 'Create the folder', detail: 'reports, sheets, notes', state: 'done' },
    { title: 'Import the records', detail: 'from the shared file', state: 'active' },
    { title: 'Check the totals', detail: 'compare with last month' },
  ],
};

const CHECKS: ContentBlockData = {
  type: 'checks',
  source: { href: '#checks', label: 'Checks of the build' },
  rows: [
    { label: 'verify', value: '2 min 04 s' },
    { label: 'upload limit', status: 'fail', value: '502', detail: 'Expected 413, received 502.' },
    { label: '39 other checks', value: '39 of 39' },
  ],
};

export const Example = () => (
  <Block
    caption="Typed blocks, richer than markdown. Each framed block has a header with an icon, a title, a summary and a collapse toggle."
    className="max-w-[720px] space-y-3"
  >
    <ContentBlocks blocks={[TEXT, STEPS]} />
  </Block>
);

export const Variants = () => (
  <Block
    caption="The block types: callout with actions, facts with copy, checks with a source link, diff and log."
    className="max-w-[720px]"
  >
    <ContentBlocks
      blocks={[
        {
          type: 'callout',
          title: 'Waiting for approval',
          question: 'Allow the push with the lease flag?',
          actions: (
            <>
              <Button size="sm">Allow</Button>
              <Button size="sm" variant="outline">
                Deny
              </Button>
            </>
          ),
        },
        {
          type: 'facts',
          title: 'Command',
          copy: true,
          rows: [
            { label: 'Command', value: 'git push --force-with-lease', mono: true },
            { label: 'Folder', value: '~/work/reports', mono: true },
            { label: 'Branch', value: 'feature/totals (not protected)' },
          ],
        },
        CHECKS,
        {
          type: 'diff',
          copy: true,
          files: [
            { path: 'src/item-list.tsx', hunks: [{ header: '@@ -18,4 +18,4 @@', lines: DIFF }] },
          ],
        },
        { type: 'log', copy: true, tail: 4, lines: LOG },
      ]}
    />
  </Block>
);

export const States = () => (
  <Block
    caption="A block can start shut. A diff collapses per file; a long log ends with Show all."
    className="max-w-[720px]"
  >
    <ContentBlocks
      blocks={[
        { ...STEPS, defaultOpen: false, title: 'Plan (shut)' },
        { type: 'log', lines: LOG, tail: 3 },
      ]}
    />
  </Block>
);
