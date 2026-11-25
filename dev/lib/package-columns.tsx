'use client';
import { Button, DropdownMenuItem, type DataViewColumn } from '../../src';
import { HOST_LABEL, primaryAction, StateBadge, Tile, type DemoPackage } from './packages-data';
import { UiIcon } from './ui-icons';

/** Docs-only: the columns and row menu of the catalog demo. */
export const packageColumns = (
  act: (e: DemoPackage, what: string) => void
): DataViewColumn<DemoPackage>[] => [
  {
    key: 'name',
    header: 'Package',
    grow: true,
    searchable: true,
    twoLine: true,
    sortable: true,
    cell: (e) => (
      <span className="flex min-w-0 items-center gap-3">
        <Tile e={e} />
        <span className="flex min-w-0 flex-col">
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="text-ui font-semibold">{e.name}</span>
            <span className="font-mono text-xs text-muted-foreground">{e.id}</span>
          </span>
          <span className="truncate text-xs text-muted-foreground">{e.description}</span>
        </span>
      </span>
    ),
  },
  { key: 'id', header: 'Id', visibility: 'none', searchable: true },
  { key: 'description', header: 'Description', visibility: 'none', searchable: true },
  {
    key: 'host',
    header: 'Host',
    groupable: true,
    filter: 'multi',
    visibility: 'optional',
    formatValue: (v) => HOST_LABEL[v as DemoPackage['host']],
    valueIcon: (v) => <UiIcon name={v === 'local' ? 'monitor' : 'cloud'} size={14} />,
  },
  {
    key: 'version',
    header: 'Version',
    className: 'min-w-18',
    nowrap: true,
    cell: (e) => <span className="font-mono text-xs">{e.version}</span>,
  },
  {
    key: 'state',
    header: 'State',
    searchable: true,
    className: 'min-w-24',
    filter: 'multi',
    sortable: true,
    cell: (e) => <StateBadge e={e} />,
  },
  {
    key: 'action',
    header: <span className="sr-only">Action</span>,
    label: 'Action',
    className: 'min-w-36',
    nowrap: true,
    align: 'right',
    cell: (e) => {
      const a = primaryAction(e);
      return a ? (
        <Button
          size="sm"
          variant={e.state === 'update' ? 'default' : 'outline'}
          onClick={() => act(e, a.label)}
        >
          <UiIcon name={a.icon} />
          {a.label}
        </Button>
      ) : null;
    },
  },
];

export const packageMenu = (e: DemoPackage) => (
  <>
    <DropdownMenuItem>Open its page</DropdownMenuItem>
    <DropdownMenuItem>Copy the address</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Remove {e.name}</DropdownMenuItem>
  </>
);
