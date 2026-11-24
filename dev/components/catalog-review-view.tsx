import { Fragment, type ReactNode } from 'react';
import {
  Badge,
  Card,
  Prose,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src';
import { Link } from '../lib/router';
// Read at render time only: the registry imports this module through the review page.
import { CATEGORIES, componentPath } from '../registry';
import { linkClass } from './catalog-table';

export type Effort = 'small' | 'medium' | 'large';
export interface Suggestion {
  item: string;
  rec: string;
  effort: Effort;
  /** Add: the screen that needs it. Remove: what would break. */
  context?: string;
}
export type Note = readonly [item: string, text: string];

const EFFORT_TONE = {
  small: 'outline-muted',
  medium: 'outline-info',
  large: 'outline-warning',
} as const;
const NOT_LISTED = ['review'];
const H3 = 'm-0 flex items-center gap-2 text-ui font-semibold text-foreground';

/** Text with `code` spans, as the release notes write prop names. */
const Rich = ({ text }: { text: string }) => (
  <>
    {text.split('`').map((part, i) =>
      i % 2 ? (
        <code key={i} className="rounded-sm bg-muted px-1 font-mono text-xs text-foreground">
          {part}
        </code>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      )
    )}
  </>
);

const Frame = ({
  label,
  head,
  children,
}: {
  label: string;
  head: string[];
  children: ReactNode;
}) => (
  <div className="overflow-hidden rounded-lg border border-border">
    <Table aria-label={label}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {head.map((h, i) => (
            <TableHead key={h} sticky={false} className={i === 0 ? 'w-52' : undefined}>
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  </div>
);

const Part = ({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) => (
  <section className="space-y-2">
    <h3 className={H3}>
      {title}
      <Badge variant="outline-muted">{count}</Badge>
    </h3>
    {children}
  </section>
);

/** Every component page from the registry, grouped by category, with the Core mark. */
export const CatalogList = () => {
  const groups = CATEGORIES.filter((c) => !NOT_LISTED.includes(c.slug));
  const rows = groups.flatMap((category) => category.components.map((c) => ({ category, c })));
  const count = (slug: string): number =>
    groups.find((g) => g.slug === slug)?.components.length ?? 0;
  const figures = [
    ['Public', rows.length - count('patterns') - count('deprecated')],
    ['Core', rows.filter((r) => r.c.core).length],
    ['Patterns', count('patterns')],
    ['Deprecated', count('deprecated')],
  ] as const;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {figures.map(([label, n]) => (
          <Card key={label} padding="sm">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-lg font-semibold tabular-nums text-foreground">{n}</div>
          </Card>
        ))}
      </div>
      <Prose size="sm" className="text-muted-foreground">
        <p>
          One row per component page, in docs order. Purposes are the registry descriptions, so this
          list cannot drift from the catalog. Core pages also lead the sidebar and the index.
        </p>
      </Prose>
      <Frame label="Component pages" head={['Component', 'Category', 'Purpose', 'Core']}>
        {rows.map(({ category, c }) => (
          <TableRow key={`${category.slug}/${c.slug}`}>
            <TableCell className="font-medium">
              <Link to={componentPath(category.slug, c.slug)} className={linkClass}>
                {c.name}
              </Link>
            </TableCell>
            <TableCell className="w-36 text-muted-foreground">{category.label}</TableCell>
            <TableCell className="py-2 text-muted-foreground">{c.description}</TableCell>
            <TableCell className="w-20">
              {c.core && <Badge variant="outline-primary">Core</Badge>}
            </TableCell>
          </TableRow>
        ))}
      </Frame>
    </div>
  );
};

export interface SuggestionPart {
  label: string;
  /** Header of the context column; the part has none when omitted. */
  context?: string;
  rows: Suggestion[];
}

export const SuggestionsView = ({ parts }: { parts: SuggestionPart[] }) => (
  <div className="space-y-5">
    {parts.map((part) => (
      <Part key={part.label} title={part.label} count={part.rows.length}>
        <Frame
          label={`Suggestions: ${part.label}`}
          head={['Item', 'Recommendation', 'Effort', ...(part.context ? [part.context] : [])]}
        >
          {part.rows.map((row) => (
            <TableRow key={row.item}>
              <TableCell className="font-medium">{row.item}</TableCell>
              <TableCell className="py-2 text-muted-foreground">{row.rec}</TableCell>
              <TableCell className="w-24">
                <Badge variant={EFFORT_TONE[row.effort]}>{row.effort}</Badge>
              </TableCell>
              {part.context && (
                <TableCell className="w-64 py-2 text-muted-foreground">{row.context}</TableCell>
              )}
            </TableRow>
          ))}
        </Frame>
      </Part>
    ))}
  </div>
);

const NoteRows = ({ label, rows, head }: { label: string; rows: Note[]; head: string[] }) => (
  <Frame label={label} head={head}>
    {rows.map(([item, text]) => (
      // One item can carry several notes, so the note text completes the key.
      <TableRow key={`${item}:${text}`}>
        <TableCell className="font-medium">{item}</TableCell>
        <TableCell className="py-2 text-muted-foreground">
          <Rich text={text} />
        </TableCell>
      </TableRow>
    ))}
  </Frame>
);

export const NotesView = ({ groups }: { groups: { label: string; rows: Note[] }[] }) => (
  <div className="space-y-5">
    {groups.map((g) => (
      <Part key={g.label} title={g.label} count={g.rows.length}>
        <NoteRows label={`Release notes: ${g.label}`} rows={g.rows} head={['Item', 'Change']} />
      </Part>
    ))}
  </div>
);

export const LimitsView = ({ rows }: { rows: Note[] }) => (
  <NoteRows label="Known limits" rows={rows} head={['Area', 'Not verified']} />
);
