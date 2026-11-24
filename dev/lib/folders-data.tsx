import type { ReactNode } from 'react';
import {
  FormField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type TreeSelectNode,
} from '../../src';
import { UiIcon } from './ui-icons';
import type { PathEntry } from './path-list';

/** Docs-only sources and their folders. Ids are "source|path". */
const SOURCES: Record<string, [string, number][]> = {
  personal: [
    ['notes/', 214],
    ['notes/ideas/', 38],
    ['journal/', 412],
    ['reading/', 57],
  ],
  work: [
    ['documents/', 133],
    ['documents/reports/', 61],
    ['meetings/', 96],
    ['decisions/', 24],
  ],
  shared: [
    ['specs/', 88],
    ['specs/drafts/', 19],
    ['plans/', 12],
    ['research/', 44],
    ['releases/', 31],
  ],
};

const folder = <UiIcon name="folder" />;

const nest = (source: string, list: [string, number][]): TreeSelectNode[] => {
  const top = list.filter(([p]) => p.split('/').length === 2);
  return top.map(([p, n]) => {
    const kids = list.filter(([c]) => c !== p && c.startsWith(p));
    return {
      id: `${source}|${p}`,
      label: p,
      count: n,
      icon: folder,
      children: kids.length
        ? kids.map(([c, m]) => ({
            id: `${source}|${c}`,
            label: c.slice(p.length),
            count: m,
            icon: folder,
          }))
        : undefined,
    };
  });
};

export const FOLDER_TREE: TreeSelectNode[] = Object.entries(SOURCES).map(([m, list]) => ({
  id: m,
  label: m,
  disabled: true,
  icon: <UiIcon name="cloud" />,
  children: nest(m, list),
}));

export const entryOf = (id: string, access = 'read-only'): PathEntry => {
  const [source, path] = id.split('|');
  return { id, source, path, access };
};

export const ACCESS = [
  { value: 'read-only', label: 'Read only' },
  { value: 'read-write', label: 'Read and write' },
];

/** "work / documents/reports/": the source, then the full folder path. */
export const folderPath = (path: TreeSelectNode[]): string => {
  const last = path.at(-1);
  return last ? last.id.replace('|', ' / ') : '';
};

/** Docs-only saved values of the settings form pattern. */
export const SETTINGS_SAVED = {
  name: 'Team documents',
  owner: 'ada@example.com',
  language: 'en',
  visibility: 'team',
  sharing: true,
  signIn: true,
  folders: [entryOf('shared|releases/'), entryOf('work|decisions/', 'read-write')],
  email: true,
  weekly: false,
};
export type SettingsValues = typeof SETTINGS_SAVED;

export const SETTINGS_SECTIONS = [
  { id: 'set-general', label: 'General', keys: ['name', 'owner', 'language'] },
  { id: 'set-access', label: 'Access', keys: ['visibility', 'sharing', 'signIn'] },
  { id: 'set-folders', label: 'Folders', keys: ['folders'] },
  { id: 'set-notifications', label: 'Notifications', keys: ['email', 'weekly'] },
] as const;

/** A Select of [value, label] pairs; FormField passes the id. */
export const Choice = (p: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  items: string[][];
}) => (
  <Select value={p.value} onValueChange={p.onChange}>
    <SelectTrigger id={p.id} className="w-56">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {p.items.map(([v, l]) => (
        <SelectItem key={v} value={v}>
          {l}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/** One row-layout FormField. */
export const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) => (
  <FormField label={label} hint={hint} layout="row" className="py-2">
    {children}
  </FormField>
);

export const LANGUAGES = [
  ['en', 'English'],
  ['de', 'German'],
  ['uk', 'Ukrainian'],
];
export const VISIBILITY = [
  ['private', 'Only me'],
  ['team', 'My team'],
  ['public', 'Everyone with the link'],
];
