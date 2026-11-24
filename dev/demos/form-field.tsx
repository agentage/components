'use client';
import { FormField, Input, Select } from '../../src';
import { Block } from '../components/demo';
import { SchedulePreview } from '../lib/schedule-preview';

export const Example = () => (
  <Block caption="A label over a control, with an optional hint.">
    <FormField label="Name" hint="Shown to your team." className="max-w-xs">
      <Input placeholder="Enter a name" />
    </FormField>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="Preview shows a live result under the control, here the schedule in words.">
      <SchedulePreview />
    </Block>
    <Block caption="Stacked is the default: the label sits above the control.">
      <FormField label="Email" className="max-w-xs">
        <Input placeholder="name@example.com" />
      </FormField>
    </Block>
    <Block caption="Row layout puts the label in a 150 px column; it stacks below 560 px.">
      <div className="max-w-[640px] space-y-3">
        <FormField label="Identifier" layout="row" hint="Used in paths and links.">
          <Input mono defaultValue="release-notes" />
        </FormField>
        <FormField label="Status" layout="row">
          <Select
            aria-label="Status"
            defaultValue="active"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'paused', label: 'Paused' },
            ]}
          />
        </FormField>
      </div>
    </Block>
  </div>
);

export const States = () => (
  <div className="max-w-xs space-y-5">
    <Block caption="Required adds a marker after the label.">
      <FormField label="Name" required>
        <Input placeholder="Enter a name" />
      </FormField>
    </Block>
    <Block caption="An error replaces the hint and marks the control invalid.">
      <FormField label="Email" error="Enter a valid email address.">
        <Input error defaultValue="ada@" />
      </FormField>
    </Block>
  </div>
);

export const Composition = () => (
  <Block caption="A two-column form: full-width fields span both columns.">
    <div className="grid max-w-lg grid-cols-2 gap-3">
      <FormField label="First name" required>
        <Input defaultValue="Ada" />
      </FormField>
      <FormField label="Last name" required>
        <Input defaultValue="Lovelace" />
      </FormField>
      <FormField label="Email" hint="We never share it." className="col-span-2">
        <Input defaultValue="ada@example.com" />
      </FormField>
    </div>
  </Block>
);
