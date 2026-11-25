'use client';
import { Prose } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="Prose styles plain HTML you do not control: paragraphs, links, code, lists and quotes.">
    <Prose className="max-w-lg">
      <p>
        This is a <strong>rich text</strong> block with <a href="#prose">links</a>,{' '}
        <code>inline code</code> and natural spacing.
      </p>
      <h3>Subsection</h3>
      <ul>
        <li>First item</li>
        <li>Second item</li>
      </ul>
      <blockquote>A quote has a quiet side rule.</blockquote>
    </Prose>
  </Block>
);

export const Sizes = () => (
  <div className="space-y-5">
    <Block caption="The default md size for articles.">
      <Prose className="max-w-lg">
        <p>Body text at the default size, with a second sentence to show the line height.</p>
      </Prose>
    </Block>
    <Block caption="Size sm is 13 px, for panes and cards.">
      <Prose size="sm" className="max-w-lg">
        <p>Body text at the small size, with a second sentence to show the line height.</p>
      </Prose>
    </Block>
  </div>
);
