'use client';
import { useState } from 'react';
import { Badge, Button, Chip } from '../../src';
import { Block, Row } from '../components/demo';

const INITIAL = ['Database', 'Analytics', 'Cloud', 'Productivity'];

export const Example = () => (
  <Block caption="A chip is a rounded tag for a value, a filter or a category.">
    <Row>
      <Chip>Database</Chip>
      <Chip variant="success">Active</Chip>
    </Row>
  </Block>
);

export const Variants = () => (
  <Block caption="Outline is the default; the tinted variants carry meaning.">
    <Row>
      <Chip>Outline</Chip>
      <Chip variant="default">Primary</Chip>
      <Chip variant="secondary">Secondary</Chip>
      <Chip variant="success">Active</Chip>
      <Chip variant="warning">Paused</Chip>
      <Chip variant="destructive">Failed</Chip>
      <Chip variant="info">New</Chip>
    </Row>
  </Block>
);

export const Sizes = () => (
  <Block caption="Size md is 24 px for tags; sm is 20 px for filters and toggles.">
    <Row>
      <Chip variant="secondary">Medium</Chip>
      <Chip size="sm">Small</Chip>
      <Chip size="sm" onRemove={() => {}} removeLabel="Remove filter Status: Paused">
        Status: Paused
      </Chip>
    </Row>
  </Block>
);

export const States = () => {
  const [chips, setChips] = useState<string[]>(INITIAL);
  const [pressed, setPressed] = useState(true);
  return (
    <div className="space-y-5">
      <Block caption="Removable chips show a close button; Reset brings them back.">
        <Row>
          {chips.map((c) => (
            <Chip
              key={c}
              variant="secondary"
              onRemove={() => {
                setChips((prev) => prev.filter((x) => x !== c));
              }}
            >
              {c}
            </Chip>
          ))}
          {chips.length < INITIAL.length && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setChips(INITIAL);
              }}
            >
              Reset
            </Button>
          )}
        </Row>
      </Block>
      <Block caption="A pressable chip is a toggle with aria-pressed; pressed shows the accent rule.">
        <Row>
          <Chip
            size="sm"
            pressed={pressed}
            onClick={() => {
              setPressed(!pressed);
            }}
          >
            Needs attention
          </Chip>
          <Chip size="sm" pressed={!pressed} onClick={() => setPressed(!pressed)}>
            Archived
          </Chip>
        </Row>
      </Block>
    </div>
  );
};

export const Composition = () => (
  <Block caption="For a count beside a label, use Badge count; it hides itself at 0.">
    <Row className="gap-4">
      <span className="inline-flex items-center gap-1.5 text-ui">
        Filter <Badge count={3} />
      </span>
      <span className="inline-flex items-center gap-1.5 text-ui text-muted-foreground">
        Filter <Badge count={0} />
      </span>
    </Row>
  </Block>
);
