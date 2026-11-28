import hljs from 'highlight.js/lib/core';
import { describe, expect, it, vi } from 'vitest';
import { codeLanguage, highlightCode } from './highlight-code';

describe('highlightCode', () => {
  it('resolves names and aliases case-insensitively', () => {
    expect(codeLanguage('TS')).toBe('typescript');
    expect(codeLanguage('yml')).toBe('yaml');
    expect(codeLanguage('html')).toBe('xml');
    expect(codeLanguage('zsh')).toBe('bash');
    expect(codeLanguage('go')).toBe('go');
    expect(codeLanguage('cobol')).toBeUndefined();
    expect(codeLanguage('')).toBeUndefined();
    expect(codeLanguage()).toBeUndefined();
  });

  it('returns null for an unknown language instead of throwing', () => {
    expect(highlightCode('x', 'cobol')).toBeNull();
    expect(highlightCode('x')).toBeNull();
  });

  it('escapes the source, so the only tags are its own spans', () => {
    const html = highlightCode('<script>alert("x")</script>', 'html') ?? '';
    expect(html).not.toContain('<script');
    expect(html).toContain('&lt;');
    expect(html.replace(/<\/?span[^>]*>/g, '')).not.toMatch(/<[a-z]/i);
  });

  it('tokenizes every registered language', () => {
    for (const lang of ['typescript', 'javascript', 'bash', 'shell', 'yaml', 'json', 'python']) {
      expect(highlightCode('x = 1 # c', lang)).not.toBeNull();
    }
    for (const lang of ['sql', 'diff', 'xml', 'css', 'markdown', 'go', 'dockerfile']) {
      expect(highlightCode('x', lang)).not.toBeNull();
    }
    expect(highlightCode('const a = 1;', 'ts')).toContain('hljs-keyword');
  });
});

describe('highlightCode on hostile input', () => {
  it('treats prototype names as unknown languages', () => {
    for (const name of ['constructor', '__proto__', 'toString', 'hasOwnProperty']) {
      expect(codeLanguage(name)).toBeUndefined();
      expect(highlightCode('x', name)).toBeNull();
    }
  });

  it('returns the escaped plain text when highlighting throws', () => {
    const spy = vi.spyOn(hljs, 'highlight').mockImplementation(() => {
      throw new Error('boom');
    });
    expect(highlightCode('<b>"a" & \'b\'</b>', 'ts')).toBe(
      '&lt;b&gt;&quot;a&quot; &amp; &#x27;b&#x27;&lt;/b&gt;'
    );
    spy.mockRestore();
  });
});
