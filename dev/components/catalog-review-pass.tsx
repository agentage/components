import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../src';
import { COMPONENT_PROPS } from '../generated/props';
import { PASS_PROPS } from '../demos/catalog-review.pass';
import { CATEGORIES } from '../registry';

/** Component pages per category before this pass (0.21 draft), by today's category. */
const BEFORE: [string, number, string][] = [
  ['Foundations', 14, 'Heading, Separator, Label and PriorityGlyph pages folded or removed'],
  ['Forms', 13, 'Combobox merged into Select, Slider removed'],
  ['Navigation', 7, ''],
  [
    'Lists and data',
    6,
    'DataTable internal, GroupHeader on the List page, LogView and DataTree moved in',
  ],
  [
    'Display',
    16,
    'Data display and Disclosure merged; EntityCard folded into Card, CheckList on the StepList page',
  ],
  [
    'Overlays',
    13,
    'Modal, AlertDialog and ConfirmByTyping are Dialog; InspectorPanel is Sheet; HoverCard, ContextMenu, ScrollArea, Overlay portals removed',
  ],
  ['Feedback', 7, 'DangerZone and ConfirmByTyping are Dialog compositions, QuotaBanner removed'],
  ['Charts', 8, 'removed: 7 chart cards; Sparkline is on Display'],
  ['Site', 5, 'removed: docs chrome; CopyButton is on Foundations'],
  ['Deprecated', 5, 'removed'],
];

const own = (name: string) =>
  (COMPONENT_PROPS[name] ?? []).filter(
    (p) => !['className', 'style', 'id'].includes(p.name) && !p.name.startsWith('aria-')
  ).length;

const H = 'm-0 text-ui font-semibold text-foreground';

/** Before and after figures of the simplification pass: pages per category and the largest props. */
export const PassView = () => {
  const after = new Map(CATEGORIES.map((c) => [c.label, c.components.length]));
  const props = Object.keys(COMPONENT_PROPS).reduce((n, k) => n + own(k), 0);
  return (
    <div className="space-y-5">
      <p className="m-0 text-ui text-muted-foreground">
        Documented exports with props: 154 before, {Object.keys(COMPONENT_PROPS).length} now. Own
        props over all of them: 858 before, {props} now (className, style, id and aria-* left out).
        Component pages: 94 in 11 categories before,{' '}
        {[...after]
          .filter(([l]) => !['Patterns', 'Review'].includes(l))
          .reduce((n, [, v]) => n + v, 0)}{' '}
        in 7 categories plus Patterns now.
      </p>
      <h3 className={H}>Pages per category</h3>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table aria-label="Pages per category before and after">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead sticky={false} className="w-40">
                Category
              </TableHead>
              <TableHead sticky={false} className="w-20 text-right">
                Before
              </TableHead>
              <TableHead sticky={false} className="w-20 text-right">
                After
              </TableHead>
              <TableHead sticky={false}>What moved</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {BEFORE.map(([label, n, note]) => (
              <TableRow key={label}>
                <TableCell className="font-medium">{label}</TableCell>
                <TableCell className="text-right tabular-nums">{n}</TableCell>
                <TableCell className="text-right tabular-nums">{after.get(label) ?? 0}</TableCell>
                <TableCell className="py-2 text-muted-foreground">{note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <h3 className={H}>Props of the 25 largest components</h3>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table aria-label="Props of the 25 largest components before and after">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead sticky={false} className="w-44">
                Component
              </TableHead>
              <TableHead sticky={false} className="w-20 text-right">
                Before
              </TableHead>
              <TableHead sticky={false}>After</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PASS_PROPS.map(([name, before, now]) => (
              <TableRow key={name}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell className="text-right tabular-nums">{before}</TableCell>
                <TableCell className="text-muted-foreground">{now}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
