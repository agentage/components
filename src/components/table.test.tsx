import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

const setup = (props: { sticky?: boolean } = {}) =>
  render(
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead {...props}>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

describe('Table', () => {
  it('scopes header cells to their column', () => {
    setup();
    expect(screen.getByRole('columnheader', { name: 'Name' }).getAttribute('scope')).toBe('col');
  });

  it('lets the caller override scope', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableHead scope="row">Row</TableHead>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole('rowheader', { name: 'Row' }).getAttribute('scope')).toBe('row');
  });

  it('keeps the sticky header by default and drops it on request', () => {
    const { unmount } = setup();
    expect(screen.getByRole('columnheader', { name: 'Name' }).className).toContain('sticky');
    unmount();

    setup({ sticky: false });
    const head = screen.getByRole('columnheader', { name: 'Name' });
    expect(head.className).not.toContain('sticky');
    expect(head.className).not.toContain('top-0');
    expect(head.className).toContain('bg-background');
  });
});

describe('tableHeadVariants', () => {
  const DENSE = ['h-8', 'px-3', 'text-xs', 'font-normal', 'text-muted-foreground'];

  it('renders the dense head, pinned unless sticky is off', () => {
    const { unmount } = setup();
    const pinned = screen.getByRole('columnheader').className;
    for (const c of ['sticky', 'top-0', 'z-10', ...DENSE]) expect(pinned).toContain(c);
    unmount();

    setup({ sticky: false });
    const loose = screen.getByRole('columnheader').className;
    for (const c of DENSE) expect(loose).toContain(c);
    expect(loose).not.toContain('sticky');
  });

  it('merges className last', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableHead className="w-10">N</TableHead>
          </tr>
        </tbody>
      </table>
    );
    const cls = screen.getByRole('columnheader').className;
    expect(cls).toContain('sticky');
    expect(cls.endsWith('w-10')).toBe(true);
  });
});
