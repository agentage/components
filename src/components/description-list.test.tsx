import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  DescriptionDetail,
  DescriptionGroup,
  DescriptionList,
  DescriptionTerm,
} from './description-list';

const list = (props: Parameters<typeof DescriptionList>[0] = {}) =>
  render(
    <DescriptionList {...props}>
      <DescriptionTerm>Branch</DescriptionTerm>
      <DescriptionDetail mono>feature/very-long-branch-name</DescriptionDetail>
      <DescriptionTerm>Turns</DescriptionTerm>
      <DescriptionDetail>12</DescriptionDetail>
    </DescriptionList>
  );

describe('DescriptionList', () => {
  it('renders dl, dt and dd', () => {
    const { container } = list();
    expect(container.querySelector('dl')).not.toBeNull();
    expect(container.querySelectorAll('dt')).toHaveLength(2);
    expect(container.querySelectorAll('dd')).toHaveLength(2);
    expect(screen.getAllByRole('term')).toHaveLength(2);
  });

  it('defaults to a 90 px label column', () => {
    const { container } = list();
    expect(container.querySelector('dl')?.className).toContain('grid-cols-[90px_minmax(0,1fr)]');
  });

  it('maps label widths and two columns', () => {
    const cases = [
      [{ labelWidth: 'md' as const }, 'grid-cols-[110px_minmax(0,1fr)]'],
      [{ labelWidth: 'auto' as const }, 'grid-cols-[auto_minmax(0,1fr)]'],
      [{ columns: 2 as const }, 'grid-cols-[90px_minmax(0,1fr)_90px_minmax(0,1fr)]'],
      [
        { columns: 2 as const, labelWidth: 'auto' as const },
        'grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)]',
      ],
    ] as const;
    for (const [props, cls] of cases) {
      const { container, unmount } = list(props);
      expect(container.querySelector('dl')?.className).toContain(cls);
      unmount();
    }
  });

  it('wraps long details and sets mono on request', () => {
    list();
    const mono = screen.getByText('feature/very-long-branch-name');
    expect(mono.className).toContain('wrap-anywhere');
    expect(mono.className).toContain('font-mono');
    expect(screen.getByText('12').className).not.toContain('font-mono');
  });
});

describe('DescriptionList enhancements', () => {
  it('copies, links, truncates with a title and shows a term icon', () => {
    render(
      <DescriptionList>
        <DescriptionTerm icon={<svg data-testid="icon" />}>Report</DescriptionTerm>
        <DescriptionDetail mono copy truncate>
          run_8f2a91c4e7
        </DescriptionDetail>
        <DescriptionTerm>Service</DescriptionTerm>
        <DescriptionDetail href="#service">release-notes</DescriptionDetail>
      </DescriptionList>
    );
    expect(screen.getByTestId('icon')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeTruthy();
    const value = screen.getByText('run_8f2a91c4e7');
    expect(value.className).toContain('truncate');
    expect(value.getAttribute('title')).toBe('run_8f2a91c4e7');
    expect(screen.getByRole('link', { name: 'release-notes' }).getAttribute('href')).toBe(
      '#service'
    );
  });

  it('groups facts under a heading and uses dense text by default', () => {
    const { container } = render(
      <DescriptionGroup title="Timing">
        <DescriptionList columns="responsive">
          <DescriptionTerm>Started</DescriptionTerm>
          <DescriptionDetail>10:02</DescriptionDetail>
        </DescriptionList>
      </DescriptionGroup>
    );
    expect(screen.getByRole('region', { name: 'Timing' })).toBeTruthy();
    const dl = container.querySelector('dl');
    expect(dl?.className).toContain('text-ui');
    expect(dl?.className).toContain(
      '@min-[520px]:grid-cols-[90px_minmax(0,1fr)_90px_minmax(0,1fr)]'
    );
    expect(dl?.parentElement?.className).toContain('@container');
  });
});

describe('DescriptionList inline', () => {
  it('lays pairs side by side, label over value', () => {
    const { container } = render(
      <DescriptionList variant="inline">
        <div>
          <DescriptionTerm>p50</DescriptionTerm>
          <DescriptionDetail>96 ms</DescriptionDetail>
        </div>
      </DescriptionList>
    );
    const dl = container.querySelector('dl');
    expect(dl?.className).toContain('@min-[15rem]:grid-flow-col');
    expect(dl?.className).not.toContain('grid-cols-[90px');
    expect(screen.getByText('96 ms').tagName).toBe('DD');
  });
});
