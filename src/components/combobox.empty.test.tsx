import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Combobox } from './combobox';

describe('Combobox empty state', () => {
  it('keeps the listbox to options only and announces the message beside it', () => {
    render(<Combobox options={[{ value: 'red', label: 'Red' }]} emptyMessage="Nothing" />);
    fireEvent.click(screen.getByRole('combobox'));
    const input = screen.getByRole('combobox', { name: 'Search...' });
    const list = document.getElementById(input.getAttribute('aria-controls') ?? '');
    expect(list?.getAttribute('role')).toBe('listbox');
    fireEvent.change(input, { target: { value: 'zzz' } });
    const message = screen.getByText('Nothing');
    expect(list?.contains(message)).toBe(false);
    expect(message.getAttribute('aria-live')).toBe('polite');
    expect([...(list?.children ?? [])].every((c) => c.getAttribute('role') === 'option')).toBe(
      true
    );
  });
});
