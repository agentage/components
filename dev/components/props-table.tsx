import {
  Badge,
  InlineCode,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src';
import { COMPONENT_PROPS, EXPORT_SUBPATH } from '../generated/props';

const REPO = 'https://github.com/agentage/components/tree/master/src/components';

// One line box for every cell, so names, types and descriptions share a baseline.
const CELL = 'h-auto py-2 align-top text-xs leading-5';

/**
 * Generated prop table for one export. Components whose whole surface is
 * inherited HTML attributes have no rows to show, so they link to the source
 * and name the props type instead.
 */
export const PropsTable = ({ name }: { name: string }) => {
  const props = COMPONENT_PROPS[name];
  const subpath = EXPORT_SUBPATH[name];

  if (!props) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{name}</span> takes{' '}
        <InlineCode>{name}Props</InlineCode>, which adds nothing beyond the underlying element's
        attributes.{' '}
        <a
          className="text-primary-emphasis underline underline-offset-2"
          href={`${REPO}${subpath ? subpath.replace('.', '') : ''}.tsx`}
        >
          Read the source
        </a>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell className={`${CELL} whitespace-nowrap font-mono text-foreground`}>
                <span className="flex h-5 items-center gap-2">
                  {prop.name}
                  {prop.required && <Badge variant="warning">required</Badge>}
                </span>
              </TableCell>
              <TableCell className={`${CELL} font-mono text-muted-foreground`}>
                {prop.type}
              </TableCell>
              <TableCell className={`${CELL} font-mono text-muted-foreground`}>
                {prop.defaultValue ?? '-'}
              </TableCell>
              <TableCell className={`${CELL} text-muted-foreground`}>
                {prop.description || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
