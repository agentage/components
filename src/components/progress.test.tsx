import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './progress';

describe('Progress', () => {
  it('uses the label prop as the accessible name', () => {
    render(<Progress value={40} label="Upload" />);
    expect(screen.getByRole('progressbar', { name: 'Upload' }).getAttribute('aria-valuenow')).toBe(
      '40'
    );
  });

  it('prefers an explicit aria-label over the label prop', () => {
    render(<Progress value={40} label="Upload" aria-label="Sync progress" />);
    expect(screen.getByRole('progressbar', { name: 'Sync progress' })).toBeTruthy();
  });

  it('supports aria-labelledby pass-through', () => {
    render(
      <>
        <span id="pl">Restore</span>
        <Progress value={10} aria-labelledby="pl" />
      </>
    );
    expect(screen.getByRole('progressbar', { name: 'Restore' })).toBeTruthy();
  });

  it('omits aria-valuenow and animates the bar when indeterminate', () => {
    render(<Progress indeterminate label="Working" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe(null);
    expect(bar.getAttribute('data-indeterminate')).toBe('true');

    const fill = bar.firstElementChild as HTMLElement;
    expect(fill.className).toContain('animate-pulse');
    expect(fill.className).toContain('w-full');
    expect(fill.style.width).toBe('');
  });
});

describe('progressVariants', () => {
  it('renders the exact indicator class string for every status', () => {
    const base = 'h-full rounded-full transition-all';
    const tokens = {
      default: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive',
      info: 'bg-info',
    } as const;

    for (const [variant, token] of Object.entries(tokens)) {
      const { unmount } = render(
        <Progress value={30} variant={variant as keyof typeof tokens} label="p" />
      );
      const fill = screen.getByRole('progressbar').firstElementChild as HTMLElement;
      expect(fill.className).toBe(`${base} ${token}`);
      unmount();
    }
  });

  it('appends the indeterminate classes after the status token', () => {
    render(<Progress indeterminate variant="success" label="p" />);
    const fill = screen.getByRole('progressbar').firstElementChild as HTMLElement;
    expect(fill.className).toBe(
      'h-full rounded-full transition-all bg-success w-full motion-safe:animate-pulse'
    );
  });
});

describe('Progress duration', () => {
  it('defaults the fill transition to 300ms', () => {
    render(<Progress value={30} label="p" />);
    const fill = screen.getByRole('progressbar').firstElementChild as HTMLElement;
    expect(fill.style.transitionDuration).toBe('300ms');
  });

  it('honours a custom duration', () => {
    render(<Progress value={30} duration={800} label="p" />);
    const fill = screen.getByRole('progressbar').firstElementChild as HTMLElement;
    expect(fill.style.transitionDuration).toBe('800ms');
  });

  it('disables the transition when duration is false', () => {
    render(<Progress value={30} duration={false} label="p" />);
    const fill = screen.getByRole('progressbar').firstElementChild as HTMLElement;
    expect(fill.style.transitionDuration).toBe('0s');
  });
});

describe('Progress showValue and size', () => {
  it('writes the label and the percentage beside the bar and names the bar by them', () => {
    render(<Progress value={2} max={7} label="2 of 7 done" showValue />);
    expect(screen.getByRole('progressbar', { name: '2 of 7 done, 29%' })).toBeTruthy();
    expect(screen.getByText('2 of 7 done, 29%')).toBeTruthy();
  });

  it('writes only the percentage without a label', () => {
    render(<Progress value={50} showValue />);
    expect(screen.getByText('50%')).toBeTruthy();
  });

  it('keeps className on the wrapper when the value is shown', () => {
    const { container } = render(<Progress value={50} showValue className="w-40" />);
    expect(
      (container.querySelector('[data-slot="progress-value"]') as HTMLElement).className
    ).toContain('w-40');
    expect(screen.getByRole('progressbar').className).not.toContain('w-40');
  });

  it('renders a 6 px track for sm and an 8 px track for md', () => {
    const { rerender } = render(<Progress value={10} label="p" size="sm" />);
    expect(screen.getByRole('progressbar').className).toContain('h-1.5');
    rerender(<Progress value={10} label="p" />);
    expect(screen.getByRole('progressbar').className).toContain('h-2');
  });
});

describe('Progress as a meter', () => {
  it('clamps aria-valuenow into the range', () => {
    render(<Progress value={140} label="Upload" />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
  });

  it('renders a label row over the bar and names the bar by it', () => {
    render(<Progress labelPosition="top" label="Seats" value={2} max={5} showValue role="meter" />);
    expect(screen.getByRole('meter', { name: 'Seats' })).toBeTruthy();
    expect(screen.getByText('40%')).toBeTruthy();
  });

  it('shows the level by text and glyph, not only by colour', () => {
    const { container } = render(
      <Progress
        role="meter"
        labelPosition="top"
        label="Storage"
        value={90}
        showValue
        thresholds={{}}
        formatValue={(v, m) => `${String(v)} of ${String(m)}`}
      />
    );
    expect(screen.getByRole('meter').getAttribute('aria-valuetext')).toBe('90 of 100, warning');
    expect(container.querySelector('[data-slot="progress-level-cue"]')).not.toBeNull();
  });

  it('shows no level cue below the warning point', () => {
    const { container } = render(<Progress value={10} thresholds={{}} label="Storage" showValue />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuetext')).toBe(null);
    expect(container.querySelector('[data-slot="progress-level-cue"]')).toBeNull();
  });
});
