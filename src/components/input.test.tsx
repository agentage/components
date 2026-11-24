import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input, Textarea } from './input';

describe('Input', () => {
  it('defaults to the dense 30 px md size', () => {
    render(<Input placeholder="Name" />);
    const cls = screen.getByPlaceholderText('Name').className;
    expect(cls).toContain('h-[30px]');
    expect(cls).toContain('text-ui');
    expect(cls).toContain('border-border');
  });

  it('renders size sm at 26 px with 12 px text', () => {
    render(<Input placeholder="S" size="sm" />);
    const cls = screen.getByPlaceholderText('S').className;
    expect(cls).toContain('h-[26px]');
    expect(cls).toContain('text-xs');
    expect(cls).not.toContain('h-[30px]');
  });

  it('keeps a numeric size as the native size attribute at md height', () => {
    render(<Input placeholder="N" size={12} />);
    const el = screen.getByPlaceholderText('N');
    expect(el.getAttribute('size')).toBe('12');
    expect(el.className).toContain('h-[30px]');
  });

  it('does not set the native size attribute for a string size', () => {
    render(<Input placeholder="S2" size="sm" />);
    expect(screen.getByPlaceholderText('S2').getAttribute('size')).toBeNull();
  });

  it('applies mono, error, disabled and merges className last', () => {
    render(<Input placeholder="Name" mono error disabled className="mt-4" />);
    const el = screen.getByPlaceholderText('Name');
    expect(el.className).toContain('font-mono');
    expect(el.className).toContain('border-destructive');
    expect(el.className).toContain('opacity-50 cursor-not-allowed');
    expect(el.className.endsWith('mt-4')).toBe(true);
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('Textarea', () => {
  it('defaults to md and does not grow', () => {
    render(<Textarea placeholder="Bio" />);
    const el = screen.getByPlaceholderText('Bio');
    expect(el.className).toContain('text-ui');
    expect(el.className).not.toContain('field-sizing');
    expect(el.getAttribute('rows')).toBeNull();
  });

  it('grows with content from minRows when autoGrow is on', () => {
    render(<Textarea placeholder="Bio" autoGrow minRows={4} />);
    const el = screen.getByPlaceholderText('Bio');
    expect(el.className).toContain('[field-sizing:content]');
    expect(el.getAttribute('rows')).toBe('4');
    expect(el.style.minHeight).toContain('4lh');
  });
});
