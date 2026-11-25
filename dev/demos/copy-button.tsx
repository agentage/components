'use client';
import { CopyButton } from '../../src';
import { Block, Row } from '../components/demo';

export const Example = () => (
  <Block caption="Click to copy; the label swaps to Copied for a moment, and to Failed if the browser blocks it.">
    <Row>
      <CopyButton text="npm install example-package" />
    </Row>
  </Block>
);

export const Variants = () => (
  <Block caption="CopyButton takes the Button variants; the default is outline.">
    <Row>
      <CopyButton text="example" variant="default" />
      <CopyButton text="example" variant="secondary" />
      <CopyButton text="example" variant="outline" />
      <CopyButton text="example" variant="ghost" />
    </Row>
  </Block>
);

export const Sizes = () => (
  <Block caption="Default is sm 24 px; pass size md for 28 px, or iconOnly for a 24 px square.">
    <Row>
      <CopyButton text="example" />
      <CopyButton text="example" size="md" />
      <CopyButton text="example" iconOnly variant="ghost" />
    </Row>
  </Block>
);

export const Composition = () => (
  <Block caption="An icon-only copy button sits at the end of a command line.">
    <div className="flex max-w-md items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5 font-mono text-xs">
      <span className="flex-1 truncate text-foreground">$ npm install example-package</span>
      <CopyButton text="npm install example-package" iconOnly variant="ghost" />
    </div>
  </Block>
);
