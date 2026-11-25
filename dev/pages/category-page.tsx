import { List, ListRow } from '../../src';
import { Heading } from '../components/heading';
import { builtFrom } from '../lib/built-from';
import { componentPath, type CategoryEntry, type ComponentEntry } from '../registry';

const metaOf = (component: ComponentEntry): string => {
  const n = component.sources ? builtFrom(component).length : component.exports.length;
  const unit = component.sources ? 'component' : 'export';
  return `${String(n)} ${unit}${n === 1 ? '' : 's'}`;
};

export const CategoryPage = ({ category }: { category: CategoryEntry }) => (
  <div className="space-y-6">
    <Heading as="h1" description={category.description}>
      {category.label}
    </Heading>
    <List>
      {category.components.map((component) => (
        <ListRow
          key={component.slug}
          href={componentPath(category.slug, component.slug)}
          title={component.name}
          description={component.description}
          meta={metaOf(component)}
        />
      ))}
    </List>
  </div>
);
