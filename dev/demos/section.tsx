'use client';
import { useState } from 'react';
import {
  Avatar,
  Button,
  FormField,
  Input,
  Section,
  SectionLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '../../src';
import { Block } from '../components/demo';
import { UserIcon } from '../lib/icons';
import { UiIcon } from '../lib/ui-icons';

export const Example = () => (
  <Block caption="A titled group: a 16 px title, a muted helper line and an optional action.">
    <div className="max-w-xl">
      <Section
        title="General"
        description="How the service is named and where it lives."
        action={
          <Button variant="ghost" size="sm">
            Reset
          </Button>
        }
      >
        <FormField label="Name" layout="row">
          <Input defaultValue="Nightly backup" />
        </FormField>
      </Section>
    </div>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="The open variant is the default: no box, and a 1 px rule between sections.">
      <div className="max-w-xl">
        <Section title="Profile" description="Your account information.">
          <p className="text-ui text-muted-foreground">Ada Lovelace, ada@example.com</p>
        </Section>
        <Section title="Billing" description="Plan and invoices.">
          <p className="text-ui text-muted-foreground">Team plan, billed monthly.</p>
        </Section>
      </div>
    </Block>
    <Block caption="The boxed variant is a bordered block, for cards in a grid.">
      <div className="grid grid-cols-2 gap-4">
        <Section
          variant="boxed"
          icon={<UserIcon />}
          iconColor="bg-info/10 text-info"
          title="Profile"
          description="Your account information"
          action={
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          }
        >
          <div className="flex items-center gap-3">
            <Avatar name="Ada Lovelace" size="lg" />
            <div>
              <p className="text-ui font-medium">Ada Lovelace</p>
              <p className="text-xs text-muted-foreground">ada@example.com</p>
            </div>
          </div>
        </Section>
        <Section
          variant="boxed"
          icon={<UiIcon name="folder" />}
          iconColor="bg-success/10 text-success"
          title="Defaults"
          description="Shared settings"
        >
          <p className="text-ui text-muted-foreground">Three services use these defaults.</p>
        </Section>
      </div>
    </Block>
  </div>
);

export const Composition = () => {
  const [retry, setRetry] = useState(true);
  const [verbose, setVerbose] = useState(false);
  return (
    <Block caption="SectionLabel is an uppercase sub-heading that splits one section into parts.">
      <div className="max-w-xl">
        <Section title="Delivery" description="Where reports go and what happens on failure.">
          <FormField label="Channel" layout="row">
            <Select defaultValue="email">
              <SelectTrigger aria-label="Channel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <SectionLabel>On failure</SectionLabel>
          <div className="space-y-2">
            <div className="flex min-h-[30px] items-center justify-between gap-3 text-ui">
              <span id="sec-retry">Retry automatically</span>
              <Switch checked={retry} onCheckedChange={setRetry} aria-labelledby="sec-retry" />
            </div>
            <div className="flex min-h-[30px] items-center justify-between gap-3 text-ui">
              <span id="sec-verbose">Verbose logging</span>
              <Switch
                checked={verbose}
                onCheckedChange={setVerbose}
                aria-labelledby="sec-verbose"
              />
            </div>
          </div>
        </Section>
      </div>
    </Block>
  );
};
