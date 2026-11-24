import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';

describe('Badge', () => {
  it('is 20 px', () => {
    render(<Badge>new</Badge>);
    expect(screen.getByText('new').className).toContain('h-5');
  });

  it('renders the solid pill', () => {
    render(<Badge variant="solid">3</Badge>);
    const cls = screen.getByText('3').className;
    expect(cls).toContain('rounded-full');
    expect(cls).toContain('bg-primary');
  });

  it('renders a count badge: solid by default, empty at 0, capped at max', () => {
    const { container, rerender } = render(<Badge count={0} />);
    expect(container.firstChild).toBeNull();
    rerender(<Badge count={3} />);
    expect(screen.getByText('3').className).toContain('bg-primary');
    rerender(<Badge count={150} />);
    expect(screen.getByText('99+')).toBeTruthy();
    rerender(<Badge count={12} max={9} />);
    expect(screen.getByText('9+')).toBeTruthy();
    rerender(<Badge count={5} variant="secondary" />);
    expect(screen.getByText('5').className).not.toContain('bg-primary font-bold');
  });
});
