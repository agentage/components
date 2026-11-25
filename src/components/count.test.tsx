import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Count } from './count';

describe('Count', () => {
  it('renders the number as plain text in a count slot', () => {
    render(<Count>12</Count>);
    const el = screen.getByText('12');
    expect(el.dataset.slot).toBe('count');
    expect(el.tagName).toBe('SPAN');
  });

  it('merges className last and spreads props', () => {
    render(
      <Count className="ml-1" id="c">
        3
      </Count>
    );
    const el = screen.getByText('3');
    expect(el.className.endsWith('ml-1')).toBe(true);
    expect(el.id).toBe('c');
  });
});
