import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resizableSplitVar } from '../lib/split-px';
import { InspectorPanel } from './inspector-panel';

const cleanups: (() => void)[] = [];
afterEach(() => {
  cleanups.splice(0).forEach((f) => f());
  localStorage.clear();
  document.documentElement.removeAttribute('style');
});

const ui = (
  <InspectorPanel open onOpenChange={() => {}} title="Root" storageKey="insp.ssr">
    body
  </InspectorPanel>
);

describe('InspectorPanel under SSR', () => {
  it('sizes the server HTML from the prepaint variable', () => {
    const html = renderToString(ui);
    expect(html).toContain(`var(${resizableSplitVar('insp.ssr')}, 380px)`);
    expect(html).toContain('clamp(360px');
  });

  it('hydrates with a stored width without a mismatch and keeps that width', async () => {
    localStorage.setItem('insp.ssr', '400');
    document.documentElement.style.setProperty(resizableSplitVar('insp.ssr'), '400px');
    const host = document.createElement('div');
    host.innerHTML = renderToString(ui);
    document.body.appendChild(host);
    const onRecoverableError = vi.fn();
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(host, ui, { onRecoverableError });
    });
    cleanups.push(() => {
      act(() => root?.unmount());
      host.remove();
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
    errors.mockRestore();
    expect(host.querySelector('aside')?.style.width).toBe('400px');
  });

  it('renders a number for a key the prepaint script cannot carry', () => {
    const html = renderToString(
      <InspectorPanel open onOpenChange={() => {}} title="Root" storageKey="bad key!">
        body
      </InspectorPanel>
    );
    expect(html).not.toContain('var(--split');
    expect(html).toContain('width:380px');
  });
});
