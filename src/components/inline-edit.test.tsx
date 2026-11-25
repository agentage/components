import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from './form-field';
import { InlineEdit } from './inline-edit';

const field = (name = 'Name') => screen.getByRole('textbox', { name }) as HTMLInputElement;

const type = (el: HTMLInputElement | HTMLTextAreaElement, value: string): void => {
  fireEvent.focus(el);
  fireEvent.change(el, { target: { value } });
};

describe('InlineEdit', () => {
  it('is a named text input showing the value', () => {
    render(<InlineEdit value="Daily digest" onCommit={vi.fn()} label="Name" />);
    expect(field().value).toBe('Daily digest');
    expect(field().tagName).toBe('INPUT');
  });

  it('commits on Enter, once, only when changed', () => {
    const onCommit = vi.fn();
    render(<InlineEdit value="A" onCommit={onCommit} label="Name" />);
    type(field(), 'B');
    fireEvent.keyDown(field(), { key: 'Enter' });
    fireEvent.blur(field());
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith('B');
  });

  it('reverts on Escape without committing', () => {
    const onCommit = vi.fn();
    render(<InlineEdit value="A" onCommit={onCommit} label="Name" />);
    type(field(), 'B');
    fireEvent.keyDown(field(), { key: 'Escape' });
    fireEvent.blur(field());
    expect(onCommit).not.toHaveBeenCalled();
    expect(field().value).toBe('A');
  });

  it('keeps focus in the field on Enter and Escape', () => {
    const onCommit = vi.fn();
    const onOuterKey = vi.fn();
    render(
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- probe for propagation
      <div onKeyDown={(e) => onOuterKey(e.key)}>
        <InlineEdit value="A" onCommit={onCommit} label="Name" />
      </div>
    );
    field().focus();
    fireEvent.change(field(), { target: { value: 'B' } });
    fireEvent.keyDown(field(), { key: 'Enter' });
    expect(document.activeElement).toBe(field());
    expect(onCommit).toHaveBeenCalledWith('B');
    fireEvent.change(field(), { target: { value: 'C' } });
    fireEvent.keyDown(field(), { key: 'Escape' });
    expect(document.activeElement).toBe(field());
    expect(field().value).toBe('A');
    expect(onOuterKey).not.toHaveBeenCalledWith('Escape');
    fireEvent.blur(field());
    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it('commits on blur and skips an unchanged blur', () => {
    const onCommit = vi.fn();
    render(<InlineEdit value="A" onCommit={onCommit} label="Name" />);
    fireEvent.focus(field());
    fireEvent.blur(field());
    expect(onCommit).not.toHaveBeenCalled();
    type(field(), 'C');
    fireEvent.blur(field());
    expect(onCommit).toHaveBeenCalledWith('C');
  });

  it('uses a textarea when multiline: Enter is a newline, Ctrl+Enter commits', () => {
    const onCommit = vi.fn();
    render(<InlineEdit value="one" onCommit={onCommit} label="Description" multiline />);
    const area = field('Description');
    expect(area.tagName).toBe('TEXTAREA');
    type(area, 'one\ntwo');
    fireEvent.keyDown(area, { key: 'Enter' });
    expect(onCommit).not.toHaveBeenCalled();
    fireEvent.keyDown(area, { key: 'Enter', ctrlKey: true });
    fireEvent.blur(area);
    expect(onCommit).toHaveBeenCalledWith('one\ntwo');
  });

  it('wraps in the heading element and mirrors the text for sizing', () => {
    const { container } = render(
      <InlineEdit value="" placeholder="Untitled" onCommit={vi.fn()} label="Name" as="h1" />
    );
    const heading = container.querySelector('h1') as HTMLElement;
    expect(heading.className).toContain('text-xl');
    const mirror = heading.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(mirror.textContent).toBe('Untitled ');
    expect(field().placeholder).toBe('Untitled');
  });
});

describe('InlineEdit focus and composition', () => {
  it('keeps a newer value that arrives while focused and not edited', () => {
    const onCommit = vi.fn();
    const { rerender } = render(<InlineEdit value="A" onCommit={onCommit} label="Name" />);
    fireEvent.focus(field());
    rerender(<InlineEdit value="B" onCommit={onCommit} label="Name" />);
    expect(field().value).toBe('B');
    fireEvent.blur(field());
    expect(onCommit).not.toHaveBeenCalled();
    expect(field().value).toBe('B');
  });

  it('ignores Enter during IME composition', () => {
    const onCommit = vi.fn();
    render(<InlineEdit value="A" onCommit={onCommit} label="Name" />);
    type(field(), 'B');
    field().focus();
    fireEvent.keyDown(field(), { key: 'Enter', isComposing: true });
    expect(onCommit).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(field());
  });

  it('commits an edit back to the focus-time text when the value changed meanwhile', () => {
    const onCommit = vi.fn();
    const { rerender } = render(<InlineEdit value="A" onCommit={onCommit} label="Name" />);
    fireEvent.focus(field());
    rerender(<InlineEdit value="B" onCommit={onCommit} label="Name" />);
    fireEvent.change(field(), { target: { value: 'A' } });
    fireEvent.blur(field());
    expect(onCommit).toHaveBeenCalledWith('A');
  });

  it('ignores the Enter that ends a Safari composition (keyCode 229)', () => {
    const onCommit = vi.fn();
    render(<InlineEdit value="A" onCommit={onCommit} label="Name" />);
    type(field(), 'B');
    field().focus();
    fireEvent.keyDown(field(), { key: 'Enter', keyCode: 229 });
    expect(document.activeElement).toBe(field());
    expect(onCommit).not.toHaveBeenCalled();
  });
});

describe('InlineEdit in a FormField', () => {
  it('takes the field id and description, and forwards the ref to the field', () => {
    const ref = createRef<HTMLInputElement | HTMLTextAreaElement>();
    render(
      <FormField label="Display name" hint="Shown to others" error="Too short">
        <InlineEdit ref={ref} value="Al" onCommit={vi.fn()} label="Display name" name="n" />
      </FormField>
    );
    const input = screen.getByRole('textbox', { name: 'Display name', description: 'Too short' });
    expect(document.querySelector('label')?.htmlFor).toBe(input.id);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('name')).toBe('n');
    expect(ref.current).toBe(input);
  });
});
