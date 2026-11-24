import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { activeSection, useScrollSpy } from '../lib/use-scroll-spy';
import { SectionIndex } from './section-index';

const SECTIONS = [
  { id: 'basics', label: 'Basics' },
  { id: 'record', label: 'Record' },
  { id: 'limits', label: 'Limits' },
];

describe('SectionIndex', () => {
  it('is a labelled nav of section links', () => {
    render(<SectionIndex sections={SECTIONS} />);
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    const links = screen.getAllByRole('link');
    expect(nav.contains(links[0] ?? null)).toBe(true);
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['#basics', '#record', '#limits']);
  });

  it('marks only the active section as current', () => {
    render(<SectionIndex sections={SECTIONS} activeId="record" aria-label="On this page" />);
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeTruthy();
    const current = screen.getByRole('link', { current: true });
    expect(current.textContent).toBe('Record');
    expect(current.className).toContain('before:bg-primary');
    expect(screen.getByRole('link', { name: 'Basics' }).getAttribute('aria-current')).toBeNull();
  });

  it('reports the selected id with the click event', () => {
    const onSelect = vi.fn((_id: string, e: { preventDefault: () => void }) => {
      e.preventDefault();
    });
    render(<SectionIndex sections={SECTIONS} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('link', { name: 'Limits' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0]).toBe('limits');
  });
});

const place = (tops: Record<string, number>): void => {
  document.body.innerHTML = '';
  for (const [id, top] of Object.entries(tops)) {
    const el = document.createElement('section');
    el.id = id;
    el.getBoundingClientRect = () => ({ top }) as DOMRect;
    document.body.appendChild(el);
  }
};

const scrollRoot = (scrollTop: number, clientHeight: number, scrollHeight: number) => {
  const root = document.createElement('div');
  root.getBoundingClientRect = () => ({ top: 100 }) as DOMRect;
  Object.defineProperties(root, {
    scrollTop: { value: scrollTop, configurable: true },
    clientHeight: { value: clientHeight },
    scrollHeight: { value: scrollHeight },
  });
  return root;
};

describe('activeSection', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('picks the last section whose top crossed the line', () => {
    place({ basics: 90, record: 140, limits: 400 });
    expect(activeSection(['basics', 'record', 'limits'], scrollRoot(50, 300, 1000), 48)).toBe(
      'record'
    );
  });

  it('falls back to the first section before any crossed', () => {
    place({ basics: 300, record: 600 });
    expect(activeSection(['basics', 'record'], scrollRoot(0, 300, 1000), 48)).toBe('basics');
  });

  it('snaps to the last section at the bottom of the scroll', () => {
    place({ basics: -400, record: -100, limits: 380 });
    expect(activeSection(['basics', 'record', 'limits'], scrollRoot(700, 300, 1000), 48)).toBe(
      'limits'
    );
  });

  it('returns undefined for no ids', () => {
    expect(activeSection([], null, 0)).toBeUndefined();
  });
});

describe('useScrollSpy', () => {
  it('updates on scroll of the root', async () => {
    place({ a: 0, b: 500 });
    const root = scrollRoot(10, 300, 2000);
    const ref = { current: root };
    const { result } = renderHook(() => useScrollSpy(['a', 'b'], { root: ref, offset: 0 }));
    expect(result.current).toBe('a');
    (document.getElementById('b') as HTMLElement).getBoundingClientRect = () =>
      ({ top: 90 }) as DOMRect;
    act(() => {
      root.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => expect(result.current).toBe('b'));
  });

  it('listens to the window without a root', async () => {
    place({ a: 0, b: 500 });
    const { result } = renderHook(() => useScrollSpy(['a', 'b']));
    expect(result.current).toBe('a');
    (document.getElementById('b') as HTMLElement).getBoundingClientRect = () =>
      ({ top: 10 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => expect(result.current).toBe('b'));
  });
});

describe('SectionIndex shared nav row', () => {
  it('uses the 13 px nav row with count and dirty dot', () => {
    render(
      <SectionIndex
        activeId="a"
        sections={[
          { id: 'a', label: 'General', count: 3 },
          { id: 'b', label: 'Tools', dirty: true },
        ]}
      />
    );
    const general = screen.getByRole('link', { name: /General/ });
    expect(general.className).toContain('text-ui');
    expect(general.className).toContain('rounded-md');
    expect(general.textContent).toContain('3');
    expect(screen.getByRole('link', { name: /Tools/ }).textContent).toContain('Unsaved changes');
  });
});
