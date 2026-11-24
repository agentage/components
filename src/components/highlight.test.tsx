import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { highlightText } from './highlight';

const marks = (node: React.ReactNode): string[] => {
  const { container } = render(<p>{node}</p>);
  return Array.from(container.querySelectorAll('mark')).map((m) => m.textContent ?? '');
};

describe('highlightText', () => {
  it('returns the text untouched without a query', () => {
    expect(highlightText('Hello')).toBe('Hello');
    expect(highlightText('Hello', '   ')).toBe('Hello');
  });

  it('marks every case-insensitive hit and keeps the original casing', () => {
    expect(marks(highlightText('Foo food FOO', 'foo'))).toEqual(['Foo', 'foo', 'FOO']);
    const { container } = render(<p>{highlightText('Foo food', 'foo')}</p>);
    expect(container.textContent).toBe('Foo food');
  });

  it('treats the query as literal text', () => {
    expect(marks(highlightText('a.b axb (x)', '.'))).toEqual(['.']);
    expect(marks(highlightText('f(x) [y]', '(x)'))).toEqual(['(x)']);
    expect(marks(highlightText('a\\b', '\\'))).toEqual(['\\']);
  });

  it('keeps marks aligned when lowercasing changes the length', () => {
    expect(marks(highlightText('\u0130stanbul Ankara', 'ankara'))).toEqual(['Ankara']);
  });

  it('returns plain text when nothing matches', () => {
    expect(marks(highlightText('Hello', 'zzz'))).toEqual([]);
  });
});
