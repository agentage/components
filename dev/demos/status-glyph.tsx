'use client';
import { StatusGlyph, type StatusGlyphProps, type StatusGlyphShape } from '../../src';
import { Block, Row } from '../components/demo';
import { RESULT_GLYPH } from '../lib/result-status';

const SHAPES: StatusGlyphShape[] = [
  'dot',
  'ring',
  'dashed',
  'disc',
  'half',
  'three-quarters',
  'check',
  'cross',
  'question',
  'alert',
  'slash',
  'clock',
];

const TONES: NonNullable<StatusGlyphProps['tone']>[] = [
  'muted',
  'primary',
  'success',
  'destructive',
  'warning',
  'info',
];

export const Example = () => (
  <Block caption="Shape carries the meaning and tone backs it up; give it a label when no text sits beside it.">
    <Row className="gap-3">
      <StatusGlyph shape="check" tone="success" label="Done" />
      <StatusGlyph shape="cross" tone="destructive" label="Failed" />
      <StatusGlyph shape="disc" tone="primary" pulse label="In progress" />
    </Row>
  </Block>
);

export const Variants = () => (
  <Block caption="Every shape in every tone at 14 px, including the dot shape.">
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="text-xs">
        <thead>
          <tr className="text-muted-foreground">
            <th className="px-3 py-2 text-left font-medium">Shape</th>
            {TONES.map((tone) => (
              <th key={tone} className="px-3 py-2 font-medium">
                {tone}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SHAPES.map((shape) => (
            <tr key={shape} className="border-t border-border">
              <td className="px-3 py-2 font-mono">{shape}</td>
              {TONES.map((tone) => (
                <td key={tone} className="px-3 py-2 text-center">
                  <StatusGlyph shape={shape} tone={tone} label={`${shape}, ${tone}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Block>
);

export const Sizes = () => (
  <Block caption="Size sm is 14 px (default) and md is 16 px.">
    <Row className="gap-4">
      <StatusGlyph shape="check" tone="success" label="Small" />
      <StatusGlyph shape="check" tone="success" size="md" label="Medium" />
    </Row>
  </Block>
);

export const States = () => (
  <Block caption="Pulse is a slow 2.4 s breathing glow for something live; it is off under reduced motion.">
    <Row className="gap-6">
      {TONES.slice(0, 4).map((tone) => (
        <span key={tone} className="inline-flex items-center gap-2 text-ui">
          <StatusGlyph shape="disc" tone={tone} pulse size="md" label={`${tone}, live`} />
          {tone}
        </span>
      ))}
    </Row>
  </Block>
);

export const Composition = () => (
  <div className="space-y-5">
    <Block caption="A status mapping lives in the app, not in the component; this one covers nine states.">
      <ul className="grid gap-2 text-ui sm:grid-cols-3">
        {Object.entries(RESULT_GLYPH).map(([status, glyph]) => (
          <li key={status} className="flex items-center gap-2">
            <StatusGlyph {...glyph} />
            {glyph.label}
          </li>
        ))}
      </ul>
    </Block>
  </div>
);
