import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ToggleButton, ToggleGroup, type ToggleOption } from './toggle-group';

const options: ToggleOption<'day' | 'week' | 'month'>[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const setup = (
  props: { value?: 'day' | 'week' | 'month'; columns?: 1 | 2 | 3 | 4 | 5 | 6 } = {}
) => {
  const onChange = vi.fn();
  const { container } = render(
    <ToggleGroup
      aria-label="Range"
      options={options}
      value={props.value ?? 'day'}
      columns={props.columns}
      onChange={onChange}
    />
  );
  return { onChange, group: container.firstElementChild as HTMLElement };
};

const buttons = (): HTMLElement[] => screen.getAllByRole('radio');

describe('ToggleGroup', () => {
  it('keeps a single tab stop on the selected option', () => {
    setup({ value: 'week' });
    expect(buttons().map((b) => b.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
  });

  it('falls back to the first option when the value matches nothing', () => {
    render(<ToggleGroup options={options} value={'none' as 'day'} onChange={vi.fn()} />);
    expect(buttons().map((b) => b.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  });

  it('moves focus and selection with the arrow keys, wrapping at both ends', () => {
    const { onChange } = setup({ value: 'day' });
    const [day, week, month] = buttons();
    day.focus();

    fireEvent.keyDown(day, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('week');
    expect(document.activeElement).toBe(week);

    fireEvent.keyDown(week, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenLastCalledWith('month');

    fireEvent.keyDown(month, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('day');
    fireEvent.keyDown(day, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('month');
  });

  it('jumps to the ends with Home and End', () => {
    const { onChange } = setup({ value: 'week' });
    const [, week] = buttons();
    week.focus();

    fireEvent.keyDown(week, { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith('month');
    fireEvent.keyDown(week, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith('day');
  });

  it('ignores keys that do not navigate', () => {
    const { onChange, group } = setup();
    fireEvent.keyDown(group, { key: 'a' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('derives the column count from the options instead of always using three', () => {
    const { group } = setup();
    expect(group.className).toContain('grid-cols-3');
    expect(group.getAttribute('style')).toBeNull();
  });

  it('honours an explicit columns prop', () => {
    const { group } = setup({ columns: 6 });
    expect(group.className).toContain('grid-cols-6');
  });

  it('falls back to an inline template past the static class map', () => {
    const many = Array.from({ length: 7 }, (_, i) => ({
      value: `v${String(i)}`,
      label: `L${String(i)}`,
    }));
    const { container } = render(<ToggleGroup options={many} value="v0" onChange={vi.fn()} />);
    const group = container.firstElementChild as HTMLElement;
    expect(group.className).not.toContain('grid-cols-');
    expect(group.style.gridTemplateColumns).toBe('repeat(7, minmax(0px, 1fr))');
  });
});

describe('ToggleGroup class strings', () => {
  const two = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ];

  it('renders the default grid with className last', () => {
    render(<ToggleGroup value="a" onChange={() => {}} options={two} className="mt-4" />);
    expect(screen.getByRole('radiogroup').className).toBe('grid gap-1.5 grid-cols-2 mt-4');
  });

  it('falls back to an inline grid template past six columns', () => {
    const many = 'abcdefg'.split('').map((v) => ({ value: v, label: v.toUpperCase() }));
    render(<ToggleGroup value="a" onChange={() => {}} options={many} />);
    const root = screen.getByRole('radiogroup');
    expect(root.className).toBe('grid gap-1.5');
    expect(root.style.gridTemplateColumns).toBe('repeat(7, minmax(0px, 1fr))');
  });

  it('renders 28 px buttons: solid when selected, bordered when not', () => {
    render(<ToggleGroup value="a" onChange={() => {}} options={two} />);
    const buttons = screen.getAllByRole('radio');
    expect(buttons[0].className).toContain('h-7');
    expect(buttons[0].className).toContain('bg-primary text-primary-foreground');
    expect(buttons[1].className).toContain('border border-border');
  });

  it('keeps the standalone vertical button', () => {
    render(
      <ToggleButton selected={false} onClick={() => {}} vertical className="mt-4">
        X
      </ToggleButton>
    );
    const cls = screen.getByRole('radio').className;
    expect(cls).toContain('flex-col gap-1 py-1.5');
    expect(cls.endsWith('mt-4')).toBe(true);
  });

  it('joins the segmented variant, outlines the selected option, and keeps icon-only names', () => {
    render(
      <ToggleGroup
        variant="segmented"
        value="list"
        onChange={() => {}}
        aria-label="View"
        options={[
          { value: 'list', label: 'List', icon: <svg />, iconOnly: true },
          { value: 'grid', label: 'Cards', icon: <svg />, iconOnly: true },
        ]}
      />
    );
    const group = screen.getByRole('radiogroup', { name: 'View' });
    expect(group.className).toContain('inline-flex');
    expect(group.style.gridTemplateColumns).toBe('');
    const list = screen.getByRole('radio', { name: 'List' });
    expect(list.className).toContain('border-primary');
    expect(list.getAttribute('aria-checked')).toBe('true');
    expect(list.textContent).toBe('');
  });

  it('marks the group invalid and outlines the buttons on error', () => {
    render(<ToggleGroup value="a" onChange={() => {}} options={two} error aria-label="View" />);
    expect(screen.getByRole('radiogroup').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getAllByRole('radio')[0].className).toContain('border-destructive');
  });

  it('spreads unknown props onto the group', () => {
    render(<ToggleGroup value="a" onChange={() => {}} options={two} data-testid="tg" />);
    expect(screen.getByTestId('tg')).toBe(screen.getByRole('radiogroup'));
  });
});

describe('ToggleGroup disabled options', () => {
  const opts = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B', disabled: true },
    { value: 'c', label: 'C' },
  ];
  const Harness = ({ initial, options = opts }: { initial: string; options?: typeof opts }) => {
    const [value, setValue] = useState(initial);
    return (
      <ToggleGroup aria-label="Pick" options={options} value={value} onValueChange={setValue} />
    );
  };

  it('steps over a disabled option with the arrows', async () => {
    const user = userEvent.setup();
    render(<Harness initial="a" />);
    screen.getByRole('radio', { name: 'A' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'C' }));
    expect(screen.getByRole('radio', { name: 'C' }).getAttribute('aria-checked')).toBe('true');
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'A' }));
  });

  it('never makes a disabled option the only tab stop', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Before</button>
        <Harness initial="b" />
      </>
    );
    screen.getByRole('button', { name: 'Before' }).focus();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'A' }));
  });
});
