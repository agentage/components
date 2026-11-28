import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApprovalBar } from './approval-bar';

const NAMES = ['Allow once', 'Allow in this session', 'Always allow', 'Skip'];

describe('ApprovalBar', () => {
  it('offers four choices, Allow once first and filled', () => {
    render(<ApprovalBar>Posts a message.</ApprovalBar>);
    const group = screen.getByRole('group', { name: 'Approve this call' });
    const buttons = [...group.querySelectorAll('button')];
    expect(buttons.map((b) => b.textContent)).toEqual(NAMES);
    expect(buttons[0]?.getAttribute('data-variant')).toBe('default');
    expect(screen.getByText('Posts a message.')).toBeTruthy();
  });

  it('keeps every button in place, disabled, with the choice marked', () => {
    const onValueChange = vi.fn();
    render(<ApprovalBar onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Always allow' }));
    expect(onValueChange).toHaveBeenCalledWith('always');
    const buttons = screen.getAllByRole('button');
    expect(buttons.map((b) => b.textContent)).toEqual(NAMES);
    expect(buttons.every((b) => b.hasAttribute('disabled'))).toBe(true);
    expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual([
      'false',
      'false',
      'true',
      'false',
    ]);
    expect(buttons[2]?.getAttribute('data-variant')).toBe('default');
    expect(buttons[0]?.getAttribute('data-variant')).toBe('outline');
  });

  it('shows a controlled decision', () => {
    render(<ApprovalBar value="skip" />);
    expect(screen.getByRole('button', { name: 'Skip' }).getAttribute('aria-pressed')).toBe('true');
  });
});
