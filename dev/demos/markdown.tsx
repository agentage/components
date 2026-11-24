'use client';
import { MarkdownRenderer } from '../../src';
import { Block } from '../components/demo';

const SAMPLE = `## Installation

Install the package:

\`\`\`bash
npm install example-package
\`\`\`

It supports **bold**, *italic*, [links](https://example.com) and \`inline code\`.

### Features

- Tables and checklists
- Optional raw HTML

| Tool | Scope |
| --- | --- |
| read | One file |
| search | Whole folder |

> A quote has a quiet side rule.`;

export const Example = () => (
  <Block caption="MarkdownRenderer turns a markdown string into styled prose, with tables and code blocks.">
    <div className="rounded-lg border border-border bg-card p-4">
      <MarkdownRenderer>{SAMPLE}</MarkdownRenderer>
    </div>
  </Block>
);

export const Sizes = () => (
  <Block caption="Size sm is 13 px, for panes and cards.">
    <div className="max-w-md rounded-lg border border-border bg-card p-4">
      <MarkdownRenderer size="sm">
        {'### Small\n\nBody text with `code` and a [link](https://example.com).'}
      </MarkdownRenderer>
    </div>
  </Block>
);
