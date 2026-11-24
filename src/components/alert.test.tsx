import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './alert';

describe('Alert', () => {
  it('announces itself as an alert', () => {
    render(<Alert>Disk almost full</Alert>);
    expect(screen.getByRole('alert').textContent).toContain('Disk almost full');
  });

  it('renders no dismiss control without onClose', () => {
    render(<Alert>Disk almost full</Alert>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('labels the dismiss button and gives it a focus ring', () => {
    render(<Alert onClose={vi.fn()}>Disk almost full</Alert>);
    const close = screen.getByRole('button', { name: 'Dismiss' });
    expect(close.className).toContain('focus-ring');
  });

  it('accepts a custom dismiss label', () => {
    render(
      <Alert onClose={vi.fn()} closeLabel="Close warning">
        Disk almost full
      </Alert>
    );
    expect(screen.getByRole('button', { name: 'Close warning' })).not.toBeNull();
  });

  it('dismisses from the keyboard', async () => {
    const onClose = vi.fn();
    render(<Alert onClose={onClose}>Disk almost full</Alert>);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Dismiss' }));
    await userEvent.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Disk almost full</Alert>);
    expect(ref.current?.getAttribute('data-slot')).toBe('alert');
  });
});

describe('Alert primary variant', () => {
  it('renders the title and an actions row, compact by default', () => {
    render(
      <Alert
        variant="primary"
        title="Needs attention"
        actions={<button type="button">Approve</button>}
      >
        Post the release notes?
      </Alert>
    );
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('border-primary/55');
    expect(alert.className).toContain('p-3');
    expect(screen.getByText('Needs attention').className).toContain('text-primary-emphasis');
    expect(screen.getByRole('button', { name: 'Approve' })).toBeTruthy();
  });

  it('keeps the pre-0.21 padding as density comfortable', () => {
    render(<Alert density="comfortable">Note</Alert>);
    expect(screen.getByRole('alert').className).toContain('p-4');
  });
});
