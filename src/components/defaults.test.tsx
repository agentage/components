import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';
import { Select } from './select';
import { DescriptionList } from './description-list';
import { Switch } from './switch';
import { ToggleGroup } from './toggle-group';
import { TreeSelect } from './tree-select';

describe('uncontrolled defaults and new props', () => {
  it('Checkbox and Switch start from defaultChecked and toggle themselves', () => {
    const onCheckedChange = vi.fn();
    render(
      <>
        <Checkbox aria-label="Box" defaultChecked onCheckedChange={onCheckedChange} />
        <Switch aria-label="Toggle" defaultChecked={false} />
      </>
    );
    const box = screen.getByRole('checkbox', { name: 'Box' });
    expect(box.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(box);
    expect(box.getAttribute('aria-checked')).toBe('false');
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    const sw = screen.getByRole('switch', { name: 'Toggle' });
    fireEvent.click(sw);
    expect(sw.getAttribute('aria-checked')).toBe('true');
  });

  it('Select shows its defaultValue', () => {
    render(
      <Select
        defaultValue="b"
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Bravo' },
        ]}
      />
    );
    expect(screen.getByRole('combobox').textContent).toContain('Bravo');
  });

  it('ToggleGroup disabled disables every option', () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        value="a"
        disabled
        onValueChange={onValueChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />
    );
    expect(screen.getByRole('radiogroup').getAttribute('aria-disabled')).toBe('true');
    const b = screen.getByRole('radio', { name: 'B' }) as HTMLButtonElement;
    expect(b.disabled).toBe(true);
  });

  it('DescriptionList and TreeSelect forward refs', () => {
    const list = createRef<HTMLDListElement>();
    render(<DescriptionList ref={list} variant="editable" />);
    expect(list.current?.tagName).toBe('DL');
    const trigger = createRef<HTMLElement>();
    render(
      <TreeSelect
        ref={trigger}
        nodes={[{ id: 'x', label: 'X' }]}
        title="Pick"
        className="w-80"
        onValueChange={() => undefined}
        trigger={<button type="button">Open</button>}
      />
    );
    expect(trigger.current).toBe(screen.getByRole('button', { name: 'Open' }));
  });
});
