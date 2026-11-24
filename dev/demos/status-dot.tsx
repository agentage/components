'use client';
import { STATUS_DOT_GLYPH, StatusDot, StatusGlyph } from '../../src';
import { Block, Row } from '../components/demo';

const VARIANTS = ['online', 'offline', 'working', 'error', 'warning', 'paused', 'running'] as const;

export const Example = () => (
  <Block caption="Deprecated: StatusDot now draws a StatusGlyph. Use StatusGlyph with shape, tone and pulse; STATUS_DOT_GLYPH maps each old variant.">
    <Row className="gap-4">
      {VARIANTS.map((v) => (
        <StatusDot key={v} variant={v} label={v[0].toUpperCase() + v.slice(1)} />
      ))}
    </Row>
  </Block>
);

export const Composition = () => (
  <Block caption="The same states written with StatusGlyph: shape and colour carry the status.">
    <Row className="gap-4">
      {VARIANTS.map((v) => (
        <span key={v} className="inline-flex items-center gap-1.5 text-ui">
          <StatusGlyph {...STATUS_DOT_GLYPH[v]} />
          <span className="text-muted-foreground">{v}</span>
        </span>
      ))}
    </Row>
  </Block>
);
