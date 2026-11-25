import type { ListControlsState } from './list-controls';

type Plain = Record<string, unknown>;

const isPlain = (v: unknown): v is Plain =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isRecordOf = <V>(v: unknown, item: (x: unknown) => x is V): v is Record<string, V> =>
  isPlain(v) && Object.values(v).every(item);

const isStrings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((s) => typeof s === 'string');

const isBool = (v: unknown): v is boolean => typeof v === 'boolean';

/** Valid fields of a stored control state; bad JSON, old schemas and wrong types are dropped. */
export const parseListControls = (v: unknown): Partial<ListControlsState> => {
  if (!isPlain(v)) return {};
  const out: Partial<ListControlsState> = {};
  if (isRecordOf(v.filters, isStrings)) out.filters = v.filters;
  if (typeof v.view === 'string') out.view = v.view;
  if (v.groupBy === null || typeof v.groupBy === 'string') out.groupBy = v.groupBy;
  if (isRecordOf(v.flags, isBool)) out.flags = v.flags;
  const sort = v.sort;
  if (sort === null) out.sort = null;
  else if (
    isPlain(sort) &&
    typeof sort.key === 'string' &&
    (sort.dir === 'asc' || sort.dir === 'desc')
  )
    out.sort = { key: sort.key, dir: sort.dir };
  return out;
};

export const readListControls = (key: string): Partial<ListControlsState> | null => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const parsed = parseListControls(JSON.parse(raw));
    return Object.keys(parsed).length > 0 ? parsed : null;
  } catch {
    return null;
  }
};

/** The search query is left out: a reload starts with an empty search box. */
export const writeListControls = (
  key: string,
  { query: _q, ...state }: ListControlsState
): void => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* storage blocked: the view still works for this page */
  }
};
