import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

const LANGUAGES = {
  typescript,
  javascript,
  bash,
  shell,
  yaml,
  json,
  python,
  sql,
  diff,
  xml,
  css,
  markdown,
  go,
  dockerfile,
};

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

const escapeHtml = (text: string): string => text.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);

const ALIASES: Record<string, keyof typeof LANGUAGES> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  sh: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  html: 'xml',
};

let registered = false;

// Registered on first use, so importing the module has no side effects.
const register = (): void => {
  if (registered) return;
  for (const [name, lang] of Object.entries(LANGUAGES)) hljs.registerLanguage(name, lang);
  registered = true;
};

/** The registered language a name or alias resolves to, or undefined when it is not known. */
export const codeLanguage = (language?: string): string | undefined => {
  const key = language?.trim().toLowerCase();
  if (!key) return undefined;
  if (Object.hasOwn(LANGUAGES, key)) return key;
  return Object.hasOwn(ALIASES, key) ? ALIASES[key] : undefined;
};

/**
 * Highlighted HTML for `code`, or null for an unknown language. The output is escaped by
 * highlight.js (only its own `hljs-*` spans are markup), so it is safe as inner HTML. It never
 * throws: if highlighting fails, the escaped plain text comes back.
 */
export const highlightCode = (code: string, language?: string): string | null => {
  const lang = codeLanguage(language);
  if (!lang) return null;
  try {
    register();
    return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
  } catch {
    return escapeHtml(code);
  }
};
