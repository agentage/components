import { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DialogBackdrop, DialogClose, DialogTitleBar, useDialogShell } from './dialog-shell';

const Shell = ({ open, onDismiss }: { open: boolean; onDismiss?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useDialogShell(ref, open, onDismiss);
  return (
    <div ref={ref}>
      <button type="button">Inside</button>
    </div>
  );
};

describe('useDialogShell', () => {
  it('calls onDismiss on Escape while open', () => {
    const onDismiss = vi.fn();
    render(<Shell open onDismiss={onDismiss} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onDismiss).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('ignores Escape while closed and after unmount', () => {
    const onDismiss = vi.fn();
    const { rerender, unmount } = render(<Shell open={false} onDismiss={onDismiss} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    rerender(<Shell open onDismiss={onDismiss} />);
    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('locks body scroll while open and releases it on close', () => {
    const { rerender } = render(<Shell open onDismiss={() => {}} />);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Shell open={false} onDismiss={() => {}} />);
    expect(document.body.style.overflow).toBe('');
  });

  it('works without onDismiss', () => {
    render(<Shell open />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByText('Inside')).toBeTruthy();
  });
});

describe('DialogClose', () => {
  it('is labelled Close by default and takes a custom label', () => {
    const onClick = vi.fn();
    const { rerender } = render(<DialogClose onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<DialogClose label="Dismiss" />);
    expect(screen.getByRole('button', { name: 'Dismiss' }).className).toContain('focus-ring');
  });
});

describe('DialogBackdrop and DialogTitleBar', () => {
  it('forwards backdrop clicks and hides it from assistive technology', () => {
    const onClick = vi.fn();
    const { container } = render(<DialogBackdrop onClick={onClick} />);
    const el = container.querySelector('[data-slot="dialog-backdrop"]') as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders title, description, extra and close slots', () => {
    render(
      <DialogTitleBar
        titleId="t"
        title="Rename"
        descriptionId="d"
        description="Pick a new name"
        extra={<span>extra</span>}
        close={<DialogClose />}
      />
    );
    expect(screen.getByRole('heading', { name: 'Rename' }).id).toBe('t');
    expect(screen.getByText('Pick a new name').id).toBe('d');
    expect(screen.getByText('extra')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  it('omits the title and description elements when absent', () => {
    const { container } = render(<DialogTitleBar titleId="t" descriptionId="d" />);
    expect(container.querySelector('h2')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
  });
});
