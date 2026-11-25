export type FileKind = 'md' | 'ts' | 'json' | 'csv' | 'svg';

export interface FileNode {
  name: string;
  /** Folders have children; files have a kind and text content. */
  children?: FileNode[];
  kind?: FileKind;
  content?: string;
}

const README = `# Sample site

A small site with one page and a few settings.

## Layout

- \`src\` holds the code.
- \`config\` holds the settings.
- \`data\` holds the tables.

## Start

Install the packages, then open the page in the browser.
`;

const APP = `import { readFileSync } from 'node:fs';

export interface Sale {
  region: string;
  units: number;
}

export const total = (rows: Sale[]): number => rows.reduce((sum, r) => sum + r.units, 0);

export const load = (path: string): Sale[] =>
  readFileSync(path, 'utf8')
    .split('\\n')
    .slice(1)
    .map((line) => {
      const [region, units] = line.split(',');
      return { region, units: Number(units) };
    });
`;

const SETTINGS = {
  name: 'sample-site',
  version: '1.4.0',
  public: true,
  port: 8080,
  theme: { mode: 'auto', accent: 'amber' },
  pages: ['home', 'sales', 'about'],
  cache: null,
};

const SALES = `region,month,units,revenue
North,January,120,2400
North,February,135,2700
South,January,98,1960
South,February,110,2200
East,January,150,3000
East,February,142,2840
West,January,87,1740
West,February,95,1900`;

const DIAGRAM = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 140">
<rect width="320" height="140" fill="#f2f2f2"/>
<rect x="20" y="50" width="80" height="40" rx="6" fill="#d4d4d4" stroke="#737373"/>
<rect x="120" y="50" width="80" height="40" rx="6" fill="#d4d4d4" stroke="#737373"/>
<rect x="220" y="50" width="80" height="40" rx="6" fill="#d4d4d4" stroke="#737373"/>
<path d="M100 70h20M200 70h20" stroke="#737373" stroke-width="2"/>
<g font-family="sans-serif" font-size="12" fill="#404040" text-anchor="middle">
<text x="60" y="75">Input</text><text x="160" y="75">Step</text><text x="260" y="75">Output</text>
</g>
</svg>`;

export const FILE_TREE: FileNode[] = [
  { name: 'README.md', kind: 'md', content: README },
  { name: 'src', children: [{ name: 'app.ts', kind: 'ts', content: APP }] },
  {
    name: 'config',
    children: [{ name: 'settings.json', kind: 'json', content: JSON.stringify(SETTINGS, null, 2) }],
  },
  { name: 'data', children: [{ name: 'sales.csv', kind: 'csv', content: SALES }] },
  { name: 'assets', children: [{ name: 'diagram.svg', kind: 'svg', content: DIAGRAM }] },
];

export const nodeAt = (path: string): FileNode | undefined => {
  let list: FileNode[] | undefined = FILE_TREE;
  let found: FileNode | undefined;
  for (const part of path.split('/')) {
    found = list?.find((n) => n.name === part);
    list = found?.children;
  }
  return found;
};

export const firstFile = 'README.md';
