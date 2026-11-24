'use client';
import { useState } from 'react';
import { Badge, Button, PageHeader, StatusGlyph, RelativeTime } from '../../../src';
import { Block } from '../../components/demo';
import { RESULT_GLYPH } from '../../lib/result-status';
import { SERVICES } from '../../lib/services-data';
import { HistoryCell, serviceMenu, TriggerCell } from '../../lib/services-list-parts';
import { ItemCard } from '../../lib/item-card';

const LOADED = Date.now();

export const Example = () => {
  const [rows, setRows] = useState(SERVICES);
  const [picked, setPicked] = useState<string[]>([]);
  const [opened, setOpened] = useState<string | null>(null);
  const pick = (id: string, on: boolean) =>
    setPicked((l) => (on ? [...l, id] : l.filter((x) => x !== id)));
  const setEnabled = (id: string, on: boolean) =>
    setRows((l) => l.map((s) => (s.id === id ? { ...s, enabled: on } : s)));
  const current = rows.find((s) => s.id === opened);
  return (
    <Block caption="Resize the window: the grid fits as many 260 px cards as the width allows. Tick cards to select them, use the switch to pause a service and click a title to open it.">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <PageHeader title="Services" className="border-b border-border px-4">
          {picked.length > 0 ? (
            <>
              <Badge count={picked.length} />
              <Button size="sm" variant="outline" onClick={() => setPicked([])}>
                Clear selection
              </Button>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">
              {current ? `Opened ${current.name}` : `${String(rows.length)} services`}
            </span>
          )}
        </PageHeader>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 p-4">
          {rows.map((s) => {
            const last = s.history.at(-1);
            return (
              <ItemCard
                key={s.id}
                title={s.name}
                indicator={
                  last ? (
                    <StatusGlyph {...RESULT_GLYPH[last]} />
                  ) : (
                    <StatusGlyph shape="dashed" tone="muted" label="No results yet" />
                  )
                }
                description={s.description}
                facts={[
                  { label: 'Trigger', value: <TriggerCell service={s} /> },
                  { label: 'Next', value: s.nextText },
                  { label: 'Owner', value: s.owner },
                  {
                    label: 'Last result',
                    value:
                      s.lastAgo === null ? (
                        s.lastText
                      ) : (
                        <RelativeTime value={LOADED - s.lastAgo * 60_000} />
                      ),
                  },
                ]}
                footer={
                  <>
                    <HistoryCell service={s} />
                    <span>{s.history.length} results</span>
                  </>
                }
                selected={picked.includes(s.id)}
                onSelectedChange={(on) => pick(s.id, on)}
                enabled={s.enabled}
                onEnabledChange={(on) => setEnabled(s.id, on)}
                menu={serviceMenu(s)}
                onOpen={() => setOpened(s.id)}
              />
            );
          })}
        </div>
      </div>
    </Block>
  );
};
