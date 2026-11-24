import { describe, it, expect } from 'vitest';
import { cn } from './utils.js';

describe('cn', () => {
  it('returns a single class unchanged', () => {
    expect(cn('px-4')).toBe('px-4');
  });

  it('joins multiple classes', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('skips falsy values', () => {
    expect(cn('px-4', false && 'hidden', null, undefined)).toBe('px-4');
  });

  it('includes truthy conditional classes', () => {
    expect(cn('px-4', true && 'block')).toBe('px-4 block');
  });

  it('supports object syntax', () => {
    expect(cn({ 'px-4': true, 'py-2': false })).toBe('px-4');
  });

  it('resolves tailwind conflicts, last wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('flattens nested arrays', () => {
    expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2');
  });

  it('keeps the custom text sizes apart from text colours', () => {
    expect(cn('text-ui', 'text-muted-foreground')).toBe('text-ui text-muted-foreground');
    expect(cn('text-sm', 'text-ui')).toBe('text-ui');
    expect(cn('text-2xs', 'text-primary')).toBe('text-2xs text-primary');
  });
});

describe('formatNumber', () => {
  it('uses one fixed locale so server and client text match', async () => {
    const { formatNumber } = await import('./utils');
    expect(formatNumber(18420)).toBe('18,420');
  });
});
