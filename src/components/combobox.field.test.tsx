import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Combobox } from './combobox';
import { FormField } from './form-field';

const options = [{ value: 'a', label: 'Alpha' }];

describe('Combobox in a FormField', () => {
  it('ties the label, hint, error and required state to the trigger', () => {
    const { container } = render(
      <FormField label="Team" hint="Who owns it" error="Pick a team" required>
        <Combobox options={options} placeholder="Select a team" />
      </FormField>
    );
    const trigger = screen.getByRole('combobox', { name: /^Team/ });
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.getAttribute('aria-required')).toBe('true');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    const described = (trigger.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent)
      .join(' ');
    expect(described).toContain('Pick a team');
    const root = container.querySelector('[data-slot="combobox"]') as HTMLElement;
    for (const attr of ['id', 'aria-describedby', 'aria-invalid', 'aria-required'])
      expect(root.hasAttribute(attr)).toBe(false);
  });

  it('moves aria-label from the 0.20 root onto the trigger', () => {
    render(<Combobox options={options} aria-label="Colour" />);
    expect(screen.getByRole('combobox', { name: 'Colour' }).tagName).toBe('BUTTON');
  });

  it('still opens on a click', () => {
    render(<Combobox options={options} aria-label="Colour" />);
    const trigger = screen.getByRole('combobox', { name: 'Colour' });
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('focuses the trigger on a label click without opening the list', () => {
    render(
      <FormField label="Team">
        <Combobox options={options} />
      </FormField>
    );
    fireEvent.click(screen.getByText('Team'));
    const trigger = screen.getByRole('combobox', { name: 'Team' });
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
