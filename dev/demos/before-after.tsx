'use client';
import { Badge } from '../../src';
import { ROWS, type BeforeAfterRow } from '../before-after/rows';
import MEASURES from '../before-after/measures.json';
import { Link } from '../lib/router';
// Read at render time only: the registry imports this module, so never touch it at load.
import { ALL_COMPONENTS, componentPath } from '../registry';

interface Box {
  h: number;
  fs: string;
}
type Side = Record<string, Record<string, Box | 'missing'>>;
const DATA = MEASURES as { before: Side; after: Side };

const SCALE = [
  ['Text', '13 px controls, rows, menus, nav; 12 px meta; 12 px caps for small labels'],
  ['Heights', 'toolbar 28, input 30 (sm 26), nav row 28, list row 36, two-line row 52, header 32'],
  ['Radius', '6 px rows, items, inputs; 8 px cards, menus, buttons'],
  ['Gaps', '6, 8, 10 px; paddings 10 to 16 px'],
  ['Surfaces', 'hover is a solid accent; no shadow on in-page cards; popovers keep one on dark'],
] as const;

const px = (v: string): string => v.replace('px', '');

const Numbers = ({ route }: { route: string }) => {
  const before = DATA.before[route] ?? {};
  const after = DATA.after[route] ?? {};
  const labels = Object.keys(after).filter((l) => typeof before[l] === 'object');
  if (!labels.length) return null;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground tabular-nums">
      {labels.map((l) => {
        const b = before[l] as Box;
        const a = after[l] as Box;
        if (typeof a !== 'object') return null;
        return (
          <li key={l}>
            {l}: {b.h} to <span className="text-foreground">{a.h} px</span>
            {b.fs !== a.fs && (
              <>
                , text {px(b.fs)} to <span className="text-foreground">{px(a.fs)} px</span>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const Row = ({ row }: { row: BeforeAfterRow }) => {
  const [category, slug] = row.route.split('/');
  const entry = ALL_COMPONENTS.find(
    (c) => c.category.slug === category && c.component.slug === slug
  );
  if (!entry) return null;
  const Live = entry.component.demos[0].Component;
  return (
    <section className="space-y-2 border-b border-border pb-6" data-row={row.route}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Link
          to={componentPath(category, slug)}
          className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
        >
          {entry.component.name}
        </Link>
        <span className="text-xs text-muted-foreground">{entry.category.label}</span>
        {row.status === 'needs-a' && <Badge variant="warning">needs builder A</Badge>}
      </div>
      <p className="text-ui text-foreground">{row.change}</p>
      {(row.props ?? row.old) && (
        <p className="text-xs text-muted-foreground">
          {row.props && <>New props: {row.props}. </>}
          {row.old && <>Old look: {row.old}.</>}
        </p>
      )}
      <Numbers route={row.route} />
      <div className="space-y-3">
        <figure className="min-w-0 space-y-1">
          <figcaption className="text-xs font-medium text-muted-foreground">Before</figcaption>
          <div className="overflow-hidden rounded-md border border-border bg-background">
            <img
              src={`/before/${row.shot ?? slug}.png`}
              alt={`${entry.component.name} before the density pass`}
              className="block h-auto max-w-full"
              loading="lazy"
            />
          </div>
        </figure>
        <figure className="min-w-0 space-y-1">
          <figcaption className="text-xs font-medium text-muted-foreground">
            After (live)
          </figcaption>
          <div className="overflow-hidden rounded-md border border-border bg-background p-2">
            <div className="space-y-3">
              <Live />
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
};

export const Example = () => {
  const changed = ROWS.filter((r) => r.status !== 'unchanged');
  const count = (s: BeforeAfterRow['status']): number => ROWS.filter((r) => r.status === s).length;
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-ui text-muted-foreground">
          {count('changed')} components changed, {count('needs-a')} need a file builder A owns,{' '}
          {count('unchanged')} unchanged. Before is a screenshot of the previous release in the dark
          theme with the App theme off; After is the live demo at its real size, so compare in the
          same theme. Overlays are open in Before; open them in After with their trigger.
        </p>
        <table className="w-full text-ui">
          <tbody>
            {SCALE.map(([k, v]) => (
              <tr key={k} className="border-b border-border">
                <th
                  scope="row"
                  className="h-8 w-28 pr-3 text-left text-xs font-normal text-muted-foreground"
                >
                  {k}
                </th>
                <td className="h-8">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {changed.map((row) => (
        <Row key={row.route} row={row} />
      ))}
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">Unchanged</h2>
        <ul className="text-ui text-muted-foreground">
          {ROWS.filter((r) => r.status === 'unchanged').map((r) => (
            <li key={r.route}>
              {r.route}: {r.change}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
