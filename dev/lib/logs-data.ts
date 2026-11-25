import type { LogLine } from '../../src';

/** Docs-only log samples: deterministic, so a line keeps its text across renders. */
const SOURCES = ['api', 'worker', 'scheduler', 'edge'];
const PATHS = ['/v1/items', '/v1/items/42', '/v1/search', '/health', '/v1/upload'];

const MESSAGES: [LogLine['level'], (i: number) => string][] = [
  ['info', (i) => `GET ${PATHS[i % PATHS.length]} 200 in ${String(12 + (i % 37))} ms`],
  ['info', (i) => `Job ${String(4100 + i)} finished in ${String(1 + (i % 9))}.${String(i % 10)} s`],
  ['debug', (i) => `Cache hit for key items:${String(i % 97)}`],
  ['warn', (i) => `Slow query on items took ${String(800 + (i % 400))} ms`],
  ['info', (i) => `POST ${PATHS[i % PATHS.length]} 201 in ${String(30 + (i % 50))} ms`],
  ['error', (i) => `Upload ${String(i)} failed: size above the 25 MB limit`],
  ['debug', () => 'Heartbeat sent'],
];

const LOADED = Date.now();

export const logLine = (i: number): LogLine => {
  const pick =
    i % 53 === 0
      ? MESSAGES[5]
      : i % 11 === 0
        ? MESSAGES[3]
        : MESSAGES[i % 3 === 0 ? 2 : i % 5 === 0 ? 4 : i % 2];
  const [level, text] = pick;
  const source = SOURCES[i % SOURCES.length];
  return {
    id: `line-${String(i)}`,
    time: LOADED - (1200 - i) * 1000,
    level,
    source,
    message: text(i),
    fields: {
      requestId: `req_${(i * 7919).toString(36)}`,
      source,
      durationMs: 12 + (i % 37),
      user: {
        id: `u_${String(100 + (i % 12))}`,
        plan: i % 3 ? 'team' : 'free',
        limits: { daily: 500 + (i % 7) * 100, burst: { size: 20, windowMs: 1000 } },
      },
      tags: ['region:eu', `node:${String(1 + (i % 3))}`],
      error: level === 'error' ? { code: 'LIMIT_EXCEEDED', limitMb: 25 } : null,
    },
  };
};

export const logLines = (count: number, start = 0): LogLine[] =>
  Array.from({ length: count }, (_, k) => logLine(start + k));

/** Lines per level, for the level filter counts. */
export const countByLevel = (lines: LogLine[]): Record<string, number> => {
  const out: Record<string, number> = { debug: 0, info: 0, warn: 0, error: 0 };
  for (const l of lines) out[l.level ?? 'info'] = (out[l.level ?? 'info'] ?? 0) + 1;
  return out;
};
