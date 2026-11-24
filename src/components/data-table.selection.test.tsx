import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableColumn } from './data-table';

interface Row {
  id: string;
  name: string;
  group: string;
}

const ROWS: Row[] = [
  { id: 'a', name: 'Alpha', group: 'x' },
  { id: 'b', name: 'Bravo', group: 'y' },
  { id: 'c', name: 'Charlie', group: 'x' },
  { id: 'd', name: 'Delta', group: 'y' },
];
const COLUMNS: DataTableColumn<Row>[] = [{ key: 'name', header: 'Name', sortable: true }];

const Multi = ({ onChange }: { onChange?: (k: string[]) => void }) => {
  const [keys, setKeys] = useState<string[]>([]);
  return (
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      rowKey={(r) => r.id}
      rowLabel={(r) => r.name}
      selection="multi"
      selectedKeys={keys}
      onSelectedKeysChange={(k) => {
        setKeys(k);
        onChange?.(k);
      }}
      defaultSort={{ key: 'name', direction: 'desc' }}
    />
  );
};

const box = (name: string) => screen.getByRole('checkbox', { name });

describe('DataTable selection', () => {
  it('multi: toggles a row and marks select all as mixed', () => {
    render(<Multi />);
    fireEvent.click(box('Select Bravo'));
    expect(box('Select Bravo').getAttribute('aria-checked')).toBe('true');
    expect(box('Select all rows').getAttribute('aria-checked')).toBe('mixed');
  });

  it('multi: select all selects every row, a second click clears them', () => {
    const spy = vi.fn();
    render(<Multi onChange={spy} />);
    fireEvent.click(box('Select all rows'));
    expect(spy).toHaveBeenLastCalledWith(['d', 'c', 'b', 'a']);
    expect(box('Select all rows').getAttribute('aria-checked')).toBe('true');
    fireEvent.click(box('Select all rows'));
    expect(spy).toHaveBeenLastCalledWith([]);
  });

  it('multi: Shift-click selects the range in displayed (sorted) order', () => {
    const spy = vi.fn();
    render(<Multi onChange={spy} />);
    fireEvent.click(box('Select Delta'));
    fireEvent.click(box('Select Bravo'), { shiftKey: true });
    expect(spy).toHaveBeenLastCalledWith(['d', 'c', 'b']);
  });

  it('multi: Space on a checkbox toggles it', () => {
    render(<Multi />);
    fireEvent.keyDown(box('Select Alpha'), { key: ' ' });
    expect(box('Select Alpha').getAttribute('aria-checked')).toBe('true');
  });

  it('single: a click makes the row current and calls onRowClick', () => {
    const open = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(r) => r.id}
        selection="single"
        onRowClick={open}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Charlie' }));
    const row = screen.getByRole('button', { name: 'Charlie' }).closest('tr');
    expect(row?.getAttribute('aria-current')).toBe('true');
    expect(open).toHaveBeenCalledWith(ROWS[2]);
    fireEvent.click(screen.getByRole('button', { name: 'Alpha' }));
    expect(row?.getAttribute('aria-current')).toBeNull();
  });

  it('group headers show a glyph and an add button, spanning the select column', () => {
    const add = vi.fn();
    const { container } = render(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(r) => r.id}
        selection="multi"
        groupBy="group"
        groupIcon={(k) => <svg data-testid={`icon-${k}`} />}
        onAddToGroup={add}
      />
    );
    expect(screen.getByTestId('icon-x')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Add to y' }));
    expect(add).toHaveBeenCalledWith('y');
    expect(container.querySelector('th[scope="colgroup"]')?.getAttribute('colspan')).toBe('2');
  });
});
