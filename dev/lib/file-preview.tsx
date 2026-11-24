'use client';
import { Fragment, type ReactNode } from 'react';
import {
  Card,
  CodeBlock,
  DataTree,
  MarkdownRenderer,
  NavRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src';
import {} from '../components/demo';
import { type FileNode } from './files-data';
import { UiIcon } from './ui-icons';

export const FileIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5" />
  </svg>
);

export const LANG = {
  md: 'markdown',
  ts: 'typescript',
  json: 'json',
  csv: 'csv',
  svg: 'xml',
} as const;

export const matches = (n: FileNode, q: string): boolean =>
  n.name.toLowerCase().includes(q) || (n.children?.some((c) => matches(c, q)) ?? false);

export const Rows = ({
  nodes,
  base,
  depth,
  q,
  open,
  toggle,
  selected,
  select,
}: {
  nodes: FileNode[];
  base: string;
  depth: number;
  q: string;
  open: Set<string>;
  toggle: (path: string) => void;
  selected: string;
  select: (path: string) => void;
}): ReactNode =>
  nodes
    .filter((n) => !q || matches(n, q))
    .map((n) => {
      const path = base ? `${base}/${n.name}` : n.name;
      if (!n.children)
        return (
          <NavRow
            key={path}
            depth={depth}
            icon={<FileIcon />}
            selected={selected === path}
            onClick={() => select(path)}
          >
            {n.name}
          </NavRow>
        );
      const expanded = Boolean(q) || open.has(path);
      return (
        <Fragment key={path}>
          <NavRow
            depth={depth}
            icon={<UiIcon name="folder" />}
            expanded={expanded}
            onToggle={() => toggle(path)}
            onClick={() => toggle(path)}
            count={n.children.length}
          >
            {n.name}
          </NavRow>
          {expanded && (
            <Rows
              nodes={n.children}
              base={path}
              depth={depth + 1}
              q={q}
              open={open}
              toggle={toggle}
              selected={selected}
              select={select}
            />
          )}
        </Fragment>
      );
    });

export const CsvTable = ({ text }: { text: string }) => {
  const [head, ...rows] = text.split('\n').map((l) => l.split(','));
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {head.map((h) => (
            <TableHead key={h}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.join('|')}>
            {r.map((c, i) => (
              <TableCell key={head[i]}>{c}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const Preview = ({ file, source }: { file: FileNode; source: boolean }) => {
  const text = file.content ?? '';
  if (source || file.kind === 'ts')
    return <CodeBlock code={text} language={LANG[file.kind ?? 'md']} />;
  if (file.kind === 'md') return <MarkdownRenderer size="sm">{text}</MarkdownRenderer>;
  if (file.kind === 'json')
    return (
      <Card className="py-1">
        <DataTree value={JSON.parse(text)} defaultExpandDepth={2} aria-label={file.name} />
      </Card>
    );
  if (file.kind === 'csv') return <CsvTable text={text} />;
  return (
    <Card className="grid place-items-center p-4">
      <img
        alt={`Preview of ${file.name}`}
        className="max-h-64 w-full max-w-md rounded-md"
        src={`data:image/svg+xml;utf8,${encodeURIComponent(text)}`}
      />
    </Card>
  );
};
