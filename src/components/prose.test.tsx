import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Prose } from './prose';

describe('Prose', () => {
  it('reads at 14 px by default and 13 px at size sm', () => {
    const { container } = render(
      <>
        <Prose>a</Prose>
        <Prose size="sm">b</Prose>
      </>
    );
    const [md, sm] = Array.from(container.querySelectorAll<HTMLElement>('[data-slot="prose"]'));
    expect(md.className).toContain('text-sm');
    expect(sm.className).toContain('text-ui');
    expect(sm.dataset.size).toBe('sm');
  });

  it('styles tables and pre blocks', () => {
    const { container } = render(<Prose>x</Prose>);
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain('[&_th]:h-8');
    expect(cls).toContain('[&_pre]:overflow-x-auto');
  });
});
