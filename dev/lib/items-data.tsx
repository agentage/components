import { Avatar, PriorityGlyph, StatusGlyph, type Priority } from '../../src';

/** Docs-only sample work items. Due is days from today. */
export type ItemStatus = 'backlog' | 'todo' | 'progress' | 'review' | 'done' | 'canceled';

export interface DemoItem {
  id: string;
  title: string;
  status: ItemStatus;
  group: string;
  priority: Priority;
  assignee: string | null;
  labels: string[];
  due: number | null;
}

export const STATUS_LABEL: Record<ItemStatus, string> = {
  backlog: 'Backlog',
  todo: 'Todo',
  progress: 'In progress',
  review: 'In review',
  done: 'Done',
  canceled: 'Canceled',
};

const STATUS_GLYPH = {
  backlog: { shape: 'dashed', tone: 'muted' },
  todo: { shape: 'ring', tone: 'muted' },
  progress: { shape: 'half', tone: 'primary' },
  review: { shape: 'three-quarters', tone: 'info' },
  done: { shape: 'check', tone: 'success' },
  canceled: { shape: 'slash', tone: 'muted' },
} as const;

export const StatusIcon = ({ status }: { status: ItemStatus }) => (
  <StatusGlyph {...STATUS_GLYPH[status]} />
);

export const STATUSES = Object.keys(STATUS_LABEL) as ItemStatus[];
export const PRIORITIES: Priority[] = ['urgent', 'high', 'medium', 'low', 'none'];
export const LABELS = ['bug', 'feature', 'chore', 'docs', 'test', 'infra', 'security'];

export const PEOPLE = [
  { k: 'al', n: 'Ada Lovelace', team: false },
  { k: 'gh', n: 'Grace Hopper', team: false },
  { k: 'at', n: 'Alan Turing', team: false },
  { k: 'ops', n: 'Operations', team: true },
  { k: 'sup', n: 'Support', team: true },
];

export const personName = (k: string | null): string => {
  const p = PEOPLE.find((x) => x.k === k);
  return p ? `${p.n}${p.team ? ' (team)' : ''}` : 'No assignee';
};

export const PersonAvatar = ({ k }: { k: string | null }) => {
  const p = PEOPLE.find((x) => x.k === k);
  if (!p)
    return (
      <span
        className="size-[18px] rounded-full border border-dashed border-muted-foreground"
        aria-hidden="true"
      />
    );
  return p.team ? (
    <Avatar size="2xs" shape="square" name={p.n} aria-hidden="true" />
  ) : (
    <Avatar size="2xs" name={p.n} tone="primary" aria-hidden="true" />
  );
};

export const GROUPS = [
  { k: 'web', n: 'Website', tone: 'bg-info' },
  { k: 'ops', n: 'Operations', tone: 'bg-success' },
  { k: 'doc', n: 'Documentation', tone: 'bg-primary' },
  { k: 'fin', n: 'Finance', tone: 'bg-warning' },
];

export const GroupDot = ({ k }: { k: string }) => (
  <span
    className={`size-2 shrink-0 rounded-full ${GROUPS.find((p) => p.k === k)?.tone ?? 'bg-muted-foreground'}`}
    aria-hidden="true"
  />
);

export const PriorityIcon = ({ p }: { p: Priority }) => <PriorityGlyph priority={p} label={null} />;

const T = (
  n: number,
  title: string,
  status: ItemStatus,
  group: string,
  priority: Priority,
  assignee: string | null,
  labels: string[],
  due: number | null
): DemoItem => ({
  id: `ITM-${String(n)}`,
  title,
  status,
  group,
  priority,
  assignee,
  labels,
  due,
});

export const ITEMS: DemoItem[] = [
  T(1, 'Add a status page to the website', 'done', 'web', 'high', 'ops', ['feature'], -6),
  T(2, 'Cache the health check result', 'done', 'web', 'medium', 'al', ['chore'], null),
  T(3, 'Move sign-in to the shared module', 'review', 'web', 'high', 'gh', ['security'], 2),
  T(4, 'Publish the public record types', 'progress', 'web', 'high', 'gh', ['feature'], 3),
  T(5, 'Log one event per request', 'todo', 'web', 'medium', null, ['feature'], 8),
  T(6, 'Remove the old logger copy', 'backlog', 'web', 'low', null, ['chore'], null),
  T(7, 'Write the release notes for 2.4', 'todo', 'web', 'low', 'at', ['docs'], 5),
  T(8, 'Fix the setup on machines without a proxy', 'progress', 'ops', 'urgent', 'al', ['bug'], -1),
  T(9, 'Template picker for new reports', 'review', 'ops', 'medium', 'al', ['feature'], 4),
  T(10, 'Show the host name in the status output', 'todo', 'ops', 'medium', 'ops', ['feature'], 9),
  T(11, 'Retry the update when the mirror lags', 'progress', 'ops', 'high', 'ops', ['bug'], 2),
  T(12, 'Keep the data when a module is removed', 'backlog', 'ops', 'low', null, ['feature'], null),
  T(15, 'Edit a document in place', 'progress', 'doc', 'high', 'gh', ['feature'], 6),
  T(
    16,
    'Files page: keyboard navigation',
    'review',
    'doc',
    'medium',
    'sup',
    ['feature', 'test'],
    3
  ),
  T(17, 'Files page: rename and move', 'todo', 'doc', 'medium', 'at', ['feature'], 10),
  T(20, 'Warn about files above 1 MB', 'canceled', 'doc', 'low', null, ['feature'], null),
  T(21, 'Add a third server to staging', 'progress', 'fin', 'high', 'at', ['infra'], 1),
  T(23, 'Backup drill: restore the invoices', 'todo', 'fin', 'urgent', 'at', ['infra'], -2),
];

export const dueDate = (days: number | null, today = new Date()): Date | null =>
  days === null ? null : new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
