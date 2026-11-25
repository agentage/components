import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from './chip';

describe('Chip pressed and size', () => {
  it('exposes aria-pressed and toggles on click', () => {
    const onClick = vi.fn();
    render(
      <Chip size="sm" pressed onClick={onClick}>
        Needs attention
      </Chip>
    );
    const body = screen.getByRole('button', { name: 'Needs attention' });
    expect(body.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(body);
    expect(onClick).toHaveBeenCalled();
    expect(body.parentElement?.className).toContain('border-primary');
    expect(body.parentElement?.className).toContain('h-5');
  });

  it('has no aria-pressed when not a toggle', () => {
    render(<Chip onClick={() => {}}>Plain</Chip>);
    expect(screen.getByRole('button').hasAttribute('aria-pressed')).toBe(false);
  });
});
