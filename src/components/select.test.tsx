import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Select, SelectTrigger, SelectValue } from './select';

const trigger = (props: {
  compact?: boolean;
  size?: 'sm' | 'md';
  error?: boolean;
  className?: string;
}): void => {
  render(
    <Select>
      <SelectTrigger {...props}>
        <SelectValue placeholder="Pick" />
      </SelectTrigger>
    </Select>
  );
};

describe('SelectTrigger class strings', () => {
  it('defaults to the dense 30 px md size and merges className last', () => {
    trigger({ className: 'mt-4' });
    const cls = screen.getByRole('combobox').className;
    expect(cls).toContain('h-[30px] px-2.5 text-ui');
    expect(cls.endsWith('mt-4')).toBe(true);
  });

  it('renders size sm at 26 px with 12 px text', () => {
    trigger({ size: 'sm' });
    const cls = screen.getByRole('combobox').className;
    expect(cls).toContain('h-[26px]');
    expect(cls).toContain('text-xs');
    expect(cls).not.toContain('h-[30px]');
  });

  it('maps the deprecated compact prop to the sm look', () => {
    trigger({ compact: true });
    const cls = screen.getByRole('combobox').className;
    expect(cls).toContain('h-[26px]');
    expect(cls).not.toContain('h-[30px]');
  });

  it('marks the trigger invalid and swaps the resting border on error', () => {
    trigger({ error: true });
    const el = screen.getByRole('combobox');
    expect(el.getAttribute('aria-invalid')).toBe('true');
    expect(el.className).toContain('border-destructive');
    expect(el.className).not.toContain('border-border');
  });
});
