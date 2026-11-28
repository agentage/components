import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Message } from './message';

describe('Message', () => {
  it('draws the user turn as a bubble and the assistant turn flat', () => {
    const { container } = render(
      <>
        <Message from="user">Question</Message>
        <Message>Answer</Message>
      </>
    );
    const [user, assistant] = [...container.querySelectorAll('[data-slot="message"]')];
    expect(user?.getAttribute('data-from')).toBe('user');
    expect(user?.querySelector('[data-slot="message-body"]')?.className).toContain('bg-accent');
    expect(assistant?.getAttribute('data-from')).toBe('assistant');
    expect(assistant?.querySelector('[data-slot="message-body"]')?.className).not.toContain(
      'bg-accent'
    );
  });

  it('renders the actions row only when given', () => {
    const { container, rerender } = render(<Message>Answer</Message>);
    expect(container.querySelector('[data-slot="message-actions"]')).toBeNull();
    rerender(<Message actions={<button type="button">Copy</button>}>Answer</Message>);
    expect(screen.getByRole('button', { name: 'Copy' })).toBeTruthy();
  });
});
