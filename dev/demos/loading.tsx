'use client';
import { Skeleton, Spinner } from '../../src';
import { Block, Row } from '../components/demo';

export const Example = () => (
  <Block caption="Spinner shows work in progress when the shape of the result is unknown.">
    <Row>
      <Spinner />
    </Row>
  </Block>
);

export const Variants = () => (
  <Block caption="Skeleton has three shapes: text, circular and rectangular; size them with className.">
    <div className="w-48 space-y-2">
      <Skeleton variant="circular" className="size-10" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="rectangular" className="h-20" />
    </div>
  </Block>
);

export const Sizes = () => (
  <Block caption="Spinner sizes: sm 16 px, md 24 px (default) and lg 32 px.">
    <Row className="gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Row>
  </Block>
);

export const Composition = () => (
  <Block caption="Use a skeleton that matches the row it replaces, so the page does not shift when data arrives.">
    <div className="max-w-sm space-y-3 rounded-lg border border-border bg-card p-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" className="size-7" />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="text" className="h-3 w-2/3" />
            <Skeleton variant="text" className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  </Block>
);
