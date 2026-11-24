'use client';
import { Progress } from '../../src';
import { Block } from '../components/demo';
import { Segments } from './progress-segments';

const VARIANTS = [
  ['Default', 65, 'default'],
  ['Success', 100, 'success'],
  ['Warning', 80, 'warning'],
  ['Error', 30, 'destructive'],
  ['Info', 50, 'info'],
] as const;

export const Example = () => (
  <Block caption="A determinate bar. The label names it for screen readers.">
    <Progress value={65} label="Upload" className="max-w-md" />
  </Block>
);

export const Variants = () => (
  <Block
    caption="Five tones: default, success, warning, destructive and info."
    className="max-w-md space-y-3"
  >
    {VARIANTS.map(([label, value, variant]) => (
      <div key={label} className="flex items-center gap-3">
        <span className="w-16 text-xs text-muted-foreground">{label}</span>
        <Progress value={value} variant={variant} label={label} />
        <span className="w-8 text-xs text-muted-foreground">{value}%</span>
      </div>
    ))}
  </Block>
);

export const Sizes = () => (
  <Block caption="Size md is an 8 px track (default); sm is 6 px." className="max-w-md space-y-3">
    <Progress value={60} label="Medium" />
    <Progress value={60} label="Small" size="sm" />
  </Block>
);

export const States = () => (
  <div className="space-y-5">
    <Block
      caption="Show value writes the label and the percentage beside the bar."
      className="max-w-md space-y-3"
    >
      <Progress value={2} max={7} label="2 of 7 done" showValue />
      <Progress value={2} max={7} label="2 of 7 done" showValue size="sm" variant="info" />
    </Block>
    <Block
      caption="Indeterminate is for unknown progress: it animates a full bar."
      className="max-w-md"
    >
      <Progress indeterminate label="Preparing" />
    </Block>
  </div>
);

const QUOTAS = [
  { label: 'Storage', value: 17, max: 100, unit: 'MB' },
  { label: 'Documents', value: 84, max: 100, unit: 'files' },
  { label: 'API calls', value: 9_900, max: 10_000, unit: 'calls' },
];

const Meters = () => (
  <Block
    caption="A meter with a top label turns warning past 80 % and destructive past 95 %."
    className="max-w-md space-y-4"
  >
    {QUOTAS.map((q) => (
      <Progress
        key={q.label}
        role="meter"
        labelPosition="top"
        showValue
        thresholds={{}}
        label={q.label}
        value={q.value}
        max={q.max}
        formatValue={(v, m) => `${v.toLocaleString('en')} / ${m.toLocaleString('en')} ${q.unit}`}
      />
    ))}
  </Block>
);

export const Composition = () => (
  <div className="space-y-5">
    <Meters />
    <Segments />
  </div>
);
