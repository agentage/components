'use client';
import {
  Badge,
  DropdownMenuItem,
  formatPropertyDate,
  PRIORITY_LABEL,
  type DataViewColumn,
} from '../../src';
import {
  dueDate,
  PersonAvatar,
  personName,
  PRIORITIES,
  PriorityIcon,
  GROUPS,
  GroupDot,
  STATUSES,
  STATUS_LABEL,
  StatusIcon,
  type DemoItem,
  type ItemStatus,
} from './items-data';

/** Docs-only: the columns of the grouped table demo. */
export const itemColumns = (): DataViewColumn<DemoItem>[] => [
  {
    key: 'priority',
    cardSlot: 'meta',
    header: <span className="sr-only">Priority</span>,
    label: 'Priority',
    width: 22,
    filter: 'multi',
    groupable: true,
    groupOrder: PRIORITIES,
    sortable: true,
    sortValue: (t) => PRIORITIES.indexOf(t.priority),
    formatValue: (v) => PRIORITY_LABEL[v as DemoItem['priority']],
    valueIcon: (v) => <PriorityIcon p={v as DemoItem['priority']} />,
    cell: (t) => <PriorityIcon p={t.priority} />,
  },
  {
    key: 'id',
    cardSlot: 'id',
    header: 'ID',
    className: 'min-w-18',
    nowrap: true,
    cell: (t) => <span className="font-mono text-xs text-muted-foreground">{t.id}</span>,
  },
  {
    key: 'status',
    header: <span className="sr-only">Status</span>,
    label: 'Status',
    width: 22,
    filter: 'multi',
    groupable: true,
    groupOrder: STATUSES,
    sortable: true,
    sortValue: (t) => STATUSES.indexOf(t.status),
    formatValue: (v) => STATUS_LABEL[v as ItemStatus],
    valueIcon: (v) => <StatusIcon status={v as ItemStatus} />,
    cell: (t) => <StatusIcon status={t.status} />,
  },
  {
    key: 'title',
    cardSlot: 'title',
    header: 'Title',
    grow: true,
    sortable: true,
    cell: (t) => <span className="truncate">{t.title}</span>,
  },
  {
    key: 'labels',
    cardSlot: 'chip',
    header: 'Labels',
    className: 'min-w-36',
    hideBelow: 720,
    value: (t) => t.labels.join(' '),
    cell: (t) => (
      <span className="flex gap-1">
        {t.labels.map((l) => (
          <Badge key={l} variant="outline-muted">
            {l}
          </Badge>
        ))}
      </span>
    ),
  },
  {
    key: 'group',
    cardSlot: 'chip',
    header: 'Group',
    className: 'min-w-36',
    filter: 'multi',
    groupable: true,
    hideBelow: 620,
    formatValue: (v) => GROUPS.find((p) => p.k === v)?.n ?? v,
    valueIcon: (v) => <GroupDot k={v} />,
    cell: (t) => (
      <Badge variant="outline-muted" className="text-foreground">
        <GroupDot k={t.group} />
        {GROUPS.find((p) => p.k === t.group)?.n}
      </Badge>
    ),
  },
  {
    key: 'due',
    cardSlot: 'chip',
    header: 'Due',
    className: 'min-w-16',
    sortable: true,
    nowrap: true,
    sortValue: (t) => t.due ?? 9999,
    cell: (t) => {
      const d = dueDate(t.due);
      return d ? (
        <span
          className={
            t.due !== null && t.due < 0
              ? 'text-xs text-destructive'
              : 'text-xs text-muted-foreground'
          }
        >
          {formatPropertyDate(d)}
        </span>
      ) : null;
    },
  },
  {
    key: 'assignee',
    cardSlot: 'end',
    header: <span className="sr-only">Assignee</span>,
    label: 'Assignee',
    width: 28,
    filter: 'multi',
    groupable: true,
    formatValue: (v) => personName(v || null),
    cell: (t) => (
      <span title={personName(t.assignee)} className="flex cursor-default">
        <PersonAvatar k={t.assignee} />
      </span>
    ),
  },
];

export const itemMenu = (t: DemoItem) => (
  <>
    <DropdownMenuItem>Open {t.id}</DropdownMenuItem>
    <DropdownMenuItem>Copy link</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </>
);
