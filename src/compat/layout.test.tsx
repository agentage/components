import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Badge,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../index';
import { failOnConsole } from './quiet';

failOnConsole();

describe('0.20.2 Table', () => {
  it('renders header and body cells with the table roles', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">r1</TableCell>
            <TableCell>
              <Badge variant="success">done</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: 'r1' })).toBeTruthy();
    expect(screen.getByText('done')).toBeTruthy();
  });
});

describe('0.20.2 Resizable', () => {
  it('renders a handle with separator semantics and moves it by keyboard', () => {
    render(
      <ResizablePanelGroup storageKey="compat-split" className="h-64">
        <ResizablePanel defaultSize={32} minSize={18} maxSize={60}>
          Left
        </ResizablePanel>
        <ResizableHandle withGrip />
        <ResizablePanel minSize={30}>Right</ResizablePanel>
      </ResizablePanelGroup>
    );
    const handle = screen.getByRole('separator');
    const before = Number(handle.getAttribute('aria-valuenow'));
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(Number(handle.getAttribute('aria-valuenow'))).toBeGreaterThan(before);
    expect(screen.getByText('Left')).toBeTruthy();
  });

  it('supports the vertical direction', () => {
    render(
      <ResizablePanelGroup direction="vertical" className="h-64">
        <ResizablePanel defaultSize={60} minSize={25}>
          Top
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={20}>Bottom</ResizablePanel>
      </ResizablePanelGroup>
    );
    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('horizontal');
  });
});
