'use client';
import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardMeta,
  CardTitle,
  DescriptionDetail,
  DescriptionList,
  DescriptionTerm,
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  MetaItem,
  PageHeader,
  RelativeTime,
  Sparkline,
  StatCard,
  StatusBar,
  StatusGlyph,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ToggleGroup,
  type CardState,
} from '../../../src';
import { Block } from '../../components/demo';
import { ago, checkCells, MONITOR_INCIDENTS } from '../../lib/monitor-data';
import { UiIcon } from '../../lib/ui-icons';

const VIEWS = [
  { value: 'ready', label: 'Ready' },
  { value: 'loading', label: 'Loading' },
  { value: 'empty', label: 'Empty' },
  { value: 'error', label: 'Error' },
] as const;

const SPARK = [180, 160, 175, 210, 190, 170, 165, 480, 200, 185, 172, 168];

const useStatefulCard = () => {
  const [state, setState] = useState<CardState>('ready');
  const [checked, setChecked] = useState(ago(1));
  useEffect(() => {
    if (state !== 'loading') return;
    const t = setTimeout(() => {
      setState('ready');
      setChecked(Date.now());
    }, 900);
    return () => clearTimeout(t);
  }, [state]);
  return { state, setState, checked };
};

const Latency = () => {
  const { state, setState, checked } = useStatefulCard();
  return (
    <Card
      state={state}
      minHeight={210}
      fallback={{
        error: { message: 'The response times could not be loaded.', reference: 'req-4f2a91' },
        onRetry: () => setState('loading'),
        empty: 'No response times in this period.',
      }}
    >
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Response time</CardTitle>
        <ToggleGroup
          variant="segmented"
          options={[...VIEWS]}
          value={state === 'stale' ? 'ready' : (state as (typeof VIEWS)[number]['value'])}
          onValueChange={setState}
        />
      </CardHeader>
      <CardContent>
        <StatusBar
          fill
          size="sm"
          label="Response time of the last 12 checks"
          cells={SPARK.map((ms, i) => ({
            tone: ms > 400 ? 'warning' : 'success',
            label: `Check ${String(12 - i)} ago, ${String(ms)} ms`,
          }))}
        />
      </CardContent>
      <CardFooter>
        <CardMeta
          source="Region: EU West"
          updatedAt={checked}
          onRefresh={() => setState('loading')}
          refreshing={state === 'loading'}
        />
      </CardFooter>
    </Card>
  );
};

export const Example = () => {
  const [paused, setPaused] = useState(false);
  return (
    <Block caption="Pause stops the checks and changes the badge. The Response time card has a switch for its states; Refresh shows loading for a moment, then the new time.">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <PageHeader
          variant="detail"
          title="Public API health"
          className="border-b border-border px-4"
          meta={
            <>
              <MetaItem label="URL">
                <span className="font-mono">https://api.example.com/health</span>
              </MetaItem>
              <MetaItem label="Every">1 min</MetaItem>
              <MetaItem label="Regions">3</MetaItem>
              <MetaItem>
                <Badge variant={paused ? 'outline-muted' : 'outline-success'}>
                  {paused ? 'Paused' : 'Active'}
                </Badge>
              </MetaItem>
            </>
          }
        >
          <Button size="sm" variant="outline" onClick={() => setPaused((p) => !p)}>
            {paused ? 'Resume' : 'Pause'}
          </Button>
          <DropdownMenu
            trigger={
              <IconButton
                icon={<UiIcon name="details" />}
                title="More actions"
                onClick={() => {}}
              />
            }
          >
            <DropdownMenuItem icon={<UiIcon name="refresh" />}>Check now</DropdownMenuItem>
            <DropdownMenuItem icon={<UiIcon name="download" />}>Download history</DropdownMenuItem>
          </DropdownMenu>
        </PageHeader>
        <div className="space-y-4 p-4">
          <StatusBar
            fill
            label="Last 90 checks of Public API health"
            cells={checkCells(90)}
            summary="Last 90 checks"
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] items-stretch gap-3">
            <StatCard
              title="Uptime"
              value="99.98%"
              trend={{ value: '+0.02 pt', direction: 'up' }}
              hint="99.96% before, 30 days"
            />
            <StatCard
              title="Response time"
              value="182 ms"
              trend={{ value: '-12 ms', direction: 'down', sentiment: 'down-is-good' }}
              hint="194 ms yesterday, p95"
            >
              <Sparkline
                data={[230, 214, 220, 201, 196, 188, 182]}
                chartLabel="Response time falling over 7 days."
              />
            </StatCard>
            <StatCard title="Incidents" value={3} hint="30 days">
              <DescriptionList variant="inline">
                <div>
                  <DescriptionTerm>Open</DescriptionTerm>
                  <DescriptionDetail>0</DescriptionDetail>
                </div>
                <div>
                  <DescriptionTerm>Longest</DescriptionTerm>
                  <DescriptionDetail>18 min</DescriptionDetail>
                </div>
              </DescriptionList>
            </StatCard>
            <StatCard
              title="Last check"
              value={paused ? 'Paused' : 'OK'}
              icon={
                <StatusGlyph
                  shape={paused ? 'slash' : 'check'}
                  tone={paused ? 'muted' : 'success'}
                  label={paused ? 'Paused' : 'Passing'}
                />
              }
              hint={<RelativeTime value={ago(1)} />}
            />
          </div>
          <Latency />
          <Card>
            <CardHeader>
              <CardTitle>Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MONITOR_INCIDENTS.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <StatusGlyph
                            shape={i.resolved ? 'check' : 'alert'}
                            tone={i.resolved ? 'success' : 'warning'}
                            label={i.resolved ? 'Resolved' : 'Open'}
                          />
                          {i.title}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <RelativeTime value={i.at} />
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {i.minutes > 0 ? `${String(i.minutes)} min` : 'Open'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Block>
  );
};
