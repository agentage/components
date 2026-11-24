'use client';
import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src';
import { Block } from '../components/demo';

const ROWS = [
  {
    id: 'f-101',
    name: 'Quarterly report',
    owner: 'Ada Lovelace',
    state: 'Done',
    tone: 'success',
    size: '2.4 MB',
  },
  {
    id: 'f-102',
    name: 'Budget draft',
    owner: 'Grace Hopper',
    state: 'In progress',
    tone: 'info',
    size: '640 KB',
  },
  {
    id: 'f-103',
    name: 'Server inventory',
    owner: 'Alan Turing',
    state: 'Failed',
    tone: 'destructive',
    size: '88 KB',
  },
  {
    id: 'f-104',
    name: 'Team handbook',
    owner: 'Ada Lovelace',
    state: 'Pending',
    tone: 'muted',
    size: '1.1 MB',
  },
] as const;

const Rows = ({ selected }: { selected?: string }) => (
  <TableBody>
    {ROWS.map((r) => (
      <TableRow key={r.id} data-state={r.id === selected ? 'selected' : undefined}>
        <TableCell className="font-medium">{r.name}</TableCell>
        <TableCell className="text-muted-foreground">{r.owner}</TableCell>
        <TableCell>
          <Badge variant={`outline-${r.tone}`}>{r.state}</Badge>
        </TableCell>
        <TableCell className="text-right text-muted-foreground">{r.size}</TableCell>
      </TableRow>
    ))}
  </TableBody>
);

const Head = () => (
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Owner</TableHead>
      <TableHead>State</TableHead>
      <TableHead className="text-right">Size</TableHead>
    </TableRow>
  </TableHeader>
);

export const Example = () => (
  <Block caption="The dense look: a 32 px header and 36 px rows.">
    <Table>
      <Head />
      <Rows />
    </Table>
  </Block>
);

export const States = () => (
  <div className="space-y-5">
    <Block caption="A selected row uses data-state=selected.">
      <Table>
        <Head />
        <Rows selected="f-101" />
      </Table>
    </Block>
    <Block caption="Header cells stick to the top of a scroller by default; sticky={false} turns it off for a table inside a card.">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sticky={false}>Name</TableHead>
            <TableHead sticky={false}>Owner</TableHead>
            <TableHead sticky={false}>State</TableHead>
            <TableHead sticky={false} className="text-right">
              Size
            </TableHead>
          </TableRow>
        </TableHeader>
        <Rows />
      </Table>
    </Block>
  </div>
);

export const Composition = () => (
  <Block caption="TableCaption describes the table for screen readers.">
    <Table>
      <TableCaption>Files shared with the team.</TableCaption>
      <Head />
      <Rows />
    </Table>
  </Block>
);
