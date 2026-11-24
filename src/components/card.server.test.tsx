import { readFileSync } from 'node:fs';
import { render, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';

const source = (file: string): string => readFileSync(new URL(file, import.meta.url), 'utf8');

const callsFrom = (file: string): string[] =>
  [...source(file).matchAll(/\b([a-z]\w*)\(/g)].map((m) => m[1]);

describe('Card on the server', () => {
  it('calls no function exported by the client island', () => {
    expect(source('./card.tsx').startsWith("'use client'")).toBe(false);
    expect(source('./card-state.tsx').startsWith("'use client'")).toBe(true);
    const island = source('./card-state.tsx');
    const exported = [...island.matchAll(/export const (\w+)/g)].map((m) => m[1]);
    const called = new Set(callsFrom('./card.tsx'));
    // Components are rendered as JSX (client references); a lower-case export would be called.
    expect(exported.filter((name) => called.has(name))).toEqual([]);
  });

  it.each(['loading', 'empty', 'error', 'stale', 'ready'] as const)(
    'renders state %s with renderToString',
    (state) => {
      const html = renderToString(
        <Card state={state} minHeight={160}>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>Ready body</CardContent>
          <CardFooter source="Billing" />
        </Card>
      );
      expect(html).toContain('Revenue');
      expect(html).toContain(`data-state="${state}"`);
      if (state === 'ready' || state === 'stale') expect(html).toContain('Ready body');
      else expect(html).not.toContain('Ready body');
      if (state === 'loading') expect(html).toContain('aria-busy="true"');
      if (state === 'error') expect(html).toContain('Could not load this data.');
      if (state === 'stale') expect(html).toContain('Stale');
    }
  );
});

describe('Card announcements', () => {
  it('names the card in the polite state announcement', async () => {
    const { rerender } = render(
      <Card state="loading" announceLabel="Revenue">
        <CardContent>Body</CardContent>
      </Card>
    );
    rerender(
      <Card state="ready" announceLabel="Revenue">
        <CardContent>Body</CardContent>
      </Card>
    );
    await waitFor(() => expect(document.body.textContent).toContain('Revenue: Loaded'));
  });
});
