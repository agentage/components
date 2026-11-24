import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from './checkbox';
import { Combobox } from './combobox';
import { Switch } from './switch';

// 0.20 treated an explicit `undefined` as empty or unchecked, never as uncontrolled.
describe('explicit undefined stays controlled', () => {
  it('Checkbox and Switch do not toggle themselves when the parent ignores the change', () => {
    render(
      <>
        <Checkbox aria-label="Agree" checked={undefined} />
        <Switch aria-label="On" checked={undefined} />
      </>
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Agree' }));
    fireEvent.click(screen.getByRole('switch', { name: 'On' }));
    expect(screen.getByRole('checkbox', { name: 'Agree' }).getAttribute('aria-checked')).toBe(
      'false'
    );
    expect(screen.getByRole('switch', { name: 'On' }).getAttribute('aria-checked')).toBe('false');
  });

  it('Combobox shows the placeholder again after a reset to undefined', async () => {
    const options = [{ value: 'red', label: 'Red' }];
    const { rerender } = render(<Combobox options={options} value="red" />);
    expect(screen.getByRole('combobox', { name: 'Select...' }).textContent).toContain('Red');
    rerender(<Combobox options={options} value={undefined} />);
    fireEvent.click(screen.getByRole('combobox', { name: 'Select...' }));
    await act(() => new Promise((r) => setTimeout(r, 0)));
    fireEvent.click(screen.getByRole('option', { name: 'Red' }));
    expect(screen.getByRole('combobox', { name: 'Select...' })).toBeTruthy();
  });

  it('uncontrolled pickers still keep their own value', () => {
    render(<Checkbox aria-label="Free" />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Free' }));
    expect(screen.getByRole('checkbox', { name: 'Free' }).getAttribute('aria-checked')).toBe(
      'true'
    );
  });
});

describe('Combobox list focus', () => {
  it('stays open when the list padding is pressed and closes when focus leaves', async () => {
    const options = Array.from({ length: 9 }, (_, i) => ({ value: `v${i}`, label: `Item ${i}` }));
    render(
      <>
        <Combobox options={options} />
        <button type="button">After</button>
      </>
    );
    fireEvent.click(screen.getByRole('combobox', { name: 'Select...' }));
    await act(() => new Promise((r) => setTimeout(r, 0)));
    const list = screen.getByRole('listbox');
    expect(fireEvent.mouseDown(list)).toBe(false);
    fireEvent.blur(screen.getByRole('combobox', { name: 'Search...' }), {
      relatedTarget: screen.getByRole('button', { name: 'After' }),
    });
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
