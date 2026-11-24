'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  DataTree,
  DatePicker,
  FilterMenu,
  ListToolbar,
  ListToolbarEnd,
  LogView,
  Sheet,
  StatusBar,
  StatusGlyph,
  ToolbarSearch,
  ToolbarToggle,
  type DateRange,
  type LogLine,
  type StatusBarCell,
} from '../../../src';
import { Block } from '../../components/demo';
import { countByLevel, logLine, logLines } from '../../lib/logs-data';

const LEVELS = [
  { value: 'error', label: 'Error', icon: <StatusGlyph shape="cross" tone="destructive" /> },
  { value: 'warn', label: 'Warning', icon: <StatusGlyph shape="alert" tone="warning" /> },
  { value: 'info', label: 'Info', icon: <StatusGlyph shape="dot" tone="muted" /> },
  { value: 'debug', label: 'Debug', icon: <StatusGlyph shape="dashed" tone="muted" /> },
];
const BUCKET = 40;

/** One tick per bucket of lines, toned by its worst level. */
const histogram = (lines: LogLine[]): StatusBarCell[] =>
  Array.from({ length: Math.ceil(lines.length / BUCKET) }, (_, i) => {
    const part = lines.slice(i * BUCKET, (i + 1) * BUCKET);
    const c = countByLevel(part);
    const tone = c.error ? 'destructive' : c.warn ? 'warning' : 'success';
    return {
      tone,
      label: `Lines ${String(i * BUCKET + 1)} to ${String(i * BUCKET + part.length)}: ${String(c.error)} errors, ${String(c.warn)} warnings`,
    };
  });

export const Example = () => {
  const [lines, setLines] = useState(() => logLines(1200));
  const [query, setQuery] = useState('');
  const [levels, setLevels] = useState<string[]>([]);
  const [range, setRange] = useState<DateRange | undefined>();
  const [follow, setFollow] = useState(true);
  const [picked, setPicked] = useState<LogLine | null>(null);
  useEffect(() => {
    const t = setInterval(() => setLines((l) => [...l, logLine(l.length)]), 1200);
    return () => clearInterval(t);
  }, []);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const from = range?.from.getTime() ?? -Infinity;
    const to = range?.to.getTime() ?? Infinity;
    return lines.filter((l) => {
      const t = Number(l.time);
      return (!q || l.message.toLowerCase().includes(q)) && t >= from && t <= to;
    });
  }, [lines, query, range]);
  const counts = countByLevel(shown);
  return (
    <Block caption="Search, filter by level and pick a range; open a line to read its fields.">
      <div className="flex h-[600px] min-h-0 overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex min-w-0 flex-1 flex-col">
          <ListToolbar aria-label="Log controls">
            <ToolbarSearch
              value={query}
              onValueChange={setQuery}
              placeholder="Search lines"
              className="w-56"
            />
            <FilterMenu
              groups={[
                {
                  id: 'level',
                  label: 'Level',
                  options: LEVELS.map((o) => ({ ...o, count: counts[o.value] })),
                },
              ]}
              value={{ level: levels }}
              onToggle={(_, v) =>
                setLevels((l) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]))
              }
              onClear={() => setLevels([])}
            />
            <DatePicker
              mode="range"
              value={range}
              onValueChange={setRange}
              placeholder="All time"
            />
            <ListToolbarEnd>
              <ToolbarToggle pressed={follow} onPressedChange={setFollow}>
                Live
              </ToolbarToggle>
            </ListToolbarEnd>
          </ListToolbar>
          <div className="border-b border-border px-4 py-2">
            <StatusBar
              fill
              size="sm"
              label="Levels over time"
              cells={histogram(shown)}
              summary={`${String(shown.length)} lines`}
            />
          </div>
          <LogView
            lines={shown}
            filter={levels.length ? levels : undefined}
            highlight={query}
            follow={follow}
            onFollowChange={setFollow}
            expandable={false}
            onLineOpen={setPicked}
            className="h-auto flex-1"
            aria-label="Log lines"
          />
        </div>
        <Sheet
          mode="docked"
          open={picked !== null}
          onOpenChange={(o) => !o && setPicked(null)}
          title={picked ? picked.message : 'Line'}
          defaultWidth={340}
        >
          {picked && (
            <DataTree
              value={{
                ...picked.fields,
                time: new Date(Number(picked.time)).toISOString(),
                level: picked.level,
              }}
              defaultExpandDepth={2}
              aria-label="Line fields"
            />
          )}
        </Sheet>
      </div>
    </Block>
  );
};
