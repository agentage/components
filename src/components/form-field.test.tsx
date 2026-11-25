import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FormField } from './form-field';
import { Input } from './input';

describe('FormField', () => {
  it('links the label to the control', () => {
    render(
      <FormField label="Name">
        <Input placeholder="Name" />
      </FormField>
    );
    expect(screen.getByLabelText('Name')).toBe(screen.getByPlaceholderText('Name'));
  });

  it('describes the control with the error and marks it invalid', () => {
    render(
      <FormField label="Email" error="Invalid email">
        <Input placeholder="Email" />
      </FormField>
    );
    const control = screen.getByPlaceholderText('Email');
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(
      document.getElementById(control.getAttribute('aria-describedby') ?? '')?.textContent
    ).toBe('Invalid email');
  });

  it('describes the control with the hint when there is no error', () => {
    render(
      <FormField label="Bio" hint="Max 200 characters">
        <Input placeholder="Bio" />
      </FormField>
    );
    const control = screen.getByPlaceholderText('Bio');
    expect(control.getAttribute('aria-invalid')).toBeNull();
    expect(
      document.getElementById(control.getAttribute('aria-describedby') ?? '')?.textContent
    ).toBe('Max 200 characters');
  });

  it('marks the control required for assistive tech', () => {
    render(
      <FormField label="Name" required>
        <Input placeholder="Name" />
      </FormField>
    );
    expect(screen.getByPlaceholderText('Name').getAttribute('aria-required')).toBe('true');
  });

  it('keeps an explicit id on the control', () => {
    render(
      <FormField label="Role" id="role">
        <Input id="custom" placeholder="Role" />
      </FormField>
    );
    expect(screen.getByPlaceholderText('Role').id).toBe('custom');
  });
});

describe('FormField class strings', () => {
  it('keeps the root class string byte-identical', () => {
    const { container } = render(
      <FormField label="Name" className="mt-4">
        <Input placeholder="Name" />
      </FormField>
    );
    expect((container.querySelector('[data-slot="form-field"]') as HTMLElement).className).toBe(
      'space-y-1.5 mt-4'
    );
  });

  it('spreads unknown props onto the root', () => {
    render(
      <FormField label="Name" data-testid="ff">
        <Input placeholder="Name" />
      </FormField>
    );
    expect(screen.getByTestId('ff').getAttribute('data-slot')).toBe('form-field');
  });

  it('lays out a 150 px label column in row layout and keeps the label bound', () => {
    const { container } = render(
      <FormField label="Name" layout="row" hint="Shown in the list">
        <Input placeholder="Name" />
      </FormField>
    );
    const root = container.querySelector('[data-slot="form-field"]') as HTMLElement;
    expect(root.dataset.layout).toBe('row');
    expect(root.innerHTML).toContain('@[560px]:grid-cols-[150px_minmax(0,1fr)]');
    expect(screen.getByLabelText('Name')).toBe(screen.getByPlaceholderText('Name'));
    expect(screen.getByText('Shown in the list').id).toBeTruthy();
  });
});

describe('FormField preview', () => {
  it('renders the preview under the control and links it to the control', () => {
    render(
      <FormField label="Schedule" hint="Five fields" preview="Every day at 09:00">
        <input />
      </FormField>
    );
    const input = screen.getByLabelText('Schedule');
    const preview = screen.getByText('Every day at 09:00', {
      selector: '[data-slot="form-field-preview"]',
    });
    expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(preview.id);
    expect(screen.getByRole('textbox', { description: 'Five fields Every day at 09:00' })).toBe(
      input
    );
    expect(screen.getAllByText('Every day at 09:00')).toHaveLength(1);
    expect(input.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2);
  });
});

describe('FormField own control id', () => {
  it('labels the control that carries its own id and focuses it on label click', async () => {
    render(
      <FormField label="Title" hint="Short">
        <input id="mine" />
      </FormField>
    );
    const input = screen.getByLabelText('Title');
    expect(input.id).toBe('mine');
    await userEvent.click(screen.getByText('Title'));
    expect(document.activeElement).toBe(input);
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
  });
});

describe('FormField preview live region', () => {
  afterEach(() => vi.useRealTimers());

  const field = (preview?: string) => (
    <FormField label="Schedule" preview={preview}>
      <input />
    </FormField>
  );
  const live = () => document.querySelector('[aria-live="polite"]') as HTMLElement | null;

  it('stays empty on load, then announces only the settled value', () => {
    vi.useFakeTimers();
    const { rerender } = render(field('a'));
    act(() => void vi.advanceTimersByTime(600));
    expect(live()?.textContent).toBe('');
    rerender(field('ab'));
    act(() => void vi.advanceTimersByTime(300));
    rerender(field('abc'));
    act(() => void vi.advanceTimersByTime(300));
    expect(live()?.textContent).toBe('');
    act(() => void vi.advanceTimersByTime(250));
    expect(live()?.textContent).toBe('abc');
  });

  it('keeps the live region while the preview is gone, so the next value is heard', () => {
    vi.useFakeTimers();
    const { rerender } = render(field('a'));
    const region = live();
    rerender(field(undefined));
    act(() => void vi.advanceTimersByTime(600));
    expect(live()).toBe(region);
    expect(region?.textContent).toBe('');
    rerender(field('b'));
    act(() => void vi.advanceTimersByTime(600));
    expect(live()).toBe(region);
    expect(region?.textContent).toBe('b');
  });
});
