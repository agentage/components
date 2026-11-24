'use client';
import { HeatmapCard } from '../../src';
import { Block } from '../components/demo';

const heatmapData = (() => {
  const grid: number[][] = [];
  let seed = 1234;
  const rng = (): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let r = 0; r < 7; r++) {
    const base = r < 5 ? 8 : 3;
    grid.push(Array.from({ length: 12 }, (_, c) => Math.floor(rng() * base * (1 + c * 0.05)) + 1));
  }
  return grid;
})();

export const Example = () => (
  <Block caption="A grid where cell intensity encodes value. Use it for activity by time, retention or errors by route.">
    <div className="max-w-md">
      <HeatmapCard
        title="Activity, last 12 weeks"
        rowLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        data={heatmapData}
        description="Documents edited per day, darker is more"
      />
    </div>
  </Block>
);

export const Variants = () => (
  <Block caption="Column labels, a fixed max and a custom colour turn the grid into a retention table.">
    <div className="max-w-md">
      <HeatmapCard
        title="Cohort retention"
        rowLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
        colLabels={['M1', 'M2', 'M3', 'M4', 'M5', 'M6']}
        data={[
          [100, 72, 58, 51, 47, 44],
          [100, 75, 60, 53, 49, 0],
          [100, 78, 62, 55, 0, 0],
          [100, 81, 65, 0, 0, 0],
          [100, 84, 0, 0, 0, 0],
        ]}
        max={100}
        tone="info"
        description="Percent of the cohort retained over months"
      />
    </div>
  </Block>
);
