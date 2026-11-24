import type { CategoryEntry } from '../registry';
import { sections } from './sections';
import * as DonutCard from '../demos/donut-card';
import * as FunnelCard from '../demos/funnel-card';
import * as GaugeCard from '../demos/gauge-card';
import * as HeatmapCard from '../demos/heatmap-card';
import * as MultiStatCard from '../demos/multi-stat-card';
import * as RankedListCard from '../demos/ranked-list-card';
import * as ScoreCard from '../demos/score-card';
import * as Sparkline from '../demos/sparkline';

export const CHARTS: CategoryEntry = {
  slug: 'charts',
  label: 'Charts',
  description: 'Chart cards and the small charts inside stat cards.',
  components: [
    {
      slug: 'gauge-card',
      name: 'GaugeCard',
      description: 'A value on a half-circle gauge.',
      exports: ['GaugeCard'],
      parts: [],
      demos: sections(GaugeCard),
    },
    {
      slug: 'donut-card',
      name: 'DonutCard',
      description: 'Parts of a whole as a donut with a legend.',
      exports: ['DonutCard'],
      parts: [],
      demos: sections(DonutCard),
    },
    {
      slug: 'score-card',
      name: 'ScoreCard',
      description: 'A score against bands.',
      exports: ['ScoreCard'],
      parts: [],
      demos: sections(ScoreCard),
    },
    {
      slug: 'funnel-card',
      name: 'FunnelCard',
      description: 'A conversion funnel with the drop-off per stage.',
      exports: ['FunnelCard'],
      parts: [],
      demos: sections(FunnelCard),
    },
    {
      slug: 'heatmap-card',
      name: 'HeatmapCard',
      description: 'Activity by day and hour.',
      exports: ['HeatmapCard'],
      parts: [],
      demos: sections(HeatmapCard),
    },
    {
      slug: 'multi-stat-card',
      name: 'MultiStatCard',
      description: 'Several figures with trends in one card.',
      exports: ['MultiStatCard'],
      parts: [],
      demos: sections(MultiStatCard),
    },
    {
      slug: 'ranked-list-card',
      name: 'RankedListCard',
      description: 'A ranked list with values and bars.',
      exports: ['RankedListCard'],
      parts: [],
      demos: sections(RankedListCard),
    },
    {
      slug: 'sparkline',
      name: 'Sparkline and stat parts',
      description:
        'Inline charts and breakdowns for StatCard: Sparkline, MiniBars, StatBreakdown, StatProgress, StatComparison.',
      exports: ['Sparkline', 'MiniBars', 'StatBreakdown', 'StatProgress', 'StatComparison'],
      parts: [],
      demos: sections(Sparkline),
    },
  ],
};
