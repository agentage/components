import { describe, expect, it } from 'vitest';
import * as charts from './charts';
import * as barrel from './index';
import * as site from './site';

describe('grouped entries', () => {
  it.each([
    ['charts', charts, ['GaugeCard', 'Sparkline', 'StatComparison']],
    ['site', site, ['TopBar', 'Footer', 'MarkdownRenderer']],
  ] as const)('%s re-exports the same bindings as the barrel', (_, mod, expected) => {
    for (const name of expected) expect(Object.keys(mod)).toContain(name);
    for (const [name, value] of Object.entries(mod)) {
      expect(barrel[name as keyof typeof barrel]).toBe(value);
    }
  });
});
