import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select, type SelectOption } from './select';
import { selectTriggerVariants } from './select.variants';
import { datePickerTriggerVariants } from './date-picker';

const options: SelectOption[] = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
];

const optionEls = (): HTMLElement[] => screen.getAllByRole('option');

const setup = (props: { searchable?: boolean; value?: string; opts?: SelectOption[] } = {}) => {
  const onValueChange = vi.fn();
  const { opts = options, ...rest } = props;
  render(<Select options={opts} onValueChange={onValueChange} {...rest} />);
  const trigger = screen.getByRole('combobox', { name: 'Select...' });
  fireEvent.click(trigger);
  return { onValueChange, trigger };
};

describe('Select searchable', () => {
  const input = (): HTMLElement => screen.getByRole('combobox', { name: 'Search...' });

  it('marks the search input as the combobox', () => {
    setup({ searchable: true });
    expect(input().tagName).toBe('INPUT');
    expect(input().getAttribute('aria-expanded')).toBe('true');
    expect(input().getAttribute('aria-autocomplete')).toBe('list');
    expect(input().getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id);
    expect(input().getAttribute('aria-activedescendant')).toBeNull();
  });

  it('points aria-activedescendant at the option the arrows land on', () => {
    setup({ searchable: true });
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(input().getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(input().getAttribute('aria-activedescendant')).toBe(optionEls()[1].id);
    fireEvent.keyDown(input(), { key: 'ArrowUp' });
    expect(input().getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
  });

  it('wraps at both ends and honours Home and End', () => {
    setup({ searchable: true });
    fireEvent.keyDown(input(), { key: 'ArrowUp' });
    expect(input().getAttribute('aria-activedescendant')).toBe(optionEls()[2].id);
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    expect(input().getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
    fireEvent.keyDown(input(), { key: 'End' });
    expect(input().getAttribute('aria-activedescendant')).toBe(optionEls()[2].id);
    fireEvent.keyDown(input(), { key: 'Home' });
    expect(input().getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
  });

  it('selects the active option with Enter, ignores Enter with none active', () => {
    const { onValueChange } = setup({ searchable: true });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('green');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('resets the active option when the filter changes', () => {
    setup({ searchable: true });
    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.change(input(), { target: { value: 'e' } });
    expect(input().getAttribute('aria-activedescendant')).toBeNull();
  });

  it('keeps the listbox to options only and announces the empty message beside it', () => {
    render(
      <Select options={[{ value: 'red', label: 'Red' }]} searchable labels={{ empty: 'Nothing' }} />
    );
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.change(input(), { target: { value: 'zzz' } });
    const list = screen.getByRole('listbox', { hidden: true });
    const message = screen.getByText('Nothing');
    expect(list.contains(message)).toBe(false);
    expect(message.getAttribute('aria-live')).toBe('polite');
  });
});

describe('Select plain list', () => {
  const list = (): HTMLElement => screen.getByRole('listbox');

  it('has no search box and starts with no active option', () => {
    setup();
    expect(screen.queryByRole('combobox', { name: 'Search...' })).toBeNull();
    expect(list().getAttribute('aria-activedescendant')).toBeNull();
  });

  it('takes arrows, Home, End and Enter on the listbox', () => {
    const { onValueChange } = setup();
    fireEvent.keyDown(list(), { key: 'ArrowDown' });
    expect(list().getAttribute('aria-activedescendant')).toBe(optionEls()[0].id);
    fireEvent.keyDown(list(), { key: 'End' });
    expect(list().getAttribute('aria-activedescendant')).toBe(optionEls()[2].id);
    fireEvent.keyDown(list(), { key: 'ArrowUp' });
    fireEvent.keyDown(list(), { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('green');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('jumps to a label by typing its first letters', () => {
    setup();
    fireEvent.keyDown(list(), { key: 'b' });
    expect(list().getAttribute('aria-activedescendant')).toBe(optionEls()[2].id);
  });

  it('starts on the selected option', () => {
    setup({ value: 'green' });
    expect(list().getAttribute('aria-activedescendant')).toBe(optionEls()[1].id);
  });

  it('skips disabled options and does not pick them', () => {
    const opts = [options[0], { ...options[1], disabled: true }, options[2]];
    const { onValueChange } = setup({ opts });
    fireEvent.keyDown(list(), { key: 'ArrowDown' });
    fireEvent.keyDown(list(), { key: 'ArrowDown' });
    expect(list().getAttribute('aria-activedescendant')).toBe(optionEls()[2].id);
    fireEvent.click(optionEls()[1]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('opens from the trigger with ArrowDown', () => {
    render(<Select options={options} aria-label="Colour" />);
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Colour' }), { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('closes on Escape and picks on click', () => {
    const { onValueChange } = setup();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: /Blue/ }));
    expect(onValueChange).toHaveBeenCalledWith('blue');
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Select trigger classes', () => {
  const opts = [{ value: 'a', label: 'A' }];

  it('renders the placeholder trigger as a 30 px field with a focus ring', () => {
    render(<Select options={opts} />);
    const cls = screen.getByRole('combobox').className;
    for (const c of ['h-[30px] px-2.5 text-ui', 'rounded-md', 'focus-ring']) {
      expect(cls).toContain(c);
    }
  });

  it('renders size sm at 26 px with 12 px text', () => {
    render(<Select options={opts} size="sm" />);
    const cls = screen.getByRole('combobox').className;
    expect(cls).toContain('h-[26px]');
    expect(cls).toContain('text-xs');
    expect(cls).not.toContain('h-[30px]');
  });

  it('disables the trigger and keeps the root class string', () => {
    const { container } = render(<Select options={opts} value="a" disabled className="mt-4" />);
    expect((screen.getByRole('combobox') as HTMLButtonElement).disabled).toBe(true);
    expect((container.querySelector('[data-slot="select"]') as HTMLElement).className).toBe(
      'relative flex mt-4'
    );
  });

  it('marks the trigger invalid and swaps the resting border on error', () => {
    render(<Select options={opts} error />);
    const trigger = screen.getByRole('combobox');
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(trigger.className).toContain('border-destructive');
    expect(trigger.className).not.toContain('border-border');
  });

  it('spreads unknown props onto the root', () => {
    render(<Select options={opts} data-testid="sel" />);
    expect(screen.getByTestId('sel').getAttribute('data-slot')).toBe('select');
  });

  it('matches the date picker sizes', () => {
    expect(selectTriggerVariants()).toContain('h-[30px]');
    expect(selectTriggerVariants({ size: 'sm' })).toContain('h-[26px]');
    expect(datePickerTriggerVariants({ size: 'sm' })).toContain('h-[26px]');
  });
});
