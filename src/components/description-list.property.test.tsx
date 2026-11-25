import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { PropertyDate } from './property-date';
import { DescriptionList } from './description-list';
import { Property, PropertyText } from './description-list.property';
import { PropertyMultiSelect, PropertySelect } from './property-select';

const TODAY = new Date(2026, 10, 22);
const STATUS = [
  { value: 'todo', label: 'Todo' },
  { value: 'progress', label: 'In progress' },
];
const LABELS = [
  { value: 'bug', label: 'bug' },
  { value: 'feature', label: 'feature' },
];

const Sheet = () => {
  const [status, setStatus] = useState('progress');
  const [labels, setLabels] = useState(['feature']);
  const [due, setDue] = useState<Date | null>(new Date(2026, 10, 25));
  const [title, setTitle] = useState('Expose types');
  return (
    <DescriptionList variant="editable">
      <Property label="Status">
        <PropertySelect value={status} onValueChange={setStatus} options={STATUS} />
      </Property>
      <Property label="Labels">
        <PropertyMultiSelect
          value={labels}
          onValueChange={setLabels}
          options={LABELS}
          placeholder="Add label"
        />
      </Property>
      <Property label="Due">
        <PropertyDate value={due} onValueChange={setDue} today={TODAY} />
      </Property>
      <Property label="Title">
        <PropertyText value={title} onValueChange={setTitle} />
      </Property>
      <Property label="Updated">3m ago</Property>
    </DescriptionList>
  );
};

const btn = (name: string | RegExp) => screen.getByRole('button', { name });

describe('DescriptionList variant="editable" with Property rows', () => {
  it('names each value button "Label: value" and keeps read-only rows plain', () => {
    render(<Sheet />);
    expect(btn('Status: In progress')).toBeTruthy();
    expect(btn('Labels: feature')).toBeTruthy();
    expect(btn('Due: Nov 25')).toBeTruthy();
    expect(screen.getByText('3m ago').tagName).toBe('DD');
  });

  it('PropertySelect: picks a value, closes and refocuses the trigger', () => {
    render(<Sheet />);
    fireEvent.click(btn('Status: In progress'));
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Todo' }));
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(btn('Status: Todo'));
  });

  it('PropertySelect: Escape closes and returns focus', () => {
    render(<Sheet />);
    fireEvent.keyDown(btn('Status: In progress'), { key: 'Enter' });
    const menu = screen.getByRole('menu');
    fireEvent.keyDown(menu, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(btn('Status: In progress'));
  });

  it('PropertyMultiSelect: toggles items and stays open', () => {
    render(<Sheet />);
    fireEvent.click(btn('Labels: feature'));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'bug' }));
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(btn('Labels: bug, feature')).toBeTruthy();
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'feature' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'bug' }));
    expect(btn('Labels: none').textContent).toBe('Add label');
  });

  it('PropertyDate: presets set the value, No date clears it, past dates are overdue', () => {
    render(<Sheet />);
    fireEvent.click(btn('Due: Nov 25'));
    expect(document.activeElement?.textContent).toContain('Today');
    fireEvent.click(screen.getByRole('button', { name: /Next week/ }));
    expect(btn('Due: Nov 29')).toBeTruthy();
    fireEvent.click(btn('Due: Nov 29'));
    fireEvent.click(screen.getByRole('button', { name: 'No date' }));
    expect(btn('Due: Set date')).toBeTruthy();
    fireEvent.click(btn('Due: Set date'));
    const field = screen.getByLabelText('Due, pick a day');
    fireEvent.change(field, { target: { value: '2026-11-01' } });
    // The typed day is a draft until Enter or blur, so partial input never closes the popover.
    expect(screen.getByLabelText('Due, pick a day')).toBe(field);
    fireEvent.keyDown(field, { key: 'Enter' });
    const overdue = btn('Due: Nov 1, overdue');
    expect(overdue.className).toContain('text-destructive');
  });

  it('PropertyDate: Escape closes and refocuses the value', () => {
    render(<Sheet />);
    const trigger = btn('Due: Nov 25');
    fireEvent.click(trigger);
    act(() => {
      fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('PropertyText edits in place', () => {
    render(<Sheet />);
    const field = screen.getByRole('textbox', { name: 'Title' });
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: 'Expose the types' } });
    fireEvent.blur(field);
    expect((screen.getByRole('textbox', { name: 'Title' }) as HTMLInputElement).value).toBe(
      'Expose the types'
    );
  });
});
