import { describe, expect, it } from 'vitest';
import { controlVariants, fieldVariants } from './control.variants';

describe('controlVariants', () => {
  it('is 28 px with 13 px text by default', () => {
    const cls = controlVariants();
    expect(cls).toContain('h-7');
    expect(cls).toContain('text-ui');
    expect(cls).toContain('rounded-lg');
  });

  it('is 24 px with 12 px text at size sm', () => {
    const cls = controlVariants({ size: 'sm' });
    expect(cls).toContain('h-6');
    expect(cls).toContain('text-xs');
    expect(cls).not.toContain('h-7');
  });
});

describe('fieldVariants', () => {
  it('is 30 px at md and carries the focus ring', () => {
    const cls = fieldVariants();
    expect(cls).toContain('h-[30px]');
    expect(cls).toContain('text-ui');
    expect(cls).toContain('focus-ring');
    expect(cls).toContain('rounded-md');
  });

  it('is 26 px at 12 px text at size sm', () => {
    const cls = fieldVariants({ size: 'sm' });
    expect(cls).toContain('h-[26px]');
    expect(cls).toContain('text-xs');
  });

  it('adds the destructive border on error', () => {
    expect(fieldVariants({ error: true })).toContain('border-destructive');
    expect(fieldVariants()).not.toContain('border-destructive');
  });

  it('can omit the size classes for composition', () => {
    expect(fieldVariants({ size: null })).not.toContain('h-[30px]');
  });
});
