import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useRovingFocus, type RovingFocusOptions } from './use-roving-focus';

const Toolbar = (options: RovingFocusOptions & { inertLast?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { inertLast, ...rest } = options;
  useRovingFocus(ref, rest);
  return (
    <div ref={ref} role="toolbar" aria-label="Tools">
      <button type="button" data-roving-item="">
        One
      </button>
      <button type="button" data-roving-item="" aria-current="true">
        Two
      </button>
      <div inert={inertLast}>
        <button type="button" data-roving-item="">
          Three
        </button>
      </div>
    </div>
  );
};

const btn = (name: string) => screen.getByRole('button', { name, hidden: true });

describe('useRovingFocus', () => {
  it('puts the single tab stop on the current item', () => {
    render(<Toolbar />);
    expect(btn('Two').tabIndex).toBe(0);
    expect(btn('One').tabIndex).toBe(-1);
    expect(btn('Three').tabIndex).toBe(-1);
  });

  it('wraps by default and maps Left/Right with orientation both', () => {
    render(<Toolbar orientation="both" />);
    btn('Two').focus();
    fireEvent.keyDown(btn('Two'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(btn('Three'));
    fireEvent.keyDown(btn('Three'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(btn('One'));
    fireEvent.keyDown(btn('One'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(btn('Three'));
  });

  it('leaves Left/Right alone when vertical', () => {
    render(<Toolbar />);
    btn('One').focus();
    fireEvent.keyDown(btn('One'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(btn('One'));
  });

  it('skips items inside an inert subtree', () => {
    render(<Toolbar inertLast />);
    btn('Two').focus();
    fireEvent.keyDown(btn('Two'), { key: 'End' });
    expect(document.activeElement).toBe(btn('Two'));
  });

  it('moves the tab stop to an item focused by pointer', () => {
    render(<Toolbar />);
    btn('One').focus();
    expect(btn('One').tabIndex).toBe(0);
    expect(btn('Two').tabIndex).toBe(-1);
  });
});
