import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './card';
import { DropdownMenuItem } from './dropdown-menu';
import { EntityCard } from './entity-card';

const setup = () => {
  const handlers = { onOpen: vi.fn(), onSelectedChange: vi.fn(), onEnabledChange: vi.fn() };
  render(
    <EntityCard
      title="release-notes"
      description="Drafts release notes"
      facts={[{ label: 'Trigger', value: 'Daily' }]}
      footer={<span>12 reports</span>}
      selectable
      enabled
      menu={<DropdownMenuItem>Refresh now</DropdownMenuItem>}
      {...handlers}
    />
  );
  return handlers;
};

describe('EntityCard', () => {
  it('opens from the title button and shows facts and footer', () => {
    const { onOpen } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'release-notes' }));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('term').textContent).toBe('Trigger');
    expect(screen.getByText('12 reports')).toBeTruthy();
  });

  it('controls have names and never open the card', () => {
    const { onOpen, onSelectedChange, onEnabledChange } = setup();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select release-notes' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Pause release-notes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Actions for release-notes' }));
    expect(onSelectedChange).toHaveBeenCalledWith(true);
    expect(onEnabledChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('menuitem', { name: 'Refresh now' })).toBeTruthy();
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('renders a plain title without onOpen', () => {
    render(<EntityCard title="plain" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('Card dense options', () => {
  it('maps padding sm, interactive and selected', () => {
    render(
      <Card padding="sm" interactive selected data-testid="c">
        x
      </Card>
    );
    const card = screen.getByTestId('c');
    expect(card.className).toContain('px-3.5 py-3');
    expect(card.className).not.toContain('shadow-sm');
    expect(card.className).toContain('border-primary');
    expect(card.className).toContain('focus-ring');
    expect(card.className).toContain('has-[[data-card-activator]:focus-visible]:outline-ring');
    expect(card.dataset.selected).toBe('true');
  });
});
