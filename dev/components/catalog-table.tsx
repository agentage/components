import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../src';
import { builtFrom } from '../lib/built-from';
import { Link } from '../lib/router';
import { componentPath, type CategoryEntry, type ComponentEntry } from '../registry';

export const linkClass =
  'rounded-md text-foreground transition-colors duration-fast hover:text-primary-emphasis focus-ring';

/** Shared parts for a component, the library components a pattern is built from, or a dash. */
const BuiltFrom = ({ component }: { component: ComponentEntry }) => {
  const items = component.sources
    ? builtFrom(component).map((p) => ({
        key: `${p.category.slug}/${p.component.slug}`,
        to: componentPath(p.category.slug, p.component.slug),
        label: p.component.name,
      }))
    : (component.parts ?? []).map((name) => ({ key: name, to: '', label: name }));
  if (!items.length) return <>-</>;
  return (
    <>
      {items.map((item, i) => (
        <span key={item.key}>
          {i > 0 && ', '}
          {item.to ? (
            <Link to={item.to} className={linkClass}>
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </span>
      ))}
    </>
  );
};

export interface CatalogRow {
  category: CategoryEntry;
  component: ComponentEntry;
}

/** One table of component pages; `withCategory` swaps "Built from" for the category column. */
export const CatalogTable = ({
  label,
  rows,
  withCategory = false,
}: {
  label: string;
  rows: CatalogRow[];
  withCategory?: boolean;
}) => (
  <div className="overflow-hidden rounded-lg border border-border">
    <Table aria-label={label}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead sticky={false} className="w-56">
            Component
          </TableHead>
          <TableHead sticky={false}>Purpose</TableHead>
          <TableHead sticky={false} className={withCategory ? 'w-40' : 'w-72'}>
            {withCategory ? 'Category' : 'Built from'}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ category, component }) => (
          <TableRow key={`${category.slug}/${component.slug}`}>
            <TableCell className="font-medium">
              <span className="inline-flex items-center gap-2">
                <Link to={componentPath(category.slug, component.slug)} className={linkClass}>
                  {component.name}
                </Link>
                {component.core && !withCategory && <Badge variant="outline-primary">Core</Badge>}
              </span>
            </TableCell>
            <TableCell className="py-2 text-muted-foreground">{component.description}</TableCell>
            <TableCell className="py-2 text-xs text-muted-foreground">
              {withCategory ? category.label : <BuiltFrom component={component} />}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
