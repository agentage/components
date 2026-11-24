'use client';
import { Heading } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="Heading sets the visual scale from the level you pick with as.">
    <Heading as="h2">Section title</Heading>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="Four levels: h1 for a page title, h2 for a section, h3 for a subsection and h4 for a label.">
      <div className="space-y-4">
        <Heading as="h1">Page title</Heading>
        <Heading as="h2">Section</Heading>
        <Heading as="h3">Subsection</Heading>
        <Heading as="h4">Label</Heading>
      </div>
    </Block>
    <Block caption="The description prop adds one muted supporting line.">
      <Heading as="h2" description="Shown under the title in the muted colour.">
        With a description
      </Heading>
    </Block>
  </div>
);
