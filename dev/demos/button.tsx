'use client';
import { Button } from '../../src';
import { Block, Row } from '../components/demo';
import { EditIcon, InfoIcon } from '../lib/icons';

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

export const Example = () => (
  <Block caption="The page primary action is outline-primary; use the default fill for one confirming action.">
    <Row>
      <Button variant="outline-primary">
        <PlusIcon />
        New item
      </Button>
      <Button>Save</Button>
    </Row>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="Every variant at the default md size.">
      <Row>
        <Button>Default</Button>
        <Button variant="outline-primary">Outline primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </Row>
    </Block>
    <Block caption="With asChild the button styles become a link, so navigation stays a real anchor.">
      <Row>
        <Button asChild variant="outline">
          <a href="#link">Open the report</a>
        </Button>
      </Row>
    </Block>
  </div>
);

export const Sizes = () => (
  <div className="space-y-5">
    <Block caption="Controls are md 28 px by default and sm 24 px for dense toolbars.">
      <Row>
        <Button>Medium</Button>
        <Button size="sm">Small</Button>
        <Button variant="outline-primary">
          <PlusIcon />
          Medium
        </Button>
        <Button variant="outline-primary" size="sm">
          <PlusIcon />
          Small
        </Button>
      </Row>
    </Block>
    <Block caption="Icon-only buttons are 28 px (icon) and 24 px (icon-sm); always give them an aria-label.">
      <Row>
        <Button size="icon" variant="outline" aria-label="Edit">
          <EditIcon />
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Info">
          <InfoIcon />
        </Button>
      </Row>
    </Block>
  </div>
);

export const States = () => (
  <div className="space-y-5">
    <Block caption="Disabled buttons drop to half opacity and ignore the pointer.">
      <Row>
        <Button disabled>Save</Button>
        <Button variant="outline-primary" disabled>
          Disabled
        </Button>
        <Button variant="outline" disabled>
          Outline
        </Button>
      </Row>
    </Block>
    <Block caption="Pending disables the button, sets aria-busy and shows a spinner before the label.">
      <Row>
        <Button pending>Saving</Button>
        <Button variant="outline-primary" pending>
          Saving
        </Button>
        <Button variant="outline" size="sm" pending>
          Saving
        </Button>
      </Row>
    </Block>
  </div>
);

export const Composition = () => (
  <Block caption="A dialog footer pairs a quiet cancel with one confirming action.">
    <div className="flex max-w-sm items-center justify-end gap-2 rounded-lg border border-border bg-card p-3">
      <Button variant="ghost">Cancel</Button>
      <Button variant="outline">Save draft</Button>
      <Button>Publish</Button>
    </div>
  </Block>
);
