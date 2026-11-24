'use client';
import { useEffect, useMemo, useState } from 'react';
import { Button, LogView, ToggleGroup, type LogLine } from '../../src';
import { Block } from '../components/demo';
import { logLine, logLines } from '../lib/logs-data';

export const Example = () => {
  const [lines, setLines] = useState(() => logLines(200));
  const [follow, setFollow] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setLines((l) => [...l, logLine(l.length)]), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <Block caption="Live tail: new lines arrive every second; scroll up to pause, and Enter opens a line.">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-9 items-center gap-2 border-b border-border px-3 text-xs text-muted-foreground">
          <span className="flex-1">{lines.length} lines</span>
          <Button size="sm" variant="ghost" onClick={() => setFollow((f) => !f)}>
            {follow ? 'Pause' : 'Follow'}
          </Button>
        </div>
        <LogView
          lines={lines}
          follow={follow}
          onFollowChange={setFollow}
          aria-label="Service log"
        />
      </div>
    </Block>
  );
};

/** Fields with a cycle and a BigInt, and a time that is not a date: the view still renders. */
const odd = (): LogLine => {
  const cause: Record<string, unknown> = { code: 'ECONNRESET', bytes: 9007199254740993n };
  cause.self = cause;
  return {
    id: 'odd',
    time: 'not a date',
    level: 'warn',
    message: 'Retry after reset',
    fields: { cause },
  };
};

export const Variants = () => {
  const lines = useMemo(() => [...logLines(40), odd()], []);
  const [mode, setMode] = useState<'cut' | 'wrap'>('cut');
  return (
    <Block caption="Relative time and wrapped lines. Every level has a glyph as well as a tone; the search text is marked.">
      <div className="space-y-2">
        <ToggleGroup
          variant="segmented"
          value={mode}
          onValueChange={setMode}
          aria-label="Long lines"
          options={[
            { value: 'cut', label: 'Cut' },
            { value: 'wrap', label: 'Wrap' },
          ]}
        />
        <div className="rounded-lg border border-border bg-card">
          <LogView
            lines={lines}
            wrap={mode === 'wrap'}
            showTime="relative"
            highlight="upload"
            className="h-64"
            aria-label="Log with relative time"
          />
        </div>
      </div>
    </Block>
  );
};

export const Sizes = () => {
  const lines = useMemo(() => logLines(10_000), []);
  return (
    <Block caption="10,000 lines: only the visible rows are in the page, so scrolling stays smooth.">
      <div className="rounded-lg border border-border bg-card">
        <LogView lines={lines} className="h-72" aria-label="10,000 lines" />
      </div>
    </Block>
  );
};
