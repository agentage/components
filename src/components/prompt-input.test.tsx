import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PromptInput } from './prompt-input';

describe('PromptInput', () => {
  it('sends on Enter, adds a line on Shift+Enter and clears when uncontrolled', async () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} placeholder="Ask" />);
    const box = screen.getByRole('textbox', { name: 'Message' });
    await userEvent.type(box, 'one{Shift>}{Enter}{/Shift}two');
    expect(onSubmit).not.toHaveBeenCalled();
    expect((box as HTMLTextAreaElement).value).toBe('one\ntwo');
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('one\ntwo');
    expect((box as HTMLTextAreaElement).value).toBe('');
  });

  it('keeps Send disabled for blank text and ignores Enter while composing', () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} defaultValue="  " />);
    expect(screen.getByRole('button', { name: 'Send' }).hasAttribute('disabled')).toBe(true);
    const box = screen.getByRole('textbox');
    fireEvent.change(box, { target: { value: 'x' } });
    fireEvent.keyDown(box, { key: 'Enter', isComposing: true });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledWith('x');
  });

  it('turns Send into Stop while running, and Enter does not send', () => {
    const onSubmit = vi.fn();
    const onStop = vi.fn();
    render(
      <PromptInput
        status="running"
        value="draft"
        onSubmit={onSubmit}
        onStop={onStop}
        footer="Working"
      />
    );
    expect(screen.queryByRole('button', { name: 'Send' })).toBeNull();
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
    expect(onStop).toHaveBeenCalledOnce();
    expect(screen.getByText('Working')).toBeTruthy();
  });

  it('reports edits and leaves a controlled value to the owner', () => {
    const onValueChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <PromptInput
        value="hi"
        onValueChange={onValueChange}
        onSubmit={onSubmit}
        label="Prompt"
        attach={<button type="button">Attach</button>}
      />
    );
    const box = screen.getByRole('textbox', { name: 'Prompt' });
    fireEvent.change(box, { target: { value: 'hi!' } });
    expect(onValueChange).toHaveBeenCalledWith('hi!');
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledWith('hi');
    expect((box as HTMLTextAreaElement).value).toBe('hi');
    expect(screen.getByRole('button', { name: 'Attach' })).toBeTruthy();
  });

  it('ignores the Enter that confirms an IME composition (keyCode 229)', () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} defaultValue="にほん" />);
    const box = screen.getByRole('textbox');
    fireEvent.keyDown(box, { key: 'Enter', keyCode: 229 });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(box, { key: 'Enter', keyCode: 13 });
    expect(onSubmit).toHaveBeenCalledWith('にほん');
  });
});
