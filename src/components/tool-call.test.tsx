import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToolCall } from './tool-call';
import { ToolGroup } from './tool-group';

describe('ToolCall', () => {
  it('dims the server prefix and opens the highlighted input and output', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <ToolCall
        name="repos.list_pulls"
        summary="merged since v14.0.0"
        status="succeeded"
        duration="1.7 s"
        input={{ repo: 'agentage/platform', n: 3 }}
        output="[]"
        onOpenChange={onOpenChange}
      />
    );
    const row = screen.getByRole('button', { name: /repos\.list_pulls/ });
    expect(screen.getByText('repos.').className).toContain('text-muted-foreground');
    expect(row.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(row);
    expect(row.getAttribute('aria-expanded')).toBe('true');
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('Input')).toBeTruthy();
    expect(screen.getByText('Output')).toBeTruthy();
    expect(container.querySelector('.hljs-number')?.textContent).toBe('3');
    expect(screen.getByRole('img', { name: 'Succeeded' })).toBeTruthy();
  });

  it('shows a failed call with its error in the danger tone', () => {
    render(
      <ToolCall
        name="repos.get_pull"
        summary="Not found"
        status="failed"
        output="404"
        defaultOpen
      />
    );
    expect(screen.getByText('Not found').className).toContain('text-destructive');
    expect(screen.getByText('Error')).toBeTruthy();
    expect(screen.getByText('404').className).toContain('text-destructive');
  });

  it('is a plain row without a body, and renders children under the payloads', () => {
    const { rerender } = render(<ToolCall name="plain" status="running" />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('img', { name: 'Running' })).toBeTruthy();
    rerender(
      <ToolCall name="chat.post" status="waiting" open>
        <p>approve</p>
      </ToolCall>
    );
    expect(screen.getByText('approve')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Waiting for approval' })).toBeTruthy();
  });
});

describe('ToolGroup', () => {
  const calls = [
    <ToolCall key="a" name="memory.search" status="succeeded" />,
    <ToolCall key="b" name="repos.compare" status="running" />,
  ];

  it('counts steps while running and names the current call', () => {
    render(
      <ToolGroup status="running" total={3}>
        {calls}
      </ToolGroup>
    );
    expect(screen.getByText('Step 2 of 3')).toBeTruthy();
    expect(screen.getAllByText('compare')).toHaveLength(1);
  });

  it('reads Completed N steps when done and Stopped at step N on failure', () => {
    const { rerender, container } = render(<ToolGroup status="succeeded">{calls}</ToolGroup>);
    expect(screen.getByText('Completed 2 steps')).toBeTruthy();
    rerender(<ToolGroup status="failed">{calls}</ToolGroup>);
    expect(screen.getByText('Stopped at step 2')).toBeTruthy();
    rerender(<ToolGroup status="succeeded">{calls[0]}</ToolGroup>);
    expect(screen.getByText('Completed 1 step')).toBeTruthy();
    expect(container.querySelector('[data-slot="tool-call"]')?.className).not.toContain('border');
  });

  it('opens its list of calls and takes a custom label', () => {
    render(
      <ToolGroup status="succeeded" label="Read the repo">
        {calls}
      </ToolGroup>
    );
    const row = screen.getByRole('button', { name: /Read the repo/ });
    fireEvent.click(row);
    expect(row.getAttribute('aria-expanded')).toBe('true');
  });
});
