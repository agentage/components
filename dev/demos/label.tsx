'use client';
import { Input, Label } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="Click the label to focus its input; htmlFor ties them together.">
    <div className="flex max-w-xs flex-col gap-1.5">
      <Label htmlFor="label-example">Name</Label>
      <Input id="label-example" placeholder="Ada Lovelace" />
    </div>
  </Block>
);

export const States = () => (
  <div className="space-y-5">
    <Block caption="Required adds a red asterisk after the text.">
      <div className="flex max-w-xs flex-col gap-1.5">
        <Label htmlFor="label-required" required>
          Email
        </Label>
        <Input id="label-required" placeholder="ada@example.com" />
      </div>
    </Block>
  </div>
);
