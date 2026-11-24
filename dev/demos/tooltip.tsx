'use client';
import { Button, Tooltip } from '../../src';
import { Block, Row } from '../components/demo';

export const Example = () => (
  <Block caption="A short label on hover or keyboard focus.">
    <Tooltip content="Edit this item">
      <Button variant="outline" size="sm">
        Edit
      </Button>
    </Tooltip>
  </Block>
);

export const Variants = () => (
  <Block caption="The side prop places the tooltip around the trigger. Top is the default.">
    <Row className="gap-4">
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Tooltip key={side} content={`Shown ${side}`} side={side}>
          <Button variant="outline" size="sm">
            {side[0].toUpperCase() + side.slice(1)}
          </Button>
        </Tooltip>
      ))}
    </Row>
  </Block>
);
