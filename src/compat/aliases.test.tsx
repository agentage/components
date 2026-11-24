import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  Modal,
  NavLink,
  PageHeader,
  Popover,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToggleGroup,
} from '../index';
import { failOnConsole } from './quiet';

failOnConsole();

describe('0.20.2 deprecated names still work', () => {
  it('Modal isOpen and onClose', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Hello">
        Body
      </Modal>
    );
    expect(screen.getByRole('dialog', { name: 'Hello' })).toBeTruthy();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Popover isOpen and onClose', () => {
    const onClose = vi.fn();
    render(
      <Popover
        isOpen
        onClose={onClose}
        trigger={<button type="button">Open</button>}
        content="Inside"
      />
    );
    expect(screen.getByText('Inside')).toBeTruthy();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('ToggleGroup onChange', () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup
        value="a"
        onChange={onChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        columns={2}
      />
    );
    fireEvent.click(screen.getByRole('radio', { name: 'B' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('PageHeader subtitle and the default Tabs variant', () => {
    render(
      <>
        <PageHeader icon={<svg />} title="Machines" subtitle="All of them" actions={[]} />
        <Tabs value="a" onValueChange={() => undefined} variant="default">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Panel</TabsContent>
        </Tabs>
      </>
    );
    expect(screen.getByRole('heading', { name: 'Machines' })).toBeTruthy();
    expect(screen.getByText('All of them')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'A' })).toBeTruthy();
  });

  it('Select compact and NavLink still render', () => {
    render(
      <>
        <Select defaultValue="x">
          <SelectTrigger compact aria-label="Pick">
            <span>x</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="x">X</SelectItem>
          </SelectContent>
        </Select>
        <NavLink href="#" active>
          Home
        </NavLink>
      </>
    );
    expect(screen.getByRole('combobox', { name: 'Pick' }).className).toContain('h-[26px]');
    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
  });
});
