'use client';
import { Kbd } from '../../src';
import { Block, Row } from '../components/demo';

export const Example = () => (
  <Block caption="Kbd draws one key; put several side by side for a shortcut.">
    <Row className="gap-1">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </Row>
  </Block>
);

export const Composition = () => (
  <Block caption="Pair shortcuts with a short muted label.">
    <Row className="gap-4">
      {[
        ['Search', ['⌘', 'K']],
        ['Save', ['Ctrl', 'S']],
        ['Close', ['Esc']],
      ].map(([label, keys]) => (
        <span key={String(label)} className="inline-flex items-center gap-1.5 text-ui">
          <span className="text-muted-foreground">{label}</span>
          {(keys as string[]).map((k) => (
            <Kbd key={k}>{k}</Kbd>
          ))}
        </span>
      ))}
    </Row>
  </Block>
);
