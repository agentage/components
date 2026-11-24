import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PageHeader } from './page-header';

const expectBase = (el: HTMLElement): void => {
  for (const c of ['h-7', 'rounded-md', 'text-ui', 'focus-ring', 'disabled:opacity-50']) {
    expect(el.className).toContain(c);
  }
};

describe('pageHeaderActionVariants', () => {
  it('renders the base and tone classes for the whole status vocabulary', () => {
    const tails = {
      default: 'text-muted-foreground hover:bg-accent hover:text-foreground',
      success: 'text-success hover:bg-accent',
      warning: 'text-warning hover:bg-accent',
      destructive: 'text-destructive hover:bg-accent',
      info: 'text-info hover:bg-accent',
    } as const;

    render(
      <PageHeader
        title="T"
        actions={Object.keys(tails).map((variant) => ({
          icon: <svg />,
          onClick: vi.fn(),
          title: variant,
          variant: variant as keyof typeof tails,
        }))}
      />
    );

    for (const [variant, tail] of Object.entries(tails)) {
      const button = screen.getByRole('button', { name: variant });
      expectBase(button);
      expect(button.className.endsWith(tail)).toBe(true);
    }
  });

  it('falls back to the default variant', () => {
    render(
      <PageHeader title="T" actions={[{ icon: <svg />, onClick: vi.fn(), title: 'Plain' }]} />
    );
    const button = screen.getByRole('button', { name: 'Plain' });
    expectBase(button);
    expect(button.className).toContain('text-muted-foreground');
  });
});

describe('PageHeader', () => {
  it('merges className last and spreads props on the header', () => {
    const { container } = render(<PageHeader title="T" className="mb-1" id="ph" data-x="h" />);
    const header = container.querySelector('[data-slot="page-header"]') as HTMLElement;
    expect(header.className).toBe('flex h-12 items-center justify-between gap-3 mb-1');
    expect(header.id).toBe('ph');
    expect(header.dataset.x).toBe('h');
  });

  it('renders the title as the page heading', () => {
    render(<PageHeader title="Documents" description="12 files" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Documents' })).toBeTruthy();
  });

  it('renders a ReactNode title, meta and tabs in the detail variant', () => {
    render(
      <PageHeader
        variant="detail"
        title={<span>Release notes</span>}
        description="Drafts notes"
        meta={<span>Next update in 2 h</span>}
        tabs={<div role="tablist" aria-label="Sections" />}
      />
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Release notes' })).toBeTruthy();
    expect(screen.getByText('Next update in 2 h')).toBeTruthy();
    expect(screen.getByRole('tablist')).toBeTruthy();
  });
});

describe('PageHeader description', () => {
  it('renders the description under the title', () => {
    render(<PageHeader title="Billing" description="Plans and invoices" />);
    expect(screen.getByText('Plans and invoices')).toBeTruthy();
  });
});
