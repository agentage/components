import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataTree } from './data-tree';
import { matchPaths, safeJson } from './data-tree.model';
import { LogView } from './log-view';

const row = (path: string) => document.querySelector(`[data-path="${path}"]`) as HTMLElement;
const cyclic = () => {
  const err: Record<string, unknown> = { name: 'Error', bytes: 10n };
  err.cause = { inner: err };
  const shared = { ok: true };
  return { err, a: shared, b: shared };
};
let writeText: ReturnType<typeof vi.fn>;

beforeEach(() => {
  writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
});

describe('DataTree with unsafe values', () => {
  it('stringifies cycles and BigInt without marking shared values as cycles', () => {
    const text = safeJson(cyclic());
    expect(text).toContain('"bytes": "10"');
    expect(text).toContain('"inner": "[Circular]"');
    expect(text).not.toMatch(/"b": "\[Circular\]"/);
    expect(matchPaths(cyclic(), 'inner')).toEqual(new Set(['err.cause.inner']));
  });

  it('renders and copies circular and BigInt fields', () => {
    render(<DataTree value={cyclic()} defaultExpandDepth={2} highlight="bytes" />);
    expect(row('err.bytes').textContent).toContain('10');
    fireEvent.keyDown(row('err'), { key: 'c', code: 'KeyC', ctrlKey: true });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('[Circular]'));
    fireEvent.click(row('err').querySelector('[aria-label="Copy value"]') as HTMLElement);
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it('renders a LogView line with circular fields', () => {
    render(<LogView lines={[{ id: '1', message: 'x', fields: cyclic() }]} />);
    fireEvent.click(document.querySelector('[data-line="1"]')?.firstElementChild as HTMLElement);
    expect(screen.getByRole('tree', { name: 'Fields of line 1' })).toBeTruthy();
  });
});

describe('DataTree keys', () => {
  const VALUE = { note: 'x'.repeat(120), id: 'a' };

  it('names a row by its key and value only', () => {
    render(<DataTree value={VALUE} maxStringLength={20} />);
    expect(screen.getByRole('treeitem', { name: 'id: "a"' })).toBe(row('id'));
    const note = row('note');
    expect(note.getAttribute('aria-labelledby')).toBeTruthy();
    expect(note.getAttribute('aria-label')).toBeNull();
  });

  it('shows a cut string with Space or Right and hides it with Left', () => {
    render(<DataTree value={VALUE} maxStringLength={20} />);
    const full = () => document.querySelector('[data-slot="data-tree-full"]');
    fireEvent.keyDown(row('note'), { key: 'ArrowRight' });
    expect(full()?.textContent).toBe(VALUE.note);
    fireEvent.keyDown(row('note'), { key: 'ArrowLeft' });
    expect(full()).toBeNull();
    fireEvent.keyDown(row('note'), { key: ' ' });
    expect(full()).toBeTruthy();
  });

  it('copies the path with Ctrl+Alt+C and skips the copy while text is selected', () => {
    render(<DataTree value={VALUE} />);
    fireEvent.keyDown(row('id'), { key: 'c', code: 'KeyC', ctrlKey: true, altKey: true });
    expect(writeText).toHaveBeenLastCalledWith('id');
    window.getSelection()?.selectAllChildren(row('id'));
    fireEvent.keyDown(row('id'), { key: 'c', code: 'KeyC', ctrlKey: true });
    expect(writeText).toHaveBeenCalledTimes(1);
    window.getSelection()?.removeAllRanges();
  });
});
