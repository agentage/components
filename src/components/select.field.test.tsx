import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormField } from './form-field';
import { Select } from './select';

const options = [{ value: 'a', label: 'Alpha' }];

describe('Select in a FormField', () => {
  it('ties the label, hint, error and required state to the trigger', () => {
    const { container } = render(
      <FormField label="Team" hint="Who owns it" error="Pick a team" required>
        <Select options={options} placeholder="Select a team" />
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
    const root = container.querySelector('[data-slot="select"]') as HTMLElement;
    for (const attr of ['id', 'aria-describedby', 'aria-invalid', 'aria-required'])
      expect(root.hasAttribute(attr)).toBe(false);
  });

  it('puts aria-label and aria-labelledby on the trigger and still opens on a click', () => {
    render(<Select options={options} aria-label="Colour" />);
    const trigger = screen.getByRole('combobox', { name: 'Colour' });
    expect(trigger.tagName).toBe('BUTTON');
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('focuses the trigger on a label click without opening the list', () => {
    render(
      <FormField label="Team">
        <Select options={options} />
      </FormField>
    );
    fireEvent.click(screen.getByText('Team'));
    const trigger = screen.getByRole('combobox', { name: 'Team' });
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
