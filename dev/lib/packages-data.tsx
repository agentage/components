'use client';
import { Avatar, Badge } from '../../src';
import { UiIcon, type UiIconName } from './ui-icons';

/** Docs-only sample packages for the catalog pattern. */
export interface DemoPackage {
  id: string;
  key: string;
  name: string;
  host: 'local' | 'cloud';
  version: string;
  state: 'active' | 'failed' | 'off' | 'update';
  newest?: string;
  icon: UiIconName;
  description: string;
  api: string;
  store: string;
}

const X = (e: Omit<DemoPackage, 'key'>): DemoPackage => ({ ...e, key: `${e.host}:${e.id}` });

export const INSTALLED: DemoPackage[] = [
  X({
    id: 'backup',
    name: 'Backup',
    host: 'local',
    version: '0.1.3',
    state: 'active',
    icon: 'download',
    description: 'Copies your documents to a second disk every night.',
    api: '/api/backup',
    store: 'files',
  }),
  X({
    id: 'search',
    name: 'Search',
    host: 'local',
    version: '0.9.3',
    state: 'failed',
    icon: 'radar',
    description: 'One index over every document and record you keep.',
    api: '/api/search',
    store: 'postgres',
  }),
  X({
    id: 'samples',
    name: 'Samples',
    host: 'local',
    version: '0.2.19',
    state: 'update',
    newest: '0.2.21',
    icon: 'flask',
    description: 'Sample records for tests and demos.',
    api: '/api/samples',
    store: 'postgres',
  }),
  X({
    id: 'backup',
    name: 'Backup',
    host: 'cloud',
    version: '0.1.3',
    state: 'active',
    icon: 'download',
    description: 'Copies your documents to a second disk every night.',
    api: '/api/backup',
    store: 'files',
  }),
  X({
    id: 'catalog',
    name: 'Catalog',
    host: 'cloud',
    version: '0.3.3',
    state: 'off',
    icon: 'store',
    description: 'The listed packages and their versions, from their release records.',
    api: '/api/catalog',
    store: 'postgres',
  }),
  X({
    id: 'site',
    name: 'Site',
    host: 'cloud',
    version: '0.1.10',
    state: 'off',
    icon: 'globe',
    description: 'The public website, the newsletter and the help pages.',
    api: '/api/site',
    store: 'postgres',
  }),
  X({
    id: 'reports',
    name: 'Reports',
    host: 'cloud',
    version: '0.5.0',
    state: 'off',
    icon: 'details',
    description: 'Reports that start on a schedule or an event, with their history.',
    api: '/api/reports',
    store: 'postgres',
  }),
];

export const HOST_LABEL = { local: 'This machine', cloud: 'Cloud' };

const STATE = {
  active: { variant: 'outline-success', text: 'active' },
  failed: { variant: 'outline-destructive', text: 'failed' },
  off: { variant: 'outline-muted', text: 'off' },
  update: { variant: 'outline-primary', text: 'update' },
} as const;

export const StateBadge = ({ e }: { e: DemoPackage }) => (
  <Badge variant={STATE[e.state].variant}>
    <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
    {STATE[e.state].text}
  </Badge>
);

export const Tile = ({ e, size = 'sm' }: { e: DemoPackage; size?: 'sm' | 'md' }) => (
  <Avatar shape="square" size={size} icon={<UiIcon name={e.icon} />} aria-hidden="true" />
);

export const primaryAction = (e: DemoPackage): { label: string; icon: UiIconName } | null =>
  e.state === 'failed'
    ? { label: 'Reload', icon: 'refresh' }
    : e.state === 'update'
      ? { label: `Update to ${e.newest ?? ''}`, icon: 'download' }
      : e.state === 'off'
        ? { label: 'Turn on', icon: 'plus' }
        : null;
