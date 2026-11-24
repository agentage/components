import { act, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resizablePanelsVar, resizableSplitPrepaint } from '../lib/split-px';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';

const KEY = 'browser';

const group = () => (
  <ResizablePanelGroup aria-label="Browser" storageKey={KEY}>
    <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
      tree
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel minSize={20}>document</ResizablePanel>
  </ResizablePanelGroup>
);

const now = () => screen.getByRole('separator').getAttribute('aria-valuenow');
const root = () => document.documentElement;

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  root().removeAttribute('style');
  document.body.innerHTML = '';
});

describe('ResizablePanelGroup restore', () => {
  it('restores stored sizes that fit the panels', () => {
    localStorage.setItem(KEY, '[30,70]');
    render(group());
    expect(now()).toBe('30');
  });

  it.each([
    ['out of bounds', '[1000,-900]'],
    ['below a minimum', '[0,100]'],
    ['not summing to 100', '[30,30]'],
    ['a wrong count', '[50]'],
    ['a wrong type', '{"a":1}'],
  ])('ignores stored sizes %s', (_name, raw) => {
    localStorage.setItem(KEY, raw);
    render(group());
    expect(now()).toBe('50');
  });

  it('the server HTML reads the prepaint variables and hydrates without a mismatch', () => {
    const html = renderToString(group());
    expect(html).toContain(`var(${resizablePanelsVar(KEY)}2-0, 50%)`);
    localStorage.setItem(KEY, '[30,70]');
    new Function(resizableSplitPrepaint([KEY]))();
    expect(root().style.getPropertyValue(`${resizablePanelsVar(KEY)}2-0`)).toBe('30%');
    const host = document.createElement('div');
    host.innerHTML = html;
    document.body.appendChild(host);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const recoverable = vi.fn();
    act(() => {
      hydrateRoot(host, group(), { onRecoverableError: recoverable });
    });
    expect(now()).toBe('30');
    expect(screen.getByText('tree').style.flexBasis).toBe('30%');
    expect(recoverable).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
  });

  it('the prepaint skips a sizes array that does not sum to 100', () => {
    localStorage.setItem(KEY, '[30,30]');
    new Function(resizableSplitPrepaint([KEY]))();
    expect(root().style.getPropertyValue(`${resizablePanelsVar(KEY)}2-0`)).toBe('');
  });
});
