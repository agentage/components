import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { InspectorPanel } from './inspector-panel';

const Page = () => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button type="button">Opener</button>
      <InspectorPanel open={open} onOpenChange={setOpen} title="Root">
        body
      </InspectorPanel>
    </div>
  );
};

describe('InspectorPanel focus', () => {
  it('returns focus to where it came from when its own Close closes it', async () => {
    const user = userEvent.setup();
    render(<Page />);
    screen.getByRole('button', { name: 'Opener' }).focus();
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' }));
    await user.keyboard('{Enter}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Opener' }));
  });
});
