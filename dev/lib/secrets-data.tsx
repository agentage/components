'use client';

export type Env = 'production' | 'preview' | 'development';

export interface Row {
  id: string;
  name: string;
  secret: boolean;
  /** A plain value, or the unsaved draft of a secret. Never the stored secret. */
  value: string;
  isSet: boolean;
  hint?: string;
  env: Env;
  updated: number;
}

export const ENVS: { value: Env; label: string }[] = [
  { value: 'production', label: 'Production' },
  { value: 'preview', label: 'Preview' },
  { value: 'development', label: 'Development' },
];

export const MIN = 60_000;
export const START = Date.now();

export const SEED: Row[] = [
  {
    id: 'r1',
    name: 'SITE_URL',
    secret: false,
    value: 'https://example.com',
    isSet: false,
    env: 'production',
    updated: START - 12 * MIN,
  },
  {
    id: 'r2',
    name: 'LOG_LEVEL',
    secret: false,
    value: 'info',
    isSet: false,
    env: 'preview',
    updated: START - 95 * MIN,
  },
  {
    id: 'r3',
    name: 'DATABASE_KEY',
    secret: true,
    value: '',
    isSet: true,
    hint: '7f3a',
    env: 'production',
    updated: START - 26 * 60 * MIN,
  },
  {
    id: 'r4',
    name: 'SIGNING_SECRET',
    secret: true,
    value: '',
    isSet: true,
    hint: 'c91e',
    env: 'development',
    updated: START - 3 * MIN,
  },
];

export const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);

export const same = (a: Row[], b: Row[]) => JSON.stringify(a) === JSON.stringify(b);

export const commit = (rows: Row[], saved: Row[]): Row[] =>
  rows.map((r) => {
    const old = saved.find((s) => s.id === r.id);
    const next: Row =
      r.secret && r.value ? { ...r, isSet: true, hint: r.value.slice(-4), value: '' } : r;
    return old && same([r], [old]) ? r : { ...next, updated: Date.now() };
  });

export const makeToken = (n: number) =>
  `tok_${(0x9e3779b1 * (n + 1)).toString(16)}${'a1b2c3d4e5f6'.slice(0, 8)}`;
