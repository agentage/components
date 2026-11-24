import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  CodeBlock,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  ConfirmByTyping,
  ContextMenu,
  ContextMenuItem,
  ContextMenuLabel,
  CopyButton,
  DangerZone,
  DangerZoneAction,
  Sheet,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
} from '../index';
import { failOnConsole } from './quiet';

failOnConsole();

describe('0.20.2 overlays', () => {
  it('Sheet opens controlled and closes with Escape', () => {
    const Demo = (): React.JSX.Element => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open Sheet</Button>
          <Sheet
            open={open}
            onOpenChange={setOpen}
            title="Details"
            description="Edit it."
            header={<span>hdr</span>}
          >
            <p>Body</p>
          </Sheet>
        </>
      );
    };
    render(<Demo />);
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Open Sheet' }));
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeTruthy();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Tooltip shows on focus and hides on Escape', async () => {
    render(
      <Tooltip content="Edit this item" side="bottom">
        <Button size="sm">Top</Button>
      </Tooltip>
    );
    fireEvent.focus(screen.getByRole('button', { name: 'Top' }));
    expect((await screen.findByRole('tooltip')).textContent).toBe('Edit this item');
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('Command opens, filters and runs an item', () => {
    const run = vi.fn();
    render(
      <Command open onOpenChange={() => undefined}>
        <CommandGroup heading="Navigation">
          <CommandItem icon={<svg />} shortcut="1" onClick={run}>
            Dashboard
          </CommandItem>
          <CommandItem>Machines</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandEmpty>No results found.</CommandEmpty>
      </Command>
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } });
    expect(screen.getByText('No results found.')).toBeTruthy();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'dash' } });
    fireEvent.click(screen.getByText('Dashboard'));
    expect(run).toHaveBeenCalledTimes(1);
  });

  it('ContextMenu opens on contextmenu and lists items', () => {
    render(
      <ContextMenu trigger={<button type="button">file.md</button>}>
        <ContextMenuLabel>file.md</ContextMenuLabel>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByRole('button', { name: 'file.md' }));
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeTruthy();
  });

  it('ConfirmByTyping enables the action only on the exact phrase', () => {
    const onConfirm = vi.fn();
    render(
      <DangerZone description="Permanent.">
        <DangerZoneAction
          label="Delete memory"
          description="Gone."
          action={
            <ConfirmByTyping
              phrase="work-notes"
              title="Delete?"
              actionLabel="Delete memory now"
              onConfirm={onConfirm}
              trigger={<Button variant="destructive">Delete memory</Button>}
            />
          }
        />
      </DangerZone>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete memory' }));
    const action = screen.getByRole('button', { name: 'Delete memory now' }) as HTMLButtonElement;
    expect(action.disabled).toBe(true);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'work-notes' } });
    expect(action.disabled).toBe(false);
    fireEvent.click(action);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});

describe('0.20.2 tabs, copy and code', () => {
  it('Tabs switch panels, skip disabled, underline variant', () => {
    const Demo = (): React.JSX.Element => {
      const [tab, setTab] = useState('a');
      return (
        <Tabs value={tab} onValueChange={setTab} variant="underline">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b">B</TabsTrigger>
            <TabsTrigger value="c" disabled>
              C
            </TabsTrigger>
          </TabsList>
          <TabsContent value="a">Panel A</TabsContent>
          <TabsContent value="b">Panel B</TabsContent>
        </Tabs>
      );
    };
    render(<Demo />);
    expect(screen.getByText('Panel A')).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByText('Panel B')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'B' }).getAttribute('aria-selected')).toBe('true');
    expect((screen.getByRole('tab', { name: 'C' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('CopyButton and CodeBlock copy their text', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(
      <>
        <CopyButton text="npm i x" variant="secondary" />
        <CopyButton text="tok" iconOnly variant="ghost" />
        <CodeBlock language="bash" code="agentage login" />
      </>
    );
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Copy', exact: true })[0]);
    });
    expect(writeText).toHaveBeenCalledWith('npm i x');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    });
    expect(writeText).toHaveBeenCalledWith('agentage login');
  });
});
