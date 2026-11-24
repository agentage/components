import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  StatCard,
} from '../index';
import { failOnConsole } from './quiet';

failOnConsole();

describe('0.20.2 Card', () => {
  it('renders compound children and the flat variant', () => {
    render(
      <>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Description text.</CardDescription>
          </CardHeader>
          <CardContent>Body</CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
        <Card variant="flat" data-testid="flat">
          <p>Flat</p>
        </Card>
      </>
    );
    expect(screen.getByText('Card Title')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Action' })).toBeTruthy();
    expect(screen.getByTestId('flat').textContent).toBe('Flat');
  });
});

describe('0.20.2 Chip', () => {
  it('removes, clicks and activates by keyboard', () => {
    const onRemove = vi.fn();
    const onClick = vi.fn();
    render(
      <>
        <Chip variant="secondary" onRemove={onRemove}>
          Database
        </Chip>
        <Chip onClick={onClick}>Pick</Chip>
      </>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Pick' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Pick' }), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('renders every 0.20.2 variant', () => {
    render(
      <>
        {(
          ['default', 'secondary', 'outline', 'success', 'warning', 'destructive', 'info'] as const
        ).map((v) => (
          <Chip key={v} variant={v}>
            {v}
          </Chip>
        ))}
      </>
    );
    expect(screen.getByText('info')).toBeTruthy();
  });
});

describe('0.20.2 StatCard', () => {
  it('shows title, value, trend, description and progress', () => {
    render(
      <StatCard
        icon={<svg />}
        iconColor="bg-blue-500/10 text-blue-500"
        title="Storage"
        value="4.2 / 10 GB"
        trend={{ value: '+12%', up: true }}
        description="Plan quota"
        progress={42}
        progressLabel="Storage used"
      />
    );
    expect(screen.getByText('Storage')).toBeTruthy();
    expect(screen.getByText('4.2 / 10 GB')).toBeTruthy();
    expect(screen.getByText('+12%')).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'Storage used' })).toBeTruthy();
  });

  it('pressable renders a button that clicks', () => {
    const onClick = vi.fn();
    render(<StatCard pressable title="Machines" value={3} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
