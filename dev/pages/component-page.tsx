import { InlineCode } from '../../src';
import { Heading } from '../components/heading';
import { Code } from '../components/code';
import { PatternSources } from '../components/pattern-sources';
import { AppThemeSwitch } from '../components/app-theme-switch';
import { PropsTable } from '../components/props-table';
import { EXPORT_SUBPATH } from '../generated/props';
import { builtFrom } from '../lib/built-from';
import { sectionId } from '../lib/section-id';
import { Link } from '../lib/router';
import { componentPath, type ResolvedComponent } from '../registry';

/** One `import { A, B } from '@agentage/components/<subpath>';` line per subpath. */
const importSnippet = (exports: string[]): string => {
  const bySubpath = new Map<string, string[]>();
  for (const name of exports) {
    const subpath = EXPORT_SUBPATH[name] ?? '.';
    bySubpath.set(subpath, [...(bySubpath.get(subpath) ?? []), name]);
  }
  return [...bySubpath.entries()]
    .map(([subpath, names]) => {
      const from = `from '@agentage/components${subpath.replace(/^\./, '')}';`;
      const oneLine = `import { ${names.join(', ')} } ${from}`;
      // Long lines make the <pre> horizontally scrollable, which axe flags as
      // an unfocusable scroll region; wrap instead.
      return oneLine.length <= 76
        ? oneLine
        : `import {\n${names.map((n) => `  ${n},`).join('\n')}\n} ${from}`;
    })
    .join('\n');
};

const isComponent = (name: string): boolean => /^[A-Z]/.test(name);

const H2 = 'border-b border-border pb-2 text-base font-semibold text-foreground';

export const ComponentPage = ({ category, component }: ResolvedComponent) => (
  <article className="space-y-8">
    <div className="space-y-2">
      <Link
        to={`/components/${category.slug}`}
        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {category.label}
      </Link>
      <Heading as="h1" description={component.description}>
        {component.name}
      </Heading>
      <AppThemeSwitch />
    </div>

    {component.exports.length > 0 && (
      <section className="space-y-3" data-section="Import">
        <h2 className={H2}>Import</h2>
        <Code language="typescript" code={importSnippet(component.exports)} />
        <p className="text-xs text-muted-foreground">
          The barrel <InlineCode>@agentage/components</InlineCode> re-exports everything; the
          subpaths above keep client boundaries and tree-shaking intact.
        </p>
      </section>
    )}

    {component.demos.map((demo, index) => (
      <section
        key={demo.title ?? index}
        id={sectionId(demo.title ?? component.name)}
        className="space-y-4 scroll-mt-4"
        data-section={demo.title ?? component.name}
      >
        <h2 className={H2}>{demo.title ?? 'Example'}</h2>
        <div
          className={
            category.bare
              ? 'space-y-3'
              : 'space-y-4 rounded-lg border border-border bg-background p-4'
          }
          data-slot="demo-surface"
        >
          <demo.Component />
        </div>
      </section>
    ))}

    {component.sources && (
      <>
        <section className="space-y-3" data-section="Built from">
          <h2 className={H2}>Built from</h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-ui">
            {builtFrom(component).map((page) => (
              <li key={`${page.category.slug}/${page.component.slug}`}>
                <Link
                  to={componentPath(page.category.slug, page.component.slug)}
                  className="rounded-md text-foreground underline-offset-4 hover:text-primary-emphasis underline decoration-border hover:decoration-current focus-ring"
                >
                  {page.component.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="space-y-3" data-section="Source">
          <h2 className={H2}>Source</h2>
          <PatternSources files={component.sources} />
        </section>
      </>
    )}

    {component.exports.length > 0 && (
      <section className="space-y-4" data-section="Props">
        <h2 className={H2}>Props</h2>
        {/* Hooks have no props type; their demo and import line document them. */}
        {component.exports.filter(isComponent).map((name) => (
          <div key={name} className="space-y-2">
            <h3 className="font-mono text-sm font-medium text-foreground">{name}</h3>
            <PropsTable name={name} />
          </div>
        ))}
      </section>
    )}
  </article>
);
