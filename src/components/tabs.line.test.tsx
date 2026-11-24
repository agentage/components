import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

describe('Tabs line variant', () => {
  it('renders the 38 px list, count, dirty dot and indicator, with arrow keys', () => {
    render(
      <Tabs defaultValue="config" variant="line">
        <TabsList aria-label="Service">
          <TabsTrigger value="config" dirty>
            Configuration
          </TabsTrigger>
          <TabsTrigger value="reports" count={12}>
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="config">A</TabsContent>
        <TabsContent value="reports">B</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole('tablist').className).toContain('h-9.5');
    const config = screen.getByRole('tab', { name: /Configuration/ });
    expect(config.textContent).toContain('Unsaved changes');
    expect(config.className).toContain('after:bg-primary');
    expect(config.className).toContain('text-ui');
    const reports = screen.getByRole('tab', { name: /Reports/ });
    expect(reports.textContent).toContain('12');
    expect(reports.className).not.toContain('after:bg-primary');
    fireEvent.keyDown(config, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(reports);
    expect(reports.getAttribute('aria-selected')).toBe('true');
  });
});
