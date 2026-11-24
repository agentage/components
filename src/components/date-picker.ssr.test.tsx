import { act, fireEvent, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DatePicker } from './date-picker';
import { PropertyDate } from './property-date';

const day = new Date(2026, 10, 22);

const hosts: (() => void)[] = [];
afterEach(() => hosts.splice(0).forEach((f) => f()));

const hydrates = async (ui: React.ReactElement): Promise<HTMLElement> => {
  const host = document.createElement('div');
  host.innerHTML = renderToString(ui);
  document.body.appendChild(host);
  const onRecoverableError = vi.fn();
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(host, ui, { onRecoverableError });
  });
  hosts.push(() => {
    act(() => root?.unmount());
    host.remove();
  });
  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(errors).not.toHaveBeenCalled();
  errors.mockRestore();
  return host;
};

describe('date text on the server', () => {
  it('hydrates a single date without a mismatch and then shows the locale text', async () => {
    const host = await hydrates(<DatePicker value={day} onValueChange={() => {}} />);
    expect(host.textContent).toContain(day.toLocaleDateString(undefined, { month: 'short' }));
  });

  it('hydrates a custom range without a mismatch', async () => {
    const range = { from: day, to: new Date(2026, 10, 23) };
    await hydrates(<DatePicker mode="range" value={range} />);
  });

  it('hydrates a property date without a mismatch', async () => {
    await hydrates(<PropertyDate value={day} onValueChange={() => {}} />);
  });

  it('puts the local day in the native field, not the UTC one', () => {
    const { container } = render(<DatePicker value={day} />);
    expect((container.querySelector('input[type="date"]') as HTMLInputElement).value).toBe(
      '2026-11-22'
    );
  });
});

describe('DateRangePicker custom range', () => {
  it('says why Apply did nothing when To is before From', () => {
    render(<DatePicker mode="range" />);
    fireEvent.click(screen.getByRole('button', { name: /Date range/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-11-05' } });
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2026-11-01' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByRole('alert').textContent).toBe('From must be before To.');
  });

  it('accepts typed expressions like now - 6h and last 24 hours', () => {
    const onValueChange = vi.fn();
    render(<DatePicker mode="range" onValueChange={onValueChange} />);
    for (const [typed, label] of [
      ['now - 6h', 'Last 6 hours'],
      ['last 24 hours', 'Last 24 hours'],
    ]) {
      fireEvent.click(screen.getByRole('button', { name: /Date range/ }));
      const field = screen.getByLabelText('Type a range');
      fireEvent.change(field, { target: { value: typed } });
      fireEvent.keyDown(field, { key: 'Enter' });
      expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ label }));
    }
  });
});

describe('PropertyDate typed day', () => {
  const today = new Date(2026, 10, 22);
  const open = () => fireEvent.click(screen.getByRole('button'));

  it('saves a typed day when an outside press closes the popover', () => {
    const onValueChange = vi.fn();
    render(<PropertyDate value={null} today={today} onValueChange={onValueChange} />);
    open();
    fireEvent.change(screen.getByLabelText('Date, pick a day'), {
      target: { value: '2026-12-01' },
    });
    fireEvent.mouseDown(document.body);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].getDate()).toBe(1);
  });

  it('picks the preset, not the typed day, when focus moves to a preset', () => {
    const onValueChange = vi.fn();
    render(<PropertyDate value={null} today={today} onValueChange={onValueChange} />);
    open();
    const field = screen.getByLabelText('Date, pick a day');
    fireEvent.change(field, { target: { value: '2026-12-01' } });
    const tomorrow = screen.getByRole('button', { name: /Tomorrow/ });
    fireEvent.blur(field, { relatedTarget: tomorrow });
    fireEvent.click(tomorrow);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].getDate()).toBe(23);
  });
});

describe('date text before mount', () => {
  it('keeps locale text out of the server HTML', () => {
    const html = renderToString(<DatePicker value={day} onValueChange={() => {}} />);
    const host = document.createElement('div');
    host.innerHTML = html;
    // The stand-in text is hidden until mount, so a server locale or zone never shows.
    expect(host.querySelector('button span')?.className).toContain('invisible');
  });
});
