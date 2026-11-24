import { describe, expect, it } from 'vitest';
import { rowVariants } from './row.variants';

describe('rowVariants', () => {
  it('defaults to a 36 px interactive list row', () => {
    const cls = rowVariants();
    expect(cls).toContain('min-h-9');
    expect(cls).toContain('hover:bg-accent');
    expect(cls).toContain('focus-ring');
    expect(cls).not.toContain('before:bg-primary');
  });

  it('maps each size to its height', () => {
    expect(rowVariants({ size: 'nav' })).toContain('h-7');
    expect(rowVariants({ size: 'list' })).toContain('min-h-9');
    expect(rowVariants({ size: 'twoLine' })).toContain('min-h-[52px]');
    expect(rowVariants({ size: 'stacked' })).toContain('h-[54px]');
  });

  it('adds a 2 px primary bar and the accent surface when selected', () => {
    const cls = rowVariants({ selected: true });
    expect(cls).toContain('bg-accent');
    expect(cls).toContain('before:w-0.5');
    expect(cls).toContain('before:bg-primary');
  });

  it('drops the hover surface when not interactive', () => {
    expect(rowVariants({ interactive: false })).not.toContain('hover:bg-accent');
  });

  it('mutes unselected nav rows only', () => {
    expect(rowVariants({ size: 'nav' })).toContain('text-muted-foreground');
    expect(rowVariants({ size: 'nav', selected: true })).not.toContain(
      'text-muted-foreground hover:text-foreground'
    );
  });
});
