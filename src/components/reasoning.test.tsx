import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reasoning } from './reasoning';

describe('Reasoning', () => {
  it('reads Thinking while running and Thought for when done', () => {
    const { rerender } = render(<Reasoning seconds={2.4} status="running" />);
    expect(screen.getByText('Thinking 2 s')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
    rerender(<Reasoning seconds={6} />);
    expect(screen.getByText('Thought for 6 s')).toBeTruthy();
  });

  it('opens the thought text', () => {
    render(<Reasoning seconds={6}>First find the last tag.</Reasoning>);
    const row = screen.getByRole('button', { name: 'Thought for 6 s' });
    expect(row.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(row);
    expect(row.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('First find the last tag.')).toBeTruthy();
  });
});
