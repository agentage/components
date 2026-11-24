import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const setup = () =>
  render(
    <Tabs defaultValue="one">
      <TabsList aria-label="Sections">
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two" disabled>
          Two
        </TabsTrigger>
        <TabsTrigger value="three">Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Panel one</TabsContent>
      <TabsContent value="three">Panel three</TabsContent>
    </Tabs>
  );

describe('Tabs', () => {
  it('names the tablist from aria-label', () => {
    setup();
    expect(screen.getByRole('tablist', { name: 'Sections' })).toBeTruthy();
  });

  it('wires each tab to its panel', () => {
    setup();
    const tab = screen.getByRole('tab', { name: 'One' });
    const panel = screen.getByRole('tabpanel');
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    expect(tab.getAttribute('aria-selected')).toBe('true');
    expect(tab.getAttribute('tabindex')).toBe('0');
  });

  it('moves between tabs with the arrow keys, skipping disabled ones', () => {
    setup();
    const one = screen.getByRole('tab', { name: 'One' });
    one.focus();
    fireEvent.keyDown(one, { key: 'ArrowRight' });

    const three = screen.getByRole('tab', { name: 'Three' });
    expect(document.activeElement).toBe(three);
    expect(three.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toBe('Panel three');
  });

  it('jumps to the first and last tab with Home and End', () => {
    setup();
    const one = screen.getByRole('tab', { name: 'One' });
    one.focus();
    fireEvent.keyDown(one, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Three' }));

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Home' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'One' }));
  });
});

describe('tabs variants', () => {
  const renderVariant = (variant: 'default' | 'underline' | 'pill' | 'line') =>
    render(
      <Tabs defaultValue="one" variant={variant}>
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">P</TabsContent>
      </Tabs>
    );

  it('renders the pill look for the default variant', () => {
    renderVariant('default');
    const list = screen.getByRole('tablist').className;
    for (const c of ['h-8.5', 'rounded-lg', 'border', 'bg-card']) expect(list).toContain(c);
    const on = screen.getByRole('tab', { name: 'One' }).className;
    for (const c of ['h-7', 'rounded-md', 'focus-ring', 'bg-accent']) expect(on).toContain(c);
    const off = screen.getByRole('tab', { name: 'Two' }).className;
    // One weight in both states, so selecting a tab never widens it.
    const weight = (cls: string) => cls.split(' ').filter((c) => c.startsWith('font-'));
    expect(weight(on)).toEqual(weight(off));
    expect(off).toContain('text-muted-foreground');
    expect(off).toContain('hover:bg-accent');
    expect(off.split(' ')).not.toContain('bg-accent');
    expect(screen.getByRole('tabpanel').className).toContain('focus-ring');
  });

  it('renders the line look for the underline variant', () => {
    renderVariant('underline');
    const list = screen.getByRole('tablist').className;
    for (const c of ['h-9.5', 'border-b', 'w-full']) expect(list).toContain(c);
    expect(list).not.toContain('rounded-lg');
    const on = screen.getByRole('tab', { name: 'One' }).className;
    expect(on).toContain('after:bg-primary');
    expect(on.split(' ')).not.toContain('bg-accent');
    expect(screen.getByRole('tab', { name: 'Two' }).className).not.toContain('after:bg-primary');
  });

  it('renders the same looks for the named pill and line variants', () => {
    const pill = renderVariant('pill');
    const pillList = screen.getByRole('tablist').className;
    pill.unmount();
    renderVariant('default');
    expect(screen.getByRole('tablist').className).toBe(pillList);
  });
});

describe('tabs pass-through', () => {
  it('merges className last and spreads props on every part', () => {
    const { container } = render(
      <Tabs defaultValue="one" className="gap-2" id="root" data-x="r">
        <TabsList className="w-full" id="list" data-x="l">
          <TabsTrigger value="one" className="grow" data-x="t">
            One
          </TabsTrigger>
        </TabsList>
        <TabsContent value="one" className="pt-2" data-x="c">
          P
        </TabsContent>
      </Tabs>
    );

    const root = container.querySelector('[data-slot="tabs"]') as HTMLElement;
    expect(root.className).toBe('flex flex-col gap-2');
    expect(root.id).toBe('root');
    expect(root.dataset.x).toBe('r');

    const list = screen.getByRole('tablist');
    expect(list.className).toContain('rounded-lg');
    expect(list.className.endsWith('w-full')).toBe(true);
    expect(list.id).toBe('list');
    expect(list.dataset.x).toBe('l');

    const tab = screen.getByRole('tab', { name: 'One' });
    expect(tab.className.endsWith('grow')).toBe(true);
    expect(tab.className).toContain('bg-accent');
    expect(tab.dataset.x).toBe('t');
    expect(tab.getAttribute('value')).toBe(null);

    const panel = screen.getByRole('tabpanel');
    expect(panel.className.endsWith('pt-2')).toBe(true);
    expect(panel.dataset.x).toBe('c');
  });

  it('calls a caller onClick before switching tabs', () => {
    const seen: string[] = [];
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger
            value="two"
            onClick={() => {
              seen.push('click');
            }}
          >
            Two
          </TabsTrigger>
        </TabsList>
        <TabsContent value="two">Panel two</TabsContent>
      </Tabs>
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(seen).toEqual(['click']);
    expect(screen.getByRole('tabpanel').textContent).toBe('Panel two');
  });
});

describe('tabs keyboard reachability', () => {
  it('makes the first trigger tabbable when nothing is selected', () => {
    render(
      <Tabs>
        <TabsList aria-label="Sections">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">P</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'One' }).tabIndex).toBe(0);
    expect(screen.getByRole('tab', { name: 'Two' }).tabIndex).toBe(-1);
  });

  it('skips a disabled first trigger when nothing is selected', () => {
    render(
      <Tabs>
        <TabsList aria-label="Sections">
          <TabsTrigger value="one" disabled>
            One
          </TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="two">P</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'One' }).tabIndex).toBe(-1);
    expect(screen.getByRole('tab', { name: 'Two' }).tabIndex).toBe(0);
  });

  it('keeps only the selected trigger tabbable once a value matches', () => {
    setup();
    expect(screen.getByRole('tab', { name: 'One' }).tabIndex).toBe(0);
    expect(screen.getByRole('tab', { name: 'Three' }).tabIndex).toBe(-1);
  });
});

describe('tabs pill look', () => {
  it('renders 28 px pills with the active one on the accent surface and a count', () => {
    render(
      <Tabs value="a" variant="pill">
        <TabsList aria-label="Sections">
          <TabsTrigger value="a" count={7}>
            Installed
          </TabsTrigger>
          <TabsTrigger value="b">Market</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const [a, b] = screen.getAllByRole('tab');
    expect(a.className).toContain('h-7');
    expect(a.className.split(' ')).toContain('bg-accent');
    expect(b.className.split(' ')).not.toContain('bg-accent');
    expect(screen.getByRole('tablist').className).toContain('h-8.5');
    expect(a.querySelector('[data-slot="tabs-count"]')?.textContent).toBe('7');
  });
});

describe('Tabs ids and forms', () => {
  it('builds valid IDREFs from values with spaces and never submits a form', () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Tabs defaultValue="api keys">
          <TabsList>
            <TabsTrigger value="api keys">API keys</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="api keys">Keys</TabsContent>
        </Tabs>
      </form>
    );
    const tab = screen.getByRole('tab', { name: 'API keys' });
    const panel = screen.getByRole('tabpanel', { name: 'API keys' });
    expect(tab.id).not.toContain(' ');
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    fireEvent.click(screen.getByRole('tab', { name: 'Other' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
