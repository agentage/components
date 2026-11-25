import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SecretInput } from './secret-input';

const STORED = 'sk_live_51HxStoredSecretValue_abcd';

describe('SecretInput', () => {
  it('masks a new value and reveals it only on request', () => {
    const onValueChange = vi.fn();
    render(<SecretInput aria-label="API key" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('API key') as HTMLInputElement;
    expect(input.type).toBe('password');
    expect(input.autocomplete).toBe('off');
    const reveal = screen.getByRole('button', { name: 'Show value' }) as HTMLButtonElement;
    expect(reveal.disabled).toBe(true);
    fireEvent.change(input, { target: { value: 'pasted-token' } });
    expect(onValueChange).toHaveBeenCalledWith('pasted-token');
    fireEvent.click(screen.getByRole('button', { name: 'Show value' }));
    expect(input.type).toBe('text');
  });

  it('shows a stored value as set only and never renders it', () => {
    const { container } = render(<SecretInput aria-label="API key" isSet setHint="abcd" />);
    expect(screen.getByText('Set, ends with ...abcd')).toBeTruthy();
    expect(screen.queryByLabelText('API key')).toBeNull();
    expect(container.innerHTML).not.toContain(STORED.slice(0, 12));
    expect(container.querySelector('input')).toBeNull();
  });

  it('replaces with an empty masked field, cancels back, and closes when a new value is stored', () => {
    const { rerender } = render(<SecretInput aria-label="API key" isSet setHint="abcd" />);
    fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
    const input = screen.getByLabelText('API key') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(input.type).toBe('password');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByText('Set, ends with ...abcd')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
    rerender(<SecretInput aria-label="API key" isSet setHint="wxyz" />);
    expect(screen.getByText('Set, ends with ...wxyz')).toBeTruthy();
  });

  it('reads just Set without a hint', () => {
    render(<SecretInput isSet />);
    expect(screen.getByText('Set')).toBeTruthy();
  });
});

const SECRET = 'sk_secret_123';
const inAttributes = (root: Element): boolean =>
  [root, ...root.querySelectorAll('*')].some((el) =>
    [...el.attributes].some((a) => a.value.includes(SECRET))
  );

describe('SecretInput DOM leak', () => {
  it('keeps a typed draft out of every attribute and out of innerHTML', () => {
    const { container } = render(<SecretInput aria-label="API key" />);
    const input = screen.getByLabelText('API key') as HTMLInputElement;
    fireEvent.change(input, { target: { value: SECRET } });
    expect(input.value).toBe(SECRET);
    expect(input.getAttribute('value')).toBeNull();
    expect(inAttributes(container)).toBe(false);
    expect(container.innerHTML).not.toContain(SECRET);
  });

  it('keeps a controlled draft out of the markup', () => {
    const { container } = render(
      <SecretInput aria-label="API key" value={SECRET} onValueChange={() => {}} />
    );
    expect((screen.getByLabelText('API key') as HTMLInputElement).value).toBe(SECRET);
    expect(container.innerHTML).not.toContain(SECRET);
  });

  it('drops the draft after a save, so Replace and Show never bring it back', () => {
    const { container, rerender } = render(<SecretInput aria-label="API key" />);
    fireEvent.change(screen.getByLabelText('API key'), { target: { value: SECRET } });
    rerender(<SecretInput aria-label="API key" isSet setHint="_123" />);
    expect(container.innerHTML).not.toContain(SECRET);
    fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
    const input = screen.getByLabelText('API key') as HTMLInputElement;
    expect(input.value).toBe('');
    expect((screen.getByRole('button', { name: 'Show value' }) as HTMLButtonElement).disabled).toBe(
      true
    );
    expect(inAttributes(container)).toBe(false);
  });
});

describe('SecretInput controlled save', () => {
  it('clears a controlled draft on save without updating the parent during render', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const Parent = ({ saved }: { saved: boolean }) => {
      const [draft, setDraft] = React.useState('');
      return (
        <SecretInput
          aria-label="API key"
          value={draft}
          onValueChange={setDraft}
          isSet={saved}
          setHint={saved ? '_123' : undefined}
        />
      );
    };
    const { rerender } = render(<Parent saved={false} />);
    fireEvent.change(screen.getByLabelText('API key'), { target: { value: 'sk_' } });
    fireEvent.change(screen.getByLabelText('API key'), { target: { value: SECRET } });
    expect((screen.getByLabelText('API key') as HTMLInputElement).value).toBe(SECRET);
    rerender(<Parent saved />);
    fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
    expect((screen.getByLabelText('API key') as HTMLInputElement).value).toBe('');
    expect(errors).not.toHaveBeenCalled();
    errors.mockRestore();
  });
});
