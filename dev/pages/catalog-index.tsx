'use client';
import { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src';
import { CatalogTable, linkClass } from '../components/catalog-table';
import { Link } from '../lib/router';
import { CATEGORIES, CORE_COMPONENTS, FOLDED, type CategoryEntry } from '../registry';

const SEPARATE = ['deprecated', 'review'];
const MAIN = CATEGORIES.filter((c) => !SEPARATE.includes(c.slug));
const STORAGE_KEY = 'ds-index-open-groups';
const pages = (n: number): string => `${String(n)} page${n === 1 ? '' : 's'}`;

const restore = (): string[] => {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
};

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

/** Charts and Site: domain sets, folded by default; the open state lives for the session. */
const FoldedSection = ({
  category,
  open,
  onToggle,
}: {
  category: CategoryEntry;
  open: boolean;
  onToggle: () => void;
}) => (
  <Collapsible open={open} onOpenChange={onToggle} data-section={category.label}>
    <div className="flex items-center gap-2">
      <h2 className="m-0">
        <CollapsibleTrigger
          count={category.components.length}
          className="-ml-2 w-auto text-sm font-semibold"
        >
          {category.label}
        </CollapsibleTrigger>
      </h2>
      <span className="text-xs text-muted-foreground">{category.description}</span>
      <Link to={`/components/${category.slug}`} className={`ml-auto text-xs ${linkClass}`}>
        Overview
      </Link>
    </div>
    <CollapsibleContent className="pt-2">
      <CatalogTable
        label={`${category.label} components`}
        rows={category.components.map((component) => ({ category, component }))}
      />
    </CollapsibleContent>
  </Collapsible>
);

/** The Components overview: counts, the Core set, one table per category, folded domain sets. */
export const CatalogIndex = () => {
  const [open, setOpen] = useState<string[]>(restore);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(open));
    } catch {
      /* storage blocked: folds still toggle for this page */
    }
  }, [open]);
  const toggle = (slug: string): void => {
    setOpen((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  return (
    <div className="space-y-8">
      <Heading
        as="h1"
        description={`${pages(MAIN.reduce((n, c) => n + c.components.length, 0))} in ${String(MAIN.length)} categories, grouped by what they are for. Core lists the ${String(CORE_COMPONENTS.length)} pages most screens are built from; Charts and Site are folded at the end, then deprecated and review pages.`}
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
      {CATEGORIES.map((category) =>
        FOLDED.includes(category.slug) ? (
          <FoldedSection
            key={category.slug}
            category={category}
            open={open.includes(category.slug)}
            onToggle={() => {
              toggle(category.slug);
            }}
          />
        ) : (
          <CategorySection key={category.slug} category={category} />
        )
      )}
    </div>
  );
};
