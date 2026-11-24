'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../src';
import { Block, Row } from '../components/demo';

const Items = () => (
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="paused">Paused</SelectItem>
    <SelectItem value="failed">Failed</SelectItem>
  </SelectContent>
);

export const Example = () => (
  <Block caption="A single choice from a short list.">
    <Select>
      <SelectTrigger aria-label="Status" className="w-48">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <Items />
    </Select>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="Items grouped under labels, with a separator between groups.">
      <Select defaultValue="ada">
        <SelectTrigger aria-label="Owner" className="w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Team</SelectLabel>
            <SelectItem value="ada">Ada Lovelace</SelectItem>
            <SelectItem value="grace">Grace Hopper</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Guests</SelectLabel>
            <SelectItem value="alan">Alan Turing</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Block>
  </div>
);

export const Sizes = () => (
  <Block caption="Size md is 30 px tall and the default; sm is 26 px for dense rows.">
    <Row>
      <Select defaultValue="active">
        <SelectTrigger size="md" aria-label="Medium select" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <Items />
      </Select>
      <Select defaultValue="active">
        <SelectTrigger size="sm" aria-label="Small select" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <Items />
      </Select>
    </Row>
  </Block>
);

export const States = () => (
  <div className="space-y-5">
    <Block caption="Error marks the trigger invalid.">
      <Select>
        <SelectTrigger error aria-label="Required status" className="w-48">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <Items />
      </Select>
    </Block>
    <Block caption="A disabled select dims and cannot open.">
      <Select disabled defaultValue="paused">
        <SelectTrigger aria-label="Locked status" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <Items />
      </Select>
    </Block>
    <Block caption="A disabled item stays visible but cannot be picked.">
      <Select defaultValue="active">
        <SelectTrigger aria-label="Status with disabled item" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="failed" disabled>
            Failed
          </SelectItem>
        </SelectContent>
      </Select>
    </Block>
  </div>
);
