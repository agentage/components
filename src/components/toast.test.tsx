import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from './toast';

const Trigger = (): React.JSX.Element => {
  const { toast } = useToast();
  return (
    <>
      <button type="button" onClick={() => toast({ title: 'Export started' })}>
        Notify
      </button>
      <button
        type="button"
        onClick={() => toast({ title: 'Export failed', variant: 'destructive' })}
      >
        Fail
      </button>
    </>
  );
};

const setup = (): { container: HTMLElement } => {
  const { container } = render(
    <div style={{ overflow: 'hidden' }}>
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    </div>
  );
  return { container };
};

const containerRegion = (): HTMLElement =>
  document.body.querySelector<HTMLElement>('[data-slot="toast-status"]') as HTMLElement;

describe('ToastProvider', () => {
  it('portals a polite live region to document.body', () => {
    const { container } = setup();
    expect(container.querySelector('[data-slot="toast-container"]')).toBeNull();
    expect(document.body.querySelector('[data-slot="toast-container"]')?.parentElement).toBe(
      document.body
    );

    const region = containerRegion();
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
  });

  it('announces destructive toasts assertively', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(
      screen.getByText('Export started').closest('[data-slot="toast"]')?.getAttribute('role')
    ).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Fail' }));
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Export failed');
    expect(alert.getAttribute('data-slot')).toBe('toast');
    // Not nested: each toast sits in exactly one live region.
    expect(alert.closest('[role="status"]')).toBeNull();
    expect(screen.getByRole('status').textContent).not.toContain('Export failed');
    expect(screen.getByRole('alert').textContent).not.toContain('Export started');
  });

  it('labels the dismiss button and removes the toast', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));

    const dismiss = screen.getByRole('button', { name: 'Dismiss Export started' });
    expect(dismiss.className).toContain('focus-ring');

    fireEvent.click(dismiss);
    expect(screen.queryByText('Export started')).toBeNull();
  });
});

describe('Toast timing', () => {
  const Timed = ({ duration }: { duration?: number }): React.JSX.Element => {
    const { toast } = useToast();
    return (
      <button type="button" onClick={() => toast({ title: 'Saved', duration })}>
        Go
      </button>
    );
  };
  const open = (duration?: number) => {
    render(
      <ToastProvider>
        <Timed duration={duration} />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
  };
  const tick = (ms: number) =>
    act(() => {
      vi.advanceTimersByTime(ms);
    });

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('dismisses after the duration', () => {
    open(1000);
    tick(999);
    expect(screen.queryByText('Saved')).not.toBeNull();
    tick(2);
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('pauses on hover and resumes with the remaining time', () => {
    open(3000);
    const el = screen.getByText('Saved').closest('[data-slot="toast"]') as HTMLElement;
    tick(1000);
    fireEvent.pointerEnter(el);
    tick(5000);
    expect(screen.queryByText('Saved')).not.toBeNull();
    fireEvent.pointerLeave(el);
    tick(1950);
    expect(screen.queryByText('Saved')).not.toBeNull();
    tick(100);
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('pauses while a control inside has focus', () => {
    open(1000);
    const dismiss = screen.getByRole('button', { name: 'Dismiss Saved' });
    fireEvent.focus(dismiss);
    tick(5000);
    expect(screen.queryByText('Saved')).not.toBeNull();
    fireEvent.blur(dismiss);
    tick(1001);
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('still dismisses when released after the time ran out under the pointer', () => {
    open(1000);
    const el = screen.getByText('Saved').closest('[data-slot="toast"]') as HTMLElement;
    tick(999);
    fireEvent.pointerEnter(el);
    tick(5);
    fireEvent.pointerLeave(el);
    tick(900);
    expect(screen.queryByText('Saved')).not.toBeNull();
    tick(200);
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it.each([Infinity, 0, -1, NaN])('keeps a toast with duration %s until dismissed', (d) => {
    open(d);
    tick(60000);
    expect(screen.queryByText('Saved')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss Saved' }));
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('clears timers on unmount', () => {
    open(1000);
    cleanup();
    expect(vi.getTimerCount()).toBe(0);
  });
});
