import { afterEach, beforeEach, expect, vi, type MockInstance } from 'vitest';

let spies: MockInstance[] = [];

/** Fails the test when a consumer-style render prints any React warning or console error. */
export const failOnConsole = (): void => {
  beforeEach(() => {
    spies = [vi.spyOn(console, 'error'), vi.spyOn(console, 'warn')];
    spies.forEach((s) => s.mockImplementation(() => undefined));
  });
  afterEach(() => {
    const calls = spies.flatMap((s) => s.mock.calls.map((c) => String(c[0]).slice(0, 300)));
    spies.forEach((s) => s.mockRestore());
    expect(calls).toEqual([]);
  });
};
