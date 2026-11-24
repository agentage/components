export type DataKind = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' | 'other';

export interface DataNode {
  /** Path such as `user.roles[0]`; `$` is the root. */
  path: string;
  key: string | number | null;
  value: unknown;
  kind: DataKind;
  depth: number;
  /** Child count of an object or array. */
  size?: number;
}

export type DataRow =
  ({ type: 'node' } & DataNode) | { type: 'more'; path: string; depth: number; hidden: number };

export const kindOf = (value: unknown): DataKind => {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return 'array';
  const t = typeof value;
  if (t === 'object') return 'object';
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'other';
};

const IDENT = /^[A-Za-z_$][\w$]*$/;

export const childPath = (parent: string, key: string | number): string => {
  if (typeof key === 'number') return `${parent}[${String(key)}]`;
  const part = IDENT.test(key) ? key : `[${JSON.stringify(key)}]`;
  if (parent === '$') return part.startsWith('[') ? `$${part}` : part;
  return part.startsWith('[') ? `${parent}${part}` : `${parent}.${part}`;
};

export const entriesOf = (value: unknown): [string | number, unknown][] =>
  Array.isArray(value)
    ? value.map((v, i) => [i, v])
    : Object.entries(value as Record<string, unknown>);

export const formatScalar = (value: unknown, kind: DataKind): string => {
  if (kind === 'string') return JSON.stringify(value);
  if (kind === 'null') return value === undefined ? 'undefined' : 'null';
  return String(value);
};

/** JSON text that never throws: a cycle becomes "[Circular]", a BigInt its digits. */
export const safeJson = (value: unknown): string => {
  const stack: unknown[] = [];
  return JSON.stringify(
    value,
    function (this: unknown, _key: string, v: unknown) {
      if (typeof v === 'bigint') return String(v);
      if (typeof v !== 'object' || v === null) return v;
      while (stack.length > 0 && stack[stack.length - 1] !== this) stack.pop();
      if (stack.includes(v)) return '[Circular]';
      stack.push(v);
      return v;
    },
    2
  );
};

export const valueText = (value: unknown): string => {
  const kind = kindOf(value);
  if (kind === 'string') return value as string;
  if (kind === 'object' || kind === 'array') return safeJson(value);
  return formatScalar(value, kind);
};

const lower = (s: string): string => s.toLowerCase();

/** Paths of every node whose key or scalar value contains `query`, case-insensitive. */
export const matchPaths = (value: unknown, query: string): Set<string> => {
  const out = new Set<string>();
  const q = lower(query.trim());
  if (!q) return out;
  const above = new Set<unknown>();
  const walk = (v: unknown, path: string, key: string | number | null): void => {
    const kind = kindOf(v);
    const hitKey = key !== null && lower(String(key)).includes(q);
    const scalar = kind !== 'object' && kind !== 'array';
    if (hitKey || (scalar && lower(formatScalar(v, kind)).includes(q))) out.add(path);
    if (scalar || above.has(v)) return;
    above.add(v);
    for (const [k, c] of entriesOf(v)) walk(c, childPath(path, k), k);
    above.delete(v);
  };
  walk(value, '$', null);
  return out;
};

/** Every ancestor path of the given paths, so a match is never hidden in a shut branch. */
export const ancestorsOf = (paths: Set<string>): Set<string> => {
  const out = new Set<string>(['$']);
  for (const p of paths) {
    for (let i = p.length - 1; i > 0; i--) {
      if (p[i] === '.' || p[i] === '[') out.add(p.slice(0, i));
    }
  }
  return out;
};

/** Paths open by default: every branch above `depth`. */
export const defaultOpen = (value: unknown, depth: number): Set<string> => {
  const out = new Set<string>();
  const walk = (v: unknown, path: string, d: number): void => {
    const kind = kindOf(v);
    if ((kind !== 'object' && kind !== 'array') || d >= depth) return;
    out.add(path);
    for (const [k, c] of entriesOf(v)) walk(c, childPath(path, k), d + 1);
  };
  walk(value, '$', 0);
  return out;
};

/** Visible rows in order; a branch shows `limit` children, then a "show more" row. */
export const flatten = (
  value: unknown,
  open: Set<string>,
  limits: Record<string, number>,
  limit: number
): DataRow[] => {
  const rows: DataRow[] = [];
  const walk = (v: unknown, path: string, key: string | number | null, depth: number): void => {
    const kind = kindOf(v);
    const branch = kind === 'object' || kind === 'array';
    const entries = branch ? entriesOf(v) : [];
    rows.push({
      type: 'node',
      path,
      key,
      value: v,
      kind,
      depth,
      size: branch ? entries.length : undefined,
    });
    if (!branch || !open.has(path)) return;
    const max = limits[path] ?? limit;
    for (const [k, c] of entries.slice(0, max)) walk(c, childPath(path, k), k, depth + 1);
    if (entries.length > max)
      rows.push({ type: 'more', path, depth: depth + 1, hidden: entries.length - max });
  };
  walk(value, '$', null, 0);
  return rows;
};
