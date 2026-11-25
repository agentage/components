'use client';
import { useState } from 'react';
import { Checkbox, Switch } from '../../src';
import { Block, Row } from '../components/demo';

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="flex cursor-pointer items-center gap-2 text-ui">{children}</label>
);

export const Example = () => {
  const [on, setOn] = useState(false);
  return (
    <Block caption="A checkbox and a switch, each bound to its own state.">
      <Row className="gap-8">
        <Label>
          <Checkbox checked={on} onCheckedChange={setOn} />
          Accept terms
        </Label>
        <Label>
          <Switch checked={on} onCheckedChange={setOn} />
          Notifications
        </Label>
      </Row>
    </Block>
  );
};

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="A checkbox is unchecked, checked or indeterminate.">
      <Row className="gap-8">
        <Label>
          <Checkbox checked={false} onCheckedChange={() => {}} />
          Unchecked
        </Label>
        <Label>
          <Checkbox checked onCheckedChange={() => {}} />
          Checked
        </Label>
        <Label>
          <Checkbox indeterminate onCheckedChange={() => {}} />
          Indeterminate
        </Label>
      </Row>
    </Block>
    <Block caption="A switch is off or on.">
      <Row className="gap-8">
        <Label>
          <Switch checked={false} onCheckedChange={() => {}} />
          Off
        </Label>
        <Label>
          <Switch checked onCheckedChange={() => {}} />
          On
        </Label>
      </Row>
    </Block>
  </div>
);

export const Sizes = () => (
  <div className="space-y-5">
    <Block caption="Checkbox md is the default; sm is for dense rows.">
      <Row className="gap-8">
        <Label>
          <Checkbox size="md" checked onCheckedChange={() => {}} />
          Medium
        </Label>
        <Label>
          <Checkbox size="sm" checked onCheckedChange={() => {}} />
          Small
        </Label>
      </Row>
    </Block>
    <Block caption="Switch md is the default; sm is for dense rows.">
      <Row className="gap-8">
        <Label>
          <Switch size="md" checked onCheckedChange={() => {}} />
          Medium
        </Label>
        <Label>
          <Switch size="sm" checked onCheckedChange={() => {}} />
          Small
        </Label>
      </Row>
    </Block>
  </div>
);

export const States = () => (
  <div className="space-y-5">
    <Block caption="Disabled controls dim and ignore clicks, checked or not.">
      <Row className="gap-8">
        <Label>
          <Checkbox disabled />
          Disabled
        </Label>
        <Label>
          <Checkbox disabled checked onCheckedChange={() => {}} />
          Disabled, checked
        </Label>
        <Label>
          <Switch disabled />
          Disabled
        </Label>
        <Label>
          <Switch disabled checked onCheckedChange={() => {}} />
          Disabled, on
        </Label>
      </Row>
    </Block>
    <Block caption="Error marks a required control that was left empty.">
      <Row className="gap-8">
        <Label>
          <Checkbox error />
          Accept terms
        </Label>
        <Label>
          <Switch error />
          Enable
        </Label>
      </Row>
    </Block>
  </div>
);

export const Composition = () => {
  const [items, setItems] = useState({ a: true, b: false, c: false });
  const all = Object.values(items).every(Boolean);
  const some = Object.values(items).some(Boolean);
  return (
    <Block caption="A parent checkbox shows the indeterminate state when only some children are checked.">
      <div className="space-y-2">
        <Label>
          <Checkbox
            checked={all}
            indeterminate={some && !all}
            onCheckedChange={(v) => {
              setItems({ a: v, b: v, c: v });
            }}
          />
          Select all
        </Label>
        <div className="space-y-2 pl-6">
          {(['a', 'b', 'c'] as const).map((k) => (
            <Label key={k}>
              <Checkbox
                checked={items[k]}
                onCheckedChange={(v) => {
                  setItems((s) => ({ ...s, [k]: v }));
                }}
              />
              {`Item ${k.toUpperCase()}`}
            </Label>
          ))}
        </div>
      </div>
    </Block>
  );
};
