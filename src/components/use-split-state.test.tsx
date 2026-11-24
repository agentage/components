import { render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { resizableSplitCollapsedVar, resizableSplitPrepaint } from '../lib/split-px';
import { ResizableSplit } from './resizable-split';
import { useSplitState } from './use-split-state';

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute('style');
});

describe('useSplitState', () => {
  it('ignores a stored collapsed flag when the split is not collapsible', () => {
    window.localStorage.setItem('nav.collapsed', '1');
    const { result } = renderHook(() =>
      useSplitState({ storageKey: 'nav', init: 200, min: 100, max: 400, collapsible: false })
    );
    expect(result.current.api.collapsed).toBe(false);
  });

  it('a collapsed split that stops being collapsible shows its pane again', () => {
    window.localStorage.setItem('nav.collapsed', '1');
    const split = (collapsible: boolean) => (
      <ResizableSplit storageKey="nav" init={200} min={100} max={400} collapsible={collapsible}>
        {[<div key="a">Side</div>, <div key="b">Main</div>]}
      </ResizableSplit>
    );
    const { rerender } = render(split(true));
    expect(screen.getByText('Side').closest('[aria-hidden]')).not.toBeNull();
    rerender(split(false));
    expect(screen.getByText('Side').closest('[aria-hidden]')).toBeNull();
    expect(screen.getByRole('separator').getAttribute('aria-valuetext')).toBe('200px');
  });

  it('a fixed split keeps its pane when the prepaint applied a stale collapsed flag', () => {
    window.localStorage.setItem('nav.collapsed', '1');
    new Function(resizableSplitPrepaint(['nav']))();
    expect(document.documentElement.style.getPropertyValue(resizableSplitCollapsedVar('nav'))).toBe(
      '0px'
    );
    render(
      <ResizableSplit data-testid="split" storageKey="nav" init={200} min={100} max={400}>
        {[<div key="a">Side</div>, <div key="b">Main</div>]}
      </ResizableSplit>
    );
    const template = screen.getByTestId('split').style.gridTemplateColumns;
    expect(template).not.toContain(resizableSplitCollapsedVar('nav'));
    expect(screen.getByText('Side').closest('[aria-hidden]')).toBeNull();
  });
});
