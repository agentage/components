'use client';
import { PRIORITY_LABEL, PriorityGlyph, type Priority } from '../../src';
import { Block, Row } from '../components/demo';

const ALL: Priority[] = ['urgent', 'high', 'medium', 'low', 'none'];

export const Example = () => (
  <Block caption="Three bars with 3, 2 or 1 lit; urgent is a filled square with an exclamation mark and no priority is a dash.">
    <Row className="gap-3">
      {ALL.map((p) => (
        <PriorityGlyph key={p} priority={p} />
      ))}
    </Row>
  </Block>
);

export const Variants = () => (
  <div className="space-y-5">
    <Block caption="With a visible label beside it, pass label={null} so the name is not read twice.">
      <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-ui">
        {ALL.map((p) => (
          <li key={p} className="flex items-center gap-1.5">
            <PriorityGlyph priority={p} label={null} />
            {PRIORITY_LABEL[p]}
          </li>
        ))}
      </ul>
    </Block>
    <Block caption="The glyph uses the current colour, so the caller can tint it.">
      <Row className="gap-3">
        <PriorityGlyph priority="high" className="text-foreground" />
        <PriorityGlyph priority="medium" className="text-primary" />
      </Row>
    </Block>
  </div>
);

export const Composition = () => (
  <Block caption="A priority mark leads a list row, before its title.">
    <div className="max-w-sm space-y-1 rounded-lg border border-border bg-card p-2 text-ui">
      {(
        [
          ['urgent', 'Restore the backup'],
          ['medium', 'Review the report'],
          ['low', 'Archive old folders'],
        ] as const
      ).map(([p, title]) => (
        <div key={title} className="flex items-center gap-2 px-1.5 py-1">
          <PriorityGlyph priority={p} />
          <span className="truncate">{title}</span>
        </div>
      ))}
    </div>
  </Block>
);
