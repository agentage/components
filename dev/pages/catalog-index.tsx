'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../src';
import { CatalogTable, linkClass } from '../components/catalog-table';
import { Heading } from '../components/heading';
import { Link } from '../lib/router';
import { CATEGORIES, CORE_COMPONENTS, type CategoryEntry } from '../registry';

const SEPARATE = ['review'];
const MAIN = CATEGORIES.filter((c) => !SEPARATE.includes(c.slug));
const pages = (n: number): string => `${String(n)} page${n === 1 ? '' : 's'}`;

const SectionHead = ({ category }: { category: CategoryEntry }) => (
  <>
    <h2 className="m-0 text-sm font-semibold text-foreground">
      <Link to={`/components/${category.slug}`} className={linkClass}>
        {category.label}
      </Link>
    </h2>
    <span className="text-xs text-muted-foreground">{category.description}</span>
  </>
);

const CategorySection = ({ category }: { category: CategoryEntry }) => (
  <section className="space-y-2" data-section={category.label}>
    <div className="flex items-baseline gap-2">
      <SectionHead category={category} />
    </div>
    <CatalogTable
      label={`${category.label} components`}
      rows={category.components.map((component) => ({ category, component }))}
    />
  </section>
);

/** The Components overview: counts, the Core set, one table per category. */
export const CatalogIndex = () => {
  return (
    <div className="space-y-8">
      <Heading
        as="h1"
        description={`${pages(MAIN.reduce((n, c) => n + c.components.length, 0))} in ${String(MAIN.length)} categories, grouped by what they are for. Core lists the ${String(CORE_COMPONENTS.length)} pages most screens are built from; the review pages come last.`}
      >
        Components
      </Heading>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table aria-label="Pages per category">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead sticky={false} className="w-56">
                Category
              </TableHead>
              <TableHead sticky={false} className="w-24">
                Pages
              </TableHead>
              <TableHead sticky={false}>What it covers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CATEGORIES.map((category) => (
              <TableRow key={category.slug}>
                <TableCell className="font-medium">
                  <Link to={`/components/${category.slug}`} className={linkClass}>
                    {category.label}
                  </Link>
                </TableCell>
                <TableCell className="tabular-nums">{category.components.length}</TableCell>
                <TableCell className="py-2 text-muted-foreground">{category.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <section className="space-y-2" data-section="Core">
        <div className="flex items-baseline gap-2">
          <h2 className="m-0 text-sm font-semibold text-foreground">Core</h2>
          <span className="text-xs text-muted-foreground">
            The small set most screens are built from; each page stays in its category.
          </span>
        </div>
        <CatalogTable label="Core components" rows={CORE_COMPONENTS} withCategory />
      </section>
      {CATEGORIES.map((category) => (
        <CategorySection key={category.slug} category={category} />
      ))}
    </div>
  );
};
