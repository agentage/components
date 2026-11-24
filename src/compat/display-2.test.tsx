import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Alert,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Chip,
  Kbd,
  NavLink,
  Progress,
  QuotaBanner,
  StatusDot,
  UsageMeter,
} from '../index';
import { failOnConsole } from './quiet';

failOnConsole();

describe('0.20.2 StatusDot', () => {
  it('renders every variant with its label', () => {
    const variants = [
      'online',
      'offline',
      'working',
      'error',
      'warning',
      'info',
      'pending',
      'primary',
    ] as const;
    render(
      <>
        {variants.map((v) => (
          <StatusDot key={v} variant={v} label={v} size="sm" />
        ))}
      </>
    );
    variants.forEach((v) => expect(screen.getByText(v)).toBeTruthy());
  });
});

describe('0.20.2 Badge, Kbd, Progress, Alert', () => {
  it('renders badges and keys', () => {
    render(
      <>
        <Badge variant="success">Success</Badge>
        <Badge variant="outline">Outline</Badge>
        <Kbd>Esc</Kbd>
      </>
    );
    expect(screen.getByText('Success')).toBeTruthy();
    expect(screen.getByText('Esc')).toBeTruthy();
  });

  it('progress exposes value and label', () => {
    render(<Progress value={65} variant="warning" label="Disk" />);
    const bar = screen.getByRole('progressbar', { name: 'Disk' });
    expect(bar.getAttribute('aria-valuenow')).toBe('65');
  });

  it('alert closes through onClose', () => {
    const onClose = vi.fn();
    render(
      <Alert variant="info" icon={<svg />} onClose={onClose}>
        Heads up
      </Alert>
    );
    expect(screen.getByText('Heads up')).toBeTruthy();
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('0.20.2 Breadcrumb and NavLink', () => {
  it('renders links and the current page', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/a">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>run-1</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByRole('link', { name: 'Dashboard' }).getAttribute('href')).toBe('/a');
    expect(screen.getByText('run-1').getAttribute('aria-current')).toBe('page');
  });

  it('NavLink marks the active link', () => {
    render(
      <>
        <NavLink icon={<svg />} href="#a" active badge="3">
          Home
        </NavLink>
        <NavLink href="#b">Other</NavLink>
      </>
    );
    expect(screen.getByRole('link', { name: /Home/ }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: 'Other' }).getAttribute('aria-current')).toBeNull();
  });
});

describe('0.20.2 UsageMeter and QuotaBanner', () => {
  it('meter reports value and formatted text', () => {
    render(
      <>
        <UsageMeter label="Storage" value={4} max={10} formatValue={(v, m) => `${v} of ${m} GB`} />
        <UsageMeter label="Seats" value={4} max={5} size="sm" />
      </>
    );
    expect(screen.getByRole('meter', { name: 'Storage' }).getAttribute('aria-valuetext')).toBe(
      '4 of 10 GB'
    );
    expect(screen.getByRole('meter', { name: 'Seats' }).getAttribute('aria-valuenow')).toBe('4');
  });

  it('banner shows status, action and over-limit', () => {
    render(
      <>
        <QuotaBanner
          label="storage"
          value={82}
          max={100}
          icon={<svg />}
          action={<Button size="sm">Upgrade</Button>}
        />
        <QuotaBanner label="memories" value={520} max={500} />
      </>
    );
    expect(screen.getAllByRole('status').length).toBe(2);
    expect(screen.getByRole('button', { name: 'Upgrade' })).toBeTruthy();
  });

  it('keeps useState consumers stable', () => {
    const Demo = (): React.JSX.Element => {
      const [n, setN] = useState(0);
      return <Chip onClick={() => setN(n + 1)}>{`n${n}`}</Chip>;
    };
    render(<Demo />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('n1')).toBeTruthy();
  });
});
